import {checkLoginStatus, formatPrice} from "../../util/helper.js";
import {BACKEND_BASE_URL} from "../../util/rest.js";
import {renderUserSidebar} from "../../ui/sidebar.js";

export async function renderOrdersPage() {
    renderUserSidebar();

    const user = await checkLoginStatus();

    if (!user) {
        document.getElementById("content").innerHTML = `
            <div class="alert alert-danger text-center m-5">
                You must be logged in to view your orders.
            </div>
        `;
        return;
    }

    let orders = [];

    try {
        const res = await fetch(BACKEND_BASE_URL + "/api/orders", {
            credentials: "include"
        });

        if (!res.ok) {
            throw new Error("Failed to fetch orders");
        }

        orders = await res.json();
    } catch (err) {
        console.error("Error loading orders:", err);
        document.getElementById("content").innerHTML = `
            <div class="alert alert-danger text-center m-5">
                Failed to load orders.
            </div>
        `;
        return;
    }

    if (orders.length === 0) {
        document.getElementById("content").innerHTML = `
            <div class="alert alert-info text-center m-5">
                You haven't placed any orders yet.
            </div>
        `;
        return;
    }

    let orderHtml = `
        <div class="container mt-4">
            <h2>Your Orders</h2>
    `;

    for (const order of orders) {
        orderHtml += `
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between">
                    <div><strong>Order #${order.id}</strong></div>
                    <div>${new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div class="card-body">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price at Purchase</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        for (const item of order.items) {
            orderHtml += `
                <tr>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(item.priceAtPurchase)}</td>
                </tr>
            `;
        }

        orderHtml += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    orderHtml += `</div>`;

    document.getElementById("content").innerHTML = orderHtml;
}
