import {renderNavBar} from './ui/navbar.js';
import {renderProductsSidebar, renderSidebar} from './ui/sidebar.js';
import {renderHomePage} from './pages/home.js';
import { toggleCartSidebar, addToCart, loadCartSidebar } from "./ui/cartSidebar.js";


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
                  <div class="cart-header d-flex justify-content-between align-items-center p-3">
                    <h5 class="mb-0">Your Cart</h5>
                  </div>
                  <div id="cartItemsContainer" class="p-3"></div>
                  <div class="p-3 border-top">
                    <strong>Total Items: <span id="cartTotalCount">0</span></strong>
                  </div>
                </div>
                <div id="cartOverlay" class="cart-overlay" onclick="toggleCartSidebar()"></div>
            </div>
        </div>`;

    // Render sections
    await renderNavBar()
    renderSidebar();

    // Default page
    renderHomePage();

    document.addEventListener("DOMContentLoaded", async () => {
        // Attach Add to Cart buttons
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.dataset.productId;
                addToCart(productId);
            });
        });
        // Load cart on startup
        await loadCartSidebar();
    });


}
