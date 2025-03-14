<?php
// Set the content type to HTML
header('Content-Type: text/html; charset=UTF-8');

// Output the HTML documentation page
echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        h1 {
            color: #333;
        }
        p, li {
            color: #555;
        }
        .endpoint {
            background-color: #fff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .method {
            font-weight: bold;
            color: #007BFF;
        }
    </style>
</head>
<body>
    <h1>Welcome to the BytePort API</h1>
    <p>This is a simple API for managing products, categories, users, and more for BytePort, a consumer tech webshop.</p>
    
    <h2>Available API Endpoints</h2>

    <div class="endpoint">
        <h3>Products</h3>
        <ul>
            <li><span class="method">GET</span> /api/products - Get all products</li>
            <li><span class="method">GET</span> /api/products/{id} - Get a product by ID</li>
            <li><span class="method">GET</span> /api/products/byCategory?id={category_id} - Get products by category ID</li>
            <li><span class="method">POST</span> /api/products - Create a new product</li>
            <li><span class="method">PUT</span> /api/products/{id} - Update an existing product</li>
            <li><span class="method">DELETE</span> /api/products/{id} - Delete a product</li>
        </ul>
    </div>


    <div class="endpoint">
        <h3>Categories</h3>
        <ul>
            <li><span class="method">GET</span> /api/categories - Get all categories</li>
            <li><span class="method">POST</span> /api/categories - Create a new category</li>
            <li><span class="method">PUT</span> /api/categories/{id} - Update an existing category</li>
            <li><span class="method">DELETE</span> /api/categories/{id} - Delete a category</li>
        </ul>
    </div>

    <div class="endpoint">
        <h3>Users</h3>
        <ul>
            <li><span class="method">GET</span> /api/users - Get all users</li>
            <li><span class="method">POST</span> /api/users - Create a new user</li>
            <li><span class="method">PUT</span> /api/users/{id} - Update an existing user</li>
            <li><span class="method">DELETE</span> /api/users/{id} - Delete a user</li>
        </ul>
    </div>

    <div class="endpoint">
        <h3>Gift Cards</h3>
        <ul>
            <li><span class="method">GET</span> /api/gift-cards - Get all gift cards</li>
            <li><span class="method">POST</span> /api/gift-cards - Create a new gift card</li>
            <li><span class="method">PUT</span> /api/gift-cards/{id} - Update an existing gift card</li>
            <li><span class="method">DELETE</span> /api/gift-cards/{id} - Delete a gift card</li>
        </ul>
    </div>

    <div class="endpoint">
        <h3>Orders</h3>
        <ul>
            <li><span class="method">GET</span> /api/orders - Get all orders</li>
            <li><span class="method">GET</span> /api/orders/{id} - Get an order by ID</li>
            <li><span class="method">POST</span> /api/orders - Create a new order</li>
            <li><span class="method">PUT</span> /api/orders/{id} - Update an existing order</li>
            <li><span class="method">DELETE</span> /api/orders/{id} - Delete an order</li>
        </ul>
    </div>

    <div class="endpoint">
        <h3>Invoices</h3>
        <ul>
            <li><span class="method">GET</span> /api/invoices - Get all invoices</li>
            <li><span class="method">GET</span> /api/invoices/{id} - Get an invoice by ID</li>
            <li><span class="method">POST</span> /api/invoices - Create a new invoice</li>
            <li><span class="method">PUT</span> /api/invoices/{id} - Update an existing invoice</li>
            <li><span class="method">DELETE</span> /api/invoices/{id} - Delete an invoice</li>
        </ul>
    </div>

    <p>For more details about how to interact with these endpoints, refer to the API documentation.</p>
</body>
</html>';
?>
