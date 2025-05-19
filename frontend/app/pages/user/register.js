import {BACKEND_BASE_URL} from "../../util/rest.js";
import { sanitizeInput } from "../../util/helper.js";
import {renderAccountPage} from "../account.js";


export function renderRegisterPage() {
    document.getElementById("content").innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
            <div class="card shadow p-4" style="width: 100%; max-width: 500px;">
                <h3 class="text-center mb-4">Register</h3>
                <form id="register-form">
                    <div class="mb-3"> 
                        <label for="firstName" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="firstName" required />
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="lastName" required />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" required />
                    </div>
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username" required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" required />
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="confirmPassword" required />
                    </div>
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-success">Create Account</button>
                        <button type="button" id="backToLoginBtn" class="btn btn-secondary">Back to Login</button>
                    </div>
                    <div id="register-error" class="text-danger mt-2 text-center" style="display: none;"></div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("backToLoginBtn").addEventListener("click", () => {
        import("./login.js").then(module => module.renderLoginPage());

    });





    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();


        const errorDiv = document.getElementById("register-error");
        errorDiv.style.display = "none"; // Reset error visibility
        errorDiv.textContent = ""; // Reset previous error messages

        // Gather and sanitize inputs
        const firstName = sanitizeInput(document.getElementById("firstName").value);
        const lastName = sanitizeInput(document.getElementById("lastName").value);
        const email = sanitizeInput(document.getElementById("email").value);
        const username = sanitizeInput(document.getElementById("username").value);
        const password = sanitizeInput(document.getElementById("password").value);
        const confirmPassword = sanitizeInput(document.getElementById("confirmPassword").value);

        // Validate inputs
        const errors = [];

        if (!firstName) errors.push("First name is required.");
        if (!lastName) errors.push("Last name is required.");
        if (!email) errors.push("Email is required.");
        if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("Invalid email address.");
        if (!username) errors.push("Username is required.");
        if (username && username.length < 3) errors.push("Username must be at least 3 characters long.");
        if (!password) errors.push("Password is required.");
        if (password && password.length < 8) errors.push("Password must be at least 8 characters.");
        if (password !== confirmPassword) errors.push("Passwords do not match.");

        if (errors.length > 0) {
            errorDiv.innerHTML = errors.join("<br>");
            errorDiv.style.display = "block";
            return;
        }

        const data = {
            firstName,
            lastName,
            email,
            username,
            passwordHash: password,
        };


        try {
            const res = await fetch(BACKEND_BASE_URL+"/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Registration failed");
            }

            alert("✅ Registration successful! Please log in.");
            import("./login.js").then(module => module.renderLoginPage());

        } catch (err) {
            const errorDiv = document.getElementById("register-error");
            errorDiv.textContent = err.message;
            errorDiv.style.display = "block";
        }
    });

}
