import {renderNavBar} from './ui/navbar.js';
import {renderEmptySidebar} from './ui/sidebar.js';
import {renderHomePage} from './pages/home.js';
import {emptyCart, loadCartSidebar, toggleCartSidebar} from "./ui/cartSidebar.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    // Add the basic layout
    document.getElementById("body").innerHTML = `
        <div class="d-flex flex-column" style="height: 100vh">
            <div id="nav" class="border d-flex align-items-center flex-shrink-0"></div>
            <div id="main" class="d-flex flex-grow-1">
                <div id="sidebar" class="border d-none d-md-flex flex-column flex-shrink-0" style="width: 16.666%"></div>
                <div id="content" class="border d-flex flex-column flex-grow-1"></div>
                <!-- Right Cart Sidebar -->
                <div id="cartSidebar" class="cart-sidebar">
                  <div id="cartHeader"></div>  
                  <div id="cartItemsContainer" class="p-3"></div>
                  <div class="p-3 border-bottom" id="cartTotal"></div>
                  <div class="p-3 border-bottom" id="cartButtonArea"></div>
                </div>
                <div id="cartOverlay" class="cart-overlay"></div>
            </div>
        </div>`;

    // Attach cart sidebar overlay button
    document.getElementById("cartOverlay").addEventListener("click", toggleCartSidebar);

    // Attach emptyCart to window so onclick in HTML works
    window.emptyCart = emptyCart;
    window.toggleCartSidebar = toggleCartSidebar;

    // Render sections
    await renderNavBar();
    renderEmptySidebar();

    // Default page
    renderHomePage();

    // Load cart on startup
    await loadCartSidebar();

}
