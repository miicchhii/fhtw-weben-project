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
                    <div >
                    <button class="btn btn-primary mb-2" onclick="window.printInvoice(${order.id})">Print Invoice</button>
                    </div>
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


//INVOICE
window.printInvoice = async function(orderId) {
    try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/orders/${orderId}`, {
            credentials: "include"
        });

        if (!res.ok) {
            throw new Error("Failed to fetch order");
        }

        const order = await res.json();
        generateInvoicePDF(order);

    } catch (err) {
        console.error("Error generating invoice:", err);
        alert("Failed to generate invoice.");
    }
};


function generateInvoicePDF(order) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // === Firmendaten (Absender) ===
    const sender = {
        company: "BytePort",
        street: "Innovation Avenue 123",
        city: "Vienna",
        postal: "1010",
        country: "Austria",
        email: "info@byteport.com",
        phone: "+43 123 4567890",
        website: "www.byteport.com"
    };

    // === Kundendaten (Empfänger) ===
    const recipient = [
        `${order.userFirstName} ${order.userLastName}`,
        order.userAddress || "–"
    ];

    // === Rechnungsinformationen ===
    const invoiceNumber = `INV-${order.id}`;
    const invoiceDate = new Date().toLocaleDateString('en-GB');
    const dueDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d.toLocaleDateString('en-GB');
    })();

    // === Absenderadresse (linke obere Ecke) ===
    doc.setFontSize(10);
    doc.text([
        sender.company,
        sender.street,
        `${sender.postal} ${sender.city}`,
        sender.country,
        `Email: ${sender.email}`,
        `Phone: ${sender.phone}`,
        `Website: ${sender.website}`
    ], 14, 20);

    // === Rechnungsdetails (rechte obere Ecke) ===
    doc.setFontSize(12);
    doc.text("INVOICE", 200, 20, { align: "right" });
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${invoiceNumber}`, 200, 28, { align: "right" });
    doc.text(`Invoice Date: ${invoiceDate}`, 200, 34, { align: "right" });
    doc.text(`Due Date: ${dueDate}`, 200, 40, { align: "right" });

    // === Empfängeradresse ===
    doc.setFontSize(10);
    doc.text("Bill To:", 14, 52);
    doc.text(recipient, 14, 57);

    // === Tabelle mit Produkten ===
    const tableBody = order.items.map(item => [
        item.productName,
        item.quantity,
        formatPrice(item.priceAtPurchase),
        formatPrice(item.priceAtPurchase * item.quantity)
    ]);

    doc.autoTable({
        head: [["Product", "Quantity", "Unit Price", "Line Total"]],
        body: tableBody,
        startY: 75,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] }
    });

    // === Gesamtsumme ===
    const total = order.items.reduce(
        (sum, item) => sum + item.priceAtPurchase * item.quantity, 0
    );

    doc.setFontSize(12);
    doc.text(
        `Total: ${formatPrice(total)}`,
        200,
        doc.lastAutoTable.finalY + 10,
        { align: "right" }
    );

    // === Zahlungsinformation ===
    doc.setFontSize(10);
    doc.text("Payment Information:", 14, doc.lastAutoTable.finalY + 20);
    doc.text([
        "Bank: Example Bank",
        "IBAN: AT12 3456 7890 1234 5678",
        "BIC: EXAMPLEDW",
        "Please pay within 14 days to the account above."
    ], 14, doc.lastAutoTable.finalY + 25);

    // === Dankeszeile ===
    doc.setFontSize(9);
    doc.text(
        "Thank you for your business! If you have any questions about this invoice, please contact us.",
        14,
        doc.lastAutoTable.finalY + 45
    );

    // === Speichern ===
    doc.save(`Invoice_${order.id}.pdf`);
}










