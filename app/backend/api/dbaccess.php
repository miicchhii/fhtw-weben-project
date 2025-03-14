<?php
// Database connection script (renamed from db.php)

$host = "mysql";  // Database host
$user = "root";  // Database username
$password = "password";  // Database password
$dbname = "webshop";  // Your webshop database name

// Create a new connection to the database
$conn = new mysqli($host, $user, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
<?php
