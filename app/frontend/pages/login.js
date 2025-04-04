import {renderNavBar} from "../ui/navbar.js";
import { renderRegisterPage } from "../pages/register.js";


export function renderLoginPage() {
    document.getElementById("content").innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
        <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
            <h3 class="text-center mb-4">Login</h3>
            <form id="login-form">
                <div class="mb-3">
                    <label for="login" class="form-label">Username or Email</label>
                    <input type="text" class="form-control" id="login" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required />
                </div>
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary">Log in</button>
                    <button type="button" id="registerBtn" class="btn btn-secondary">Register</button>
                </div>
                <div id="login-error" class="text-danger mt-2 text-center" style="display: none;"></div>
            </form>
        </div>
    </div>
`;

    const form = document.getElementById("login-form");
    const errorDiv = document.getElementById("login-error");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const login = document.getElementById("login").value;
        const passwordHash = document.getElementById("password").value; // hash if needed

        try {
            const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ login, passwordHash }),
            });

            if (!loginResponse.ok) throw new Error("Login failed");

            console.log("✅ Login successful");
            renderNavBar();

            const userRes = await fetch("http://localhost:8080/api/auth/me", {
                method: "GET",
                credentials: "include",
            });

            if (!userRes.ok) throw new Error("Failed to fetch user");

            const user = await userRes.json();

            // Render user info
            document.getElementById("content").innerHTML = `
                <div class="container mt-4">
                    <h2>Welcome, ${user.firstName} ${user.lastName}!</h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                </div>
            `;
        } catch (err) {
            console.error(err);
            errorDiv.textContent = err.message;
            errorDiv.style.display = "block";
        }



    });

    document.getElementById("registerBtn").addEventListener("click", () => {
        renderRegisterPage(); // switch to register view
    });

}
