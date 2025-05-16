import {checkLoginStatus, formatPrice} from "../util/helper.js";
import {BACKEND_BASE_URL} from "../util/rest.js";


export function toggleCartSidebar() {
    document.getElementById("cartSidebar").classList.toggle("active");
    document.getElementById("cartOverlay").classList.toggle("active");
    console.log("Cart toggled.")
}

export async function addToCart(productId) {
    const user = await checkLoginStatus();

    if (user) {
        // Server-side cart logic (already correct)
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
                Toastify({
                    text: "Failed to fetch cart before updating quantity.",
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }
                }).showToast();
                throw new Error("Failed to add item to cart on server.");
            } else {
                Toastify({
                    text: "Added Item to Cart.",
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            }

            await loadCartSidebar();
        } catch (err) {
            Toastify({
                text: "API error while adding to cart.",
                duration: 3000,
                style: {
                    background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }
            }).showToast();
            // console.error("API error while adding to cart:", err);
        }
    } else {
        // Guest cart: fetch full product info
        try {
            const res = await fetch(BACKEND_BASE_URL + `/api/products/${productId}`);
            if (!res.ok) {
                Toastify({
                    text: "Failed to add Item to Cart.",
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }
                }).showToast();
                throw new Error("Failed to fetch product info.");
            } else {
                Toastify({
                    text: "Added Item to Cart.",
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            }

            const product = await res.json();

            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existing = cart.find((item) => item.productId == productId);

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    productId: product.id,
                    quantity: 1,
                    productName: product.name,
                    productPrice: product.price
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            await loadCartSidebar();
        } catch (err) {
            console.error("Error fetching product for guest cart:", err);
        }
    }
}


