<?php
// Main router for the API


// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');  // You can specify the allowed origin instead of * (e.g., 'http://localhost:1234')
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');  // Allowed methods
header('Access-Control-Allow-Headers: Content-Type, Authorization');  // Allowed headers

header('Content-Type: application/json');

// Enable error display for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include database connection
require './dbaccess.php';  // Database connection

// Get the HTTP method (GET, POST, etc.)
$method = $_SERVER['REQUEST_METHOD'];

// Use REQUEST_URI to get the full URL
$requestUri = $_SERVER['REQUEST_URI'];  // Full request URI
error_log("REQUEST_URI: " . $requestUri);  // Log the entire URI for debugging

// Strip the base path if needed (e.g., "/api")
$basePath = '/api';
$path = str_replace($basePath, '', $requestUri);  // Remove '/api' prefix

// Remove any query string if present
$path = strtok($path, '?');

// Trim slashes from the start and end of the path
$path = trim($path, '/');

$pathParts = explode('/', $path);  // Split path into segments

// Extract resource and action from the URL
$resource = $pathParts[0] ?? '';  // Resource being requested (e.g., products, categories)
$action = $pathParts[1] ?? null;  // Optional action (e.g., byCategory)

// Log resource and action for debugging
error_log("Resource: $resource, Action: $action");
switch ($resource) {
    case 'products':
        require 'products.php';
        handleProductRequest($method, $action, $conn);
        break;
    case 'categories':
        require 'categories.php';
        handleCategoryRequest($method, $action, $conn);
        break;
    case 'users':
        require 'users.php';
        handleUserRequest($method, $action, $conn);
        break;
    default:
        http_response_code(404);
        echo json_encode([
            "message" => "Resource not found",
            "requested_resource" => $resource,
            "requested_action" => $action
        ]);
}
?>
