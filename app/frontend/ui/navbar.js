import {renderHomePage} from "../pages/home.js";
import {renderProductsPage} from "../pages/products.js";
import {renderAccountPage} from "../pages/account.js";
import {renderLoginPage} from "../pages/login.js";
import {renderUserManagementPage} from "../pages/admin/users.js";

export function renderNavBar() {
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
                        <li class="nav-item">
                            <button id="homeBtn" class="nav-link">Home</button>
                        </li>
                        <li class="nav-item">
                            <button id="productsBtn" class="nav-link">Products</button>
                        </li>
                        <li class="nav-item">
                            <button id="accountBtn" class="nav-link">My Account</button>
                        </li>
                        <li class="nav-item">
                            <button id="logoutBtn" class="nav-link">Logout</button>
                        </ul>
                        <li class="nav-item">
                            <button id="loginBtn" class="nav-link">Login</button>
                        </ul>
                        <li class="nav-item">
                            <button id="userMgmtBtn" class="nav-link">User Mgmt.</button>
                        </ul>
                        
                    </div>
                </div>
            </div>
        </nav>
    `;
    setupNavigation();
}

// Function to handle navigation
function setupNavigation() {
    // Example: Adding event listener to a button with id 'productsBtn'
    document.getElementById("productsBtn").addEventListener("click", function () {
        renderProductsPage();
    });
    document.getElementById("homeBtn").addEventListener("click", function () {
        renderHomePage();
    });
    document.getElementById("accountBtn").addEventListener("click", function () {
        renderAccountPage();
    });
    document.getElementById("logoutBtn").addEventListener("click", function () {
        //handle logout
    });
    document.getElementById("loginBtn").addEventListener("click", function () {
        renderLoginPage();
    });
    document.getElementById("userMgmtBtn").addEventListener("click", function () {
        renderUserManagementPage();
    });
}