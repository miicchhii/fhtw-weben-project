import {renderNavBar} from './ui/navbar.js';
import {renderProductsSidebar, renderSidebar} from './ui/sidebar.js';
import {renderHomePage} from './pages/home.js';
import {renderProductsPage} from './pages/products.js';
import {renderAccountPage} from "./pages/account.js";


document.addEventListener("DOMContentLoaded", init);

function init() {
    // Add the basic layout
    document.getElementById("body").innerHTML = `
        <div class="d-flex flex-column" style="height: 100vh">
            <div id="nav" class="border d-flex align-items-center flex-shrink-0"></div>
            <div class="d-flex flex-grow-1">
                <div id="sidebar" class="border d-none d-md-flex flex-column flex-shrink-0" style="width: 16.666%"></div>
                <div id="content" class="border d-flex flex-column flex-grow-1"></div>
            </div>
        </div>`;

    // Render sections
    renderNavBar();
    //renderSidebar();

    // Set up event listeners for page navigation
    setupNavigation();

    // Default page
    showPage("home");
}

// Function to handle navigation
function setupNavigation() {
    // Example: Adding event listener to a button with id 'productsBtn'
    document.getElementById("productsBtn").addEventListener("click", function () {
        showPage("products");
    });
    document.getElementById("homeBtn").addEventListener("click", function () {
        showPage("home");
    });
    document.getElementById("accountBtn").addEventListener("click", function () {
        showPage("account");
    });
    document.getElementById("logoutBtn").addEventListener("click", function () {
        //handle logout
    });

    // Add other navigation buttons in a similar way
}

function showPage(page) {
    switch (page) {
        case "home":
            renderHomePage();
            renderSidebar()
            break;
        case "products":
            renderProductsPage();
            renderProductsSidebar();
            break;
        case "account":
            renderAccountPage();
            renderSidebar()
            break;
        default:
            renderHomePage(); // Fallback to home if unknown page
            renderSidebar()
            break;
    }
}
