<?php
// Category-related API actions

function handleCategoryRequest($method, $action, $conn)
{
    switch ($method) {
        case 'GET':
            getAllCategories($conn);
            break;
        case 'POST':
            createCategory($conn);
            break;
        case 'PUT':
            updateCategory($conn);
            break;
        case 'DELETE':
            deleteCategory($conn);
            break;
        default:
            http_response_code(405);  // Method Not Allowed
            echo json_encode(["message" => "Method not allowed"]);
    }
}

// Get all categories
function getAllCategories($conn)
{
    $result = $conn->query("SELECT * FROM categories");
    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    echo json_encode($categories);
}

// Create a new category
function createCategory($conn)
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['name'], $data['parent_id'])) {
        $stmt = $conn->prepare("INSERT INTO categories (name, parent_id) VALUES (?, ?)");
        $stmt->bind_param("si", $data['name'], $data['parent_id']);

        if ($stmt->execute()) {
            http_response_code(201);  // Created
            echo json_encode(["message" => "Category created successfully"]);
        } else {
            http_response_code(500);  // Internal Server Error
            echo json_encode(["message" => "Failed to create category"]);
        }
    } else {
        http_response_code(400);  // Bad Request
        echo json_encode(["message" => "Invalid input"]);
    }
}

// Update an existing category
function updateCategory($conn)
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'], $data['name'], $data['parent_id'])) {
        $stmt = $conn->prepare("UPDATE categories SET name = ?, parent_id = ? WHERE id = ?");
        $stmt->bind_param("sii", $data['name'], $data['parent_id'], $data['id']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Category updated successfully"]);
        } else {
            http_response_code(500);  // Internal Server Error
            echo json_encode(["message" => "Failed to update category"]);
        }
    } else {
        http_response_code(400);  // Bad Request
        echo json_encode(["message" => "Invalid input"]);
    }
}

// Delete a category
function deleteCategory($conn)
{
    parse_str(file_get_contents("php://input"), $data);

    if (isset($data['id'])) {
        $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->bind_param("i", $data['id']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Category deleted successfully"]);
        } else {
            http_response_code(500);  // Internal Server Error
            echo json_encode(["message" => "Failed to delete category"]);
        }
    } else {
        http_response_code(400);  // Bad Request
        echo json_encode(["message" => "Invalid input"]);
    }
}

?>
