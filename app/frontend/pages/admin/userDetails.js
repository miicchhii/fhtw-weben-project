import { BACKEND_BASE_URL } from "../../util/rest.js";
import { renderUserManagementPage } from "./users.js";
import { formatPrice } from "../../util/helper.js";

export async function renderUserDetailsPage(userId) {
    try {
        //USER INFORMATION
        const userRes = await fetch(`${BACKEND_BASE_URL}/api/users/${userId}`, {
            credentials: "include",
        });

        if (!userRes.ok) {
            throw new Error("Fehler beim Laden der Benutzerdaten.");
        }

        const user = await userRes.json();

        document.getElementById("content").innerHTML = `
            <div class="container mt-4">
                <h2>User Details</h2>
                <div class="card p-3">
                    <p><strong>First Name:</strong> ${user.firstName}</p>
                    <p><strong>Last Name:</strong> ${user.lastName}</p>
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <p><strong>Address:</strong> ${user.address || "-"}</p>
                    <p><strong>Birthdate:</strong> ${user.birthdate || "-"}</p>
                    <p><strong>Status:</strong> ${user.active ? "Active" : "Inactive"}</p>
                </div>

               
                <div id="user-orders-section" class="mb-5">
                    <div class="text-muted">Loading orders...</div>
                </div>

                <button class="btn btn-primary mt-3" id="back-btn">Back</button>
            </div>
        `;

        document.getElementById("back-btn").addEventListener("click", () => {
            renderUserManagementPage();
        });

        // 3. Orders laden
        const res = await fetch(`${BACKEND_BASE_URL}/api/orders/user/${userId}`, {

            credentials: "include"
        });

        if (!res.ok) {
            throw new Error("Failed to fetch all orders");
        }

        const orders = (await res.json()).sort((a, b) => b.id - a.id);

        if (orders.length === 0) {
            document.getElementById("user-orders-section").innerHTML = `
                <div class="alert alert-info text-center m-5">
                    No orders have been placed yet.
                </div>
            `;
            return;
        }

        let orderHtml = `
            <div class="container mt-4">
                <h2>Manage Orders</h2>
        `;

        for (const order of orders) {
            let order_total = 0;

            orderHtml += `
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between flex-wrap">
                        <div><strong>Order #${order.id}</strong></div>
                        <div>${new Date(order.createdAt).toLocaleString()}</div>
                        <div class="w-100 mt-2 text-muted small">
                            Placed by: ${order.userName} (${order.userEmail})
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-sm">
                            <colgroup>
                                <col style="width: 50%;">
                                <col style="width: 10%;">
                                <col style="width: 15%;">
                                <col style="width: 20%;">
                                <col style="width: 5%;">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th style="text-align: right;">Price per Unit</th>
                                    <th style="text-align: right;">Line Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            for (const item of order.items) {
                let line_total = item.priceAtPurchase * item.quantity;
                order_total += line_total;

                orderHtml += `
                    <tr data-order-item-id="${item.orderItemId}">
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
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        orderHtml += `</div>`;
        document.getElementById("user-orders-section").innerHTML = orderHtml;



    } catch (err) {
        console.error("Error loading admin orders:", err);
        document.getElementById("content").innerHTML = `
            <div class="alert alert-danger text-center m-5">
                Failed to load orders.
            </div>
        `;
    }
}
