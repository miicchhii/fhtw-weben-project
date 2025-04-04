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
        // TODO: Submit registration to your backend when ready
        alert("🛠 Registration logic coming soon!");
    });
}
