import {renderHomePage} from "../pages/home.js";
import {renderProductsPage} from "../pages/products.js";
import {renderAccountPage} from "../pages/account.js";
import {renderLoginPage} from "../pages/login.js";
import {renderUserManagementPage} from "../pages/admin/users.js";
import {checkLoginStatus} from "../util/helper.js"


export async function renderNavBar() {
    const user = await checkLoginStatus(); // 🔐 check if user is logged in

    document.getElementById("nav").innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <img src="static/img/logo.webp" alt="Logo" width="100px">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item"><button id="homeBtn" class="nav-link">Home</button></li>
                        <li class="nav-item"><button id="productsBtn" class="nav-link">Products</button></li>
                        <li class="nav-item"><button id="accountBtn" class="nav-link">My Account</button></li>
                        ${user?.role === 'ROLE_ADMIN' ? `
                            <li class="nav-item"><button id="userMgmtBtn" class="nav-link">User Mgmt.</button></li>
                        ` : ''}
                        ${user ? `
                            <li class="nav-item"><button id="logoutBtn" class="nav-link">Logout</button></li>
                        ` : `
                            <li class="nav-item"><button id="loginBtn" class="nav-link">Login</button></li>
                        `}
                    </ul>
                </div>
            </div>
        </nav>
    `;

    setupNavigation();
}


function setupNavigation() {
    document.getElementById("productsBtn")?.addEventListener("click", renderProductsPage);
    document.getElementById("homeBtn")?.addEventListener("click", renderHomePage);
    document.getElementById("accountBtn")?.addEventListener("click", renderAccountPage);
    document.getElementById("loginBtn")?.addEventListener("click", renderLoginPage);
    document.getElementById("userMgmtBtn")?.addEventListener("click", renderUserManagementPage);

    document.getElementById("logoutBtn")?.addEventListener("click", async function () {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            console.log("✅ Logged out");
            renderLoginPage();        // redirect to login
            renderNavBar();           // re-render navbar (login button shows)
        } catch (err) {
            console.error("Logout failed:", err);
        }
    });
}
