import { checkLoginStatus } from "../../util/helper.js";
import { renderUserSidebar } from "../../ui/sidebar.js";
import { BACKEND_BASE_URL } from "../../util/rest.js";

export async function renderChangePasswordPage() {
    renderUserSidebar();

    const user = await checkLoginStatus();

    if (!user) {
        // user is not logged in --> show error message
        document.getElementById("content").innerHTML = `
            <div class="alert alert-danger text-center m-5">
                You must be logged in to change your password.
            </div>
        `;
        return;
    }

    // if user is logged in --> show form
    document.getElementById("content").innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
        <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
            <h3 class="text-center mb-4">Change Password for ${user.username}</h3>
            <form id="change-password-form">
                <div class="mb-3">
                    <label for="oldPassword" class="form-label">Old Password</label>
                    <input type="password" class="form-control" id="oldPassword" required />
                </div>
                <div class="mb-3">
                    <label for="newPassword" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="newPassword" required />
                </div>
                <div class="mb-3">
                    <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control" id="confirmNewPassword" required />
                </div>
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary">Change Password</button>
                </div>
                <div id="change-password-message" class="text-center mt-3"></div>
            </form>
        </div>
    </div>
    `;

    const form = document.getElementById("change-password-form");
    const messageDiv = document.getElementById("change-password-message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const oldPasswordInput = document.getElementById("oldPassword");
        const newPasswordInput = document.getElementById("newPassword");
        const confirmNewPasswordInput = document.getElementById("confirmNewPassword");

        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;

        if (newPassword !== confirmNewPassword) {
            messageDiv.textContent = "New passwords do not match.";
            messageDiv.className = "text-danger";

            // rest fields
            oldPasswordInput.value = "";
            newPasswordInput.value = "";
            confirmNewPasswordInput.value = "";
            return;
        }

        try {
            const response = await fetch(BACKEND_BASE_URL + "/api/auth/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // rest fields
                form.reset();

                throw new Error(errorData.message || "Failed to change password.");

            }

            messageDiv.textContent = "Password changed successfully!";
            messageDiv.className = "text-success";
            form.reset();
        } catch (err) {
            console.error(err);
            messageDiv.textContent = err.message;
            messageDiv.className = "text-danger";


            oldPasswordInput.value = "";
            newPasswordInput.value = "";
            confirmNewPasswordInput.value = "";
        }
    });

}
