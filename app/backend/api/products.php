<?php
// Product-related API actions

function handleProductRequest($method, $action, $conn)
{
    if ($method === 'GET') {
        if ($action === 'byCategory' && isset($_GET['id'])) {
            getProductsByCategory($conn, intval($_GET['id']));
        } else {
            getAllProducts($conn);
        }
    } elseif ($method === 'POST') {
        createProduct($conn);
    } else {
        http_response_code(405);  // Method Not Allowed
        echo json_encode(["message" => "Method not allowed"]);
    }
}

// Get all products
function getAllProducts($conn)
{
    $result = $conn->query("SELECT * FROM products");
    $products = [];

    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);
}

// Get products by category
function getProductsByCategory($conn, $categoryId)
{
    $stmt = $conn->prepare("SELECT * FROM products WHERE category_id = ?");
    $stmt->bind_param("i", $categoryId);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);
}

// Create a new product
function createProduct($conn)
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['name'], $data['price'], $data['category_id'])) {
        $stmt = $conn->prepare("INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)");
        $stmt->bind_param("sdi", $data['name'], $data['price'], $data['category_id']);

        if ($stmt->execute()) {
            http_response_code(201);  // Created
            echo json_encode(["message" => "Product created successfully"]);
        } else {
            http_response_code(500);  // Internal Server Error
            echo json_encode(["message" => "Failed to create product"]);
        }
    } else {
        http_response_code(400);  // Bad Request
        echo json_encode(["message" => "Invalid input"]);
    }
}

?>
