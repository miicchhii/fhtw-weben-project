<?php
// User-related API actions

function handleUserRequest($method, $action, $conn)
{
    switch ($method) {
        case 'GET':
            getAllUsers($conn);
            break;
        case 'POST':
            createUser($conn);
            break;
        case 'PUT':
            updateUser($conn);
            break;
        case 'DELETE':
            deleteUser($conn);
            break;
        default:
            http_response_code(405);  // Method Not Allowed
            echo json_encode(["message" => "Method not allowed"]);
    }
}

// Get all users
function getAllUsers($conn)
{
    $result = $conn->query("SELECT * FROM users");
    $users = [];

    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode($users);
}

// Create a new user
function createUser($conn)
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['username'], $data['password'], $data['role'])) {
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $data['username'], $hashedPassword, $data['role']);

        if ($stmt->execute()) {
            http_response_code(201);  // Created
            echo json_encode(["message" => "User created successfully"]);
        } else {
            http_response_code(500);  // Internal Server Error
            echo json_encode(["message" => "Failed to create user"]);
        }
    } else {
        http_response_code(400);  // Bad Request
        echo json_encode(["message" => "Invalid input"]);
    }
}

// Update an existing user
function updateUser($conn)
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'], $data['username'], $data['role'])) {
        $stmt = $conn->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
        $stmt->bind_param("ssi", $data['username'], $data['role'], $data['id']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            http_response_code(500);  // Internal Server Error
            echo json_encode(["message" => "Failed to update user"]);
        }
    } else {
        http_response_code(400);  // Bad Request
        echo json_encode(["message" => "Invalid input"]);
    }
}

// Delete a user
function deleteUser($conn)
{
    parse_str(file_get_contents("php://input"), $data);

    if (isset($data['id'])) {
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $data['id']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "User deleted successfully"]);
        } else {
            http_response_code(500);  // Internal Server Error
            echo json_encode(["message" => "Failed to delete user"]);
        }
    } else {
        http_response_code(400);  // Bad Request
        echo json_encode(["message" => "Invalid input"]);
    }
}

?>
