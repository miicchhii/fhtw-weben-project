<?php
header('Content-Type: application/json');  // Set the content type to JSON

// Sample static data for customers and products
$customers = [
    ['id' => 1, 'name' => 'John Doe', 'email' => 'johndoe@example.com'],
    ['id' => 2, 'name' => 'Jane Smith', 'email' => 'janesmith@example.com'],
];

$products = [
    ['id' => 1, 'name' => 'Laptop', 'price' => 1200],
    ['id' => 2, 'name' => 'Phone', 'price' => 800],
];

// Get the request method and path
$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Determine whether the request is for /customers or /products
if (strpos($request_uri, '/api/customers') === 0) {
    $data = $customers;
    $endpoint = 'customers';
} elseif (strpos($request_uri, '/api/products') === 0) {
    $data = $products;
    $endpoint = 'products';
} else {
    echo json_encode(['error' => 'Invalid endpoint']);
    exit;
}

// Handle different request methods (GET, POST, PUT, DELETE)
switch ($request_method) {
    case 'GET':
        // GET: Return the data (filtered by ID if specified)
        if (isset($_GET['id'])) {
            // Get individual item by ID
            $id = $_GET['id'];
            $item = array_filter($data, fn($item) => $item['id'] == $id);
            if (empty($item)) {
                echo json_encode(['error' => 'Item not found']);
            } else {
                echo json_encode(array_values($item)[0]);
            }
        } else {
            // Return the entire data
            echo json_encode($data);
        }
        break;

    case 'POST':
        // POST: Add a new item
        $input_data = json_decode(file_get_contents('php://input'), true);
        if ($input_data && isset($input_data['name'])) {
            // Add the new item (simulating adding it to the array)
            $new_id = max(array_column($data, 'id')) + 1;
            $input_data['id'] = $new_id;
            $data[] = $input_data;
            echo json_encode(['message' => 'Item created', 'data' => $input_data]);
        } else {
            echo json_encode(['error' => 'Invalid data']);
        }
        break;

    case 'PUT':
        // PUT: Update an existing item
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $input_data = json_decode(file_get_contents('php://input'), true);
            $updated = false;
            foreach ($data as &$item) {
                if ($item['id'] == $id) {
                    $item = array_merge($item, $input_data);
                    $updated = true;
                    break;
                }
            }
            if ($updated) {
                echo json_encode(['message' => 'Item updated', 'data' => $item]);
            } else {
                echo json_encode(['error' => 'Item not found']);
            }
        } else {
            echo json_encode(['error' => 'ID not provided']);
        }
        break;

    case 'DELETE':
        // DELETE: Remove an item by ID
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $data = array_filter($data, fn($item) => $item['id'] != $id);
            echo json_encode(['message' => 'Item deleted']);
        } else {
            echo json_encode(['error' => 'ID not provided']);
        }
        break;

    default:
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
