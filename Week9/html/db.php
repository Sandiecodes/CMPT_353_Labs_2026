<?php
$servername = "db";           
$username   = "root";        
$password   = "password";   
$dbname     = "lamp_db";     

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create the products table if it doesn’t exist
$createTableSql = "CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($createTableSql);

// Check if the table is empty
$checkSql = "SELECT COUNT(*) AS total FROM products";
$result = $conn->query($checkSql);
$row = $result->fetch_assoc();

if ($row['total'] == 0) {  // Only insert if table is empty
    $insertSql = "INSERT INTO products (name, price) VALUES 
        ('Product A', 19.99),
        ('Product B', 29.99),
        ('Product C', 39.99)";
    $conn->query($insertSql);
}

// Fetch and display all products
$querySql = "SELECT id, name, price, created_at FROM products";
$result = $conn->query($querySql);

if ($result->num_rows > 0) {
    echo "<h3>Products:</h3>";
    while($row = $result->fetch_assoc()) {
        echo "ID: " . $row["id"] . " - Name: " . $row["name"] . 
             " - Price: $" . $row["price"] . 
             " - Created At: " . $row["created_at"] . "<br>";
    }
} else {
    echo "No records found.<br>";
}

$conn->close();
?>
