import {renderHomePage} from "../pages/home.js";
import {renderProductsPage} from "../pages/products.js";
import {renderAccountPage} from "../pages/account.js";
import {renderLoginPage} from "../pages/user/login.js";
import {renderUserManagementPage} from "../pages/admin/users.js";
import {checkLoginStatus} from "../util/helper.js"
import {BACKEND_BASE_URL} from "../util/rest.js";
import {renderAdminSidebar, renderSidebar, renderUserSidebar} from "./sidebar.js";


export async function renderNavBar() {
    const user = await checkLoginStatus();

    document.getElementById("nav").innerHTML = `
        <div class="container-fluid p-0">
            <nav class="navbar navbar-expand-lg navbar-light bg-light w-100">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="static/img/logo.webp" alt="Logo" width="100px">
                        <button class="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav align-items-center">
    <li class="nav-item">
        <button id="homeBtn" class="btn btn-outline-primary border-0 mx-2">Home</button>
    </li>
    <li class="nav-item">
        <button id="productsBtn" class="btn btn-outline-primary border-0 mx-2">Products</button>
    </li>
    <li class="nav-item">
        <button id="accountBtn" class="btn btn-outline-primary border-0 mx-2">My Account</button>
    </li>
    ${user?.role === 'ROLE_ADMIN' ? `
        <li class="nav-item">
            <button id="adminBtn" class="btn btn-outline-danger border-0 mx-2">Admin</button>
        </li>
    ` : ''}
    ${user ? `
        <li class="nav-item">
            <button id="logoutBtn" class="btn btn-outline-secondary border-0 mx-2">Logout</button>
        </li>
    ` : `
        <li class="nav-item">
            <button id="loginBtn" class="btn btn-outline-success border-0 mx-2">Login</button>
        </li>
    `}
</ul>

                </div>
                    ${user ? `
                        <span class="navbar-text me-3">
                            Logged in as <strong>${user.username}</strong>
                        </span>
                    ` : ''}
                    
                </div>
                <div  class="ml-4">
                    Cart <span id="cartItemCount"></span>
                </div>
    
                
            </nav>
        </div>
    `;


    setupNavigation();
}


function setupNavigation() {
    document.getElementById("productsBtn")?.addEventListener("click", () => {
        renderProductsPage();
        renderSidebar();
    });

    document.getElementById("homeBtn")?.addEventListener("click", () => {
        renderHomePage();
        renderSidebar();
    });

    document.getElementById("accountBtn")?.addEventListener("click", () => {
        renderAccountPage();
        renderUserSidebar();
    });

    document.getElementById("loginBtn")?.addEventListener("click", () => {
        renderLoginPage();
        renderSidebar();
    });

    document.getElementById("adminBtn")?.addEventListener("click", () => {
        renderUserManagementPage();
        renderAdminSidebar();
    });


    document.getElementById("logoutBtn")?.addEventListener("click", async function () {
        try {
            await fetch(BACKEND_BASE_URL + "/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            console.log("✅ Logged out");
            renderLoginPage();        // redirect to login
            await renderNavBar();           // re-render navbar (login button shows)
        } catch (err) {
            console.error("Logout failed:", err);
        }
    });
}
