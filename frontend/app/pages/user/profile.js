import {BACKEND_BASE_URL} from "../../util/rest.js";
import {checkLoginStatus, sanitizeInput} from "../../util/helper.js";
import {renderUserSidebar} from "../../ui/sidebar.js";

export async function renderProfilePage() {
    renderUserSidebar();

    const user = await checkLoginStatus();

    if (!user) {
        document.getElementById("content").innerHTML = `
            <div class="alert alert-danger text-center m-5">
                You must be logged in to view your profile.
            </div>
        `;
        return;
    }

    let profile;
    try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/auth/me`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            credentials: "include" // session-based auth
        });

        if (!res.ok && res.status !== 403) {
            const err = await res.json();
            throw new Error(err.error || "Failed to load user data.");
        }
        profile = await res.json();

    } catch (err) {
        document.getElementById("content").innerHTML = `
            <div class="alert alert-danger text-center m-5">
                ${err.message}
            </div>
        `;
        return;
    }

    document.getElementById("content").innerHTML = `
        <div class="container mt-4">
            <div class="card shadow p-4">
                <h3 class="mb-4">Profile Settings for ${profile.username}</h3>
                <form id="profile-form">
                    <div class="mb-3">
                        <label for="firstName" class="form-label">First Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="firstName" value="${profile.firstName || ''}" required />
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Last Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="lastName" value="${profile.lastName || ''}" required />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                        <input type="email" class="form-control" id="email" value="${profile.email || ''}" required />
                    </div>
                    <div class="mb-3">
                        <label for="username" class="form-label">Username <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="username" value="${profile.username || ''}" required />
                    </div>
                    <div class="mb-3">
                        <label for="address" class="form-label">Address</label>
                        <input type="text" class="form-control" id="address" value="${profile.address || ''}" />
                    </div>
                    <div class="mb-3">
                        <label for="birthdate" class="form-label">Birthdate</label>
                        <input type="date" class="form-control" id="birthdate" value="${profile.birthdate ? profile.birthdate.split('T')[0] : ''}" />
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Current Password <span class="text-danger">*</span></label>
                        <input type="password" class="form-control" id="confirmPassword" required />
                        <div class="form-text">Enter your current password to confirm changes.</div>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                    <div>
                        <span class="text-danger">*</span> required fields
                    </div>
                    <div id="profile-error" class="text-center mt-3 text-danger" style="display: none;"></div>
                    
                </form>
            </div>
        </div>
    `;

    document.getElementById("profile-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const errorDiv = document.getElementById("profile-error");
        errorDiv.style.display = "none";
        errorDiv.textContent = "";

        const updatedData = {
            firstName: sanitizeInput(document.getElementById("firstName").value),
            lastName: sanitizeInput(document.getElementById("lastName").value),
            email: sanitizeInput(document.getElementById("email").value),
            username: sanitizeInput(document.getElementById("username").value),
            address: sanitizeInput(document.getElementById("address").value),
            birthdate: document.getElementById("birthdate").value,
            password: document.getElementById("confirmPassword").value,
        };

        const errors = [];
        if (!updatedData.firstName) errors.push("First name is required.");
        if (!updatedData.lastName) errors.push("Last name is required.");
        if (!updatedData.email || !/^\S+@\S+\.\S+$/.test(updatedData.email)) errors.push("Valid email is required.");
        if (!updatedData.username || updatedData.username.length < 3) errors.push("Username must be at least 3 characters.");

        if (errors.length > 0) {
            errorDiv.innerHTML = errors.join("<br>");
            errorDiv.style.display = "block";
            return;
        }

        try {
            const res = await fetch(`${BACKEND_BASE_URL}/api/users/me`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(updatedData)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Profile update failed.");
            }

            alert("✅ Profile updated successfully!");
        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.style.display = "block";
        }
    });
}
