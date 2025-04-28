import {checkLoginStatus} from "../util/helper.js";
import {BACKEND_BASE_URL} from "../util/rest.js";


export function toggleCartSidebar() {
    document.getElementById("cartSidebar").classList.toggle("active");
    document.getElementById("cartOverlay").classList.toggle("active");
    console.log("Cart toggled.")
}

export async function addToCart(productId) {
    const user = await checkLoginStatus();

    if (user) {
        // User is logged in → use backend API
        try {
            const response = await fetch(BACKEND_BASE_URL + "/api/cart/items", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: parseInt(productId),
                    quantity: 1,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add item to cart on server.");
            }

            await loadCartSidebar(); // Refresh sidebar
        } catch (err) {
            console.error("API error while adding to cart:", err);
        }
    } else {
        // Guest → localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.productId == productId);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ productId: parseInt(productId), quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        await loadCartSidebar();
    }
}

export async function loadCartSidebar() {
    const user = await checkLoginStatus();
    const container = document.getElementById("cartItemsContainer");
    const totalCountEl = document.getElementById("cartTotalCount");

    let cartItems = [];

    if (user) {
        try {
            const res = await fetch(BACKEND_BASE_URL + "/api/cart", {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json(); // should match your CartResponse DTO
                cartItems = data.items;
            }
        } catch (err) {
            console.error("Failed to load cart from server:", err);
        }
    } else {
        cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    }

    // Render items
    container.innerHTML = "";
    let total = 0;

    cartItems.forEach((item) => {
        total += item.quantity;

        container.innerHTML += `
      <div class="mb-2 border-bottom pb-2">
        <strong>Product #${item.productId}</strong><br>
        Quantity: ${item.quantity}
      </div>
    `;
    });

    totalCountEl.textContent = total;
}
