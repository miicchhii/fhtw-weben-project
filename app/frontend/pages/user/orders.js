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

        orders = (await res.json()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
        let order_total = 0;
        orderHtml += `
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between">
                    <div><strong>Order #${order.id}</strong></div>
                    <div>${new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div class="card-body">
                    <table class="table table-sm">
                        <colgroup>
                            <col style="width: 50%;">
                            <col style="width: 10%;">
                            <col style="width: 20%;">
                            <col style="width: 20%;">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th style="text-align: right;">Price per Unit</th>
                                <th style="text-align: right;">Line Total</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        for (const item of order.items) {
            let line_total = item.priceAtPurchase * item.quantity;
            order_total += line_total;
            orderHtml += `
                <tr>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td style="text-align: right;">${formatPrice(item.priceAtPurchase)}</td>
                    <td style="text-align: right;">${formatPrice(line_total)}</td>
                    
                </tr>
            `;

        }

        orderHtml += `
                            <tr>
                                <td><strong>Total</strong></td>
                                <td></td>
                                <td></td>
                                <td style="text-align: right;"><strong>${formatPrice(order_total)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    orderHtml += `</div>`;

    document.getElementById("content").innerHTML = orderHtml;
}