export async function emptyCart() {
    const user = await checkLoginStatus();

    if (user) {
        // Clear cart on server
        try {
            const response = await fetch(BACKEND_BASE_URL + "/api/cart", {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to empty server cart.");
            }
        } catch (error) {
            console.error("Error emptying cart:", error);
        }
    } else {
        // Clear localStorage cart for guests
        localStorage.removeItem("cart");
    }

    // Reload sidebar
    await loadCartSidebar();
}

export async function increaseQuantity(productId) {
    await updateCartItem(productId, 1);
}

export async function decreaseQuantity(productId) {
    await updateCartItem(productId, -1);
}

export async function loadCartSidebar() {
    const user = await checkLoginStatus();
    const container = document.getElementById("cartItemsContainer");
    const cartItemCountEl = document.getElementById("cartItemCount");
    const cartTotalEl = document.getElementById("cartTotal");
    const cartButtonArea = document.getElementById("cartButtonArea");

    let cartItems = [];

    const cartHeader = document.getElementById("cartHeader");
    cartHeader.innerHTML = `
        <div class="cart-header d-flex justify-content-between align-items-center p-3">
            <h5 class="mb-0">Your Cart</h5>
            <button class="btn btn-outline-danger border-0 btn-sm me-2" onclick="emptyCart()" title="Empty Cart">
                🗑️
            </button>
        </div>
    `;


    if (user) {
        try {
            const res = await fetch(BACKEND_BASE_URL + "/api/cart", {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
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
    let cartItemCount = 0;

    cartItems.forEach((item) => {
        cartItemCount += item.quantity;
        total += item.productPrice * item.quantity;

        container.innerHTML += `
          <div class="mb-2 border-bottom pb-2 d-flex justify-content-between align-items-center">
            <div>
              <strong>${item.productName}</strong><br>
              Price: ${formatPrice(item.productPrice)}<br>
              Quantity: <span id="quantity-${item.productId}">${item.quantity}</span>
            </div>
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-outline-primary border-0 me-1" data-action="increase" data-product-id="${item.productId}">+</button>
              <button class="btn btn-sm btn-outline-primary border-0 me-1" data-action="decrease" data-product-id="${item.productId}">-</button>
              <button class="btn btn-sm btn-outline-danger border-0" data-action="remove" data-product-id="${item.productId}">🗑️</button>
            </div>
          </div>
        `;
        container.querySelectorAll("button[data-action]").forEach(button => {
            button.addEventListener("click", async () => {
                const action = button.getAttribute("data-action");
                const productId = button.getAttribute("data-product-id");

                if (action === "increase") {
                    await increaseQuantity(productId);
                } else if (action === "decrease") {
                    await decreaseQuantity(productId);
                } else if (action === "remove") {
                    await removeItem(productId);
                }
            });
        });


    });

    cartItemCountEl.innerHTML = "(" + cartItemCount + ")";

    if (total > 0) {
        cartTotalEl.innerHTML = "<strong>Total: " + formatPrice(total) + "</strong>";
        if (user) {
            cartButtonArea.innerHTML = `<button class="btn btn-success" id="placeOrderBtn">Place Order</button>`;

            document.getElementById("placeOrderBtn").addEventListener("click", async () => {
                try {
                    const response = await fetch(BACKEND_BASE_URL + "/api/orders", {
                        method: "POST",
                        credentials: "include"
                    });
                    if (!response.ok) {
                        throw new Error("Failed to place order.");
                    }
                    Toastify({
                        text: "Order placed successfully!",
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();

                    await loadCartSidebar(); // Cart will be empty now
                } catch (err) {
                    console.error("Order placement failed:", err);
                }
            });
        }
    } else {
        cartTotalEl.innerHTML = "<strong>Your Cart is empty!</strong>";
        cartButtonArea.innerHTML = ``;
    }
}

export async function removeItem(productId) {
    const user = await checkLoginStatus();

    if (user) {
        // Remove from server
        try {
            const res = await fetch(BACKEND_BASE_URL + `/api/cart/items/${productId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to remove item from server cart.");
        } catch (err) {
            console.error(err);
        }
        Toastify({
            text: "Item removed from Cart!",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    } else {
        // Remove from guest cart
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.productId !== parseInt(productId));
        localStorage.setItem("cart", JSON.stringify(cart));
        Toastify({
            text: "Item removed from Cart!",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }

    await loadCartSidebar();
}

async function updateCartItem(productId, change) {
    const user = await checkLoginStatus();

    if (user) {
        // For server cart
        try {
            // Fetch the current cart
            const res = await fetch(BACKEND_BASE_URL + "/api/cart", {
                credentials: "include",
            });

            if (!res.ok) {
                // console.error("Failed to fetch cart before updating quantity.");
                Toastify({
                    text: "Failed to fetch cart before updating quantity.",
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }
                }).showToast();
                return;
            }

            const data = await res.json();
            const currentItem = data.items.find(item => item.productId === parseInt(productId));

            if (!currentItem) {
                console.error("Item not found in cart");
                Toastify({
                    text: "Item not found in cart.",
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }
                }).showToast();
                return;
            }

            const newQuantity = currentItem.quantity + change;

            if (newQuantity <= 0) {
                // Quantity dropped to zero, remove item
                const deleteRes = await fetch(BACKEND_BASE_URL + `/api/cart/items/${productId}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                if (!deleteRes.ok) {
                    // console.error("Failed to delete item from server cart.");
                    Toastify({
                        text: "Failed to delete item from server cart.",
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                        }
                    }).showToast();
                    return;
                } else {
                    Toastify({
                        text: "Removed item from cart.",
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();
                }
            } else {
                // Update item quantity
                const updateRes = await fetch(BACKEND_BASE_URL + "/api/cart/items", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: parseInt(productId),
                        quantity: change
                    }),
                });

                if (!updateRes.ok) {
                    // console.error("Failed to update item quantity on server cart.");
                    Toastify({
                        text: "Failed to update item quantity on server cart.",
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                        }
                    }).showToast();
                    return;
                } else {
                    Toastify({
                        text: "Updated item amount.",
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();
                }
            }
        } catch (error) {
            console.error("Server cart update error:", error);
        }
    } else {
        // For guest cart: update localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const item = cart.find(i => i.productId === parseInt(productId));
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                // Remove item if quantity <= 0
                const updatedCart = cart.filter(i => i.productId !== parseInt(productId));
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            } else {
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        }
    }

    await loadCartSidebar();
}



