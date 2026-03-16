<?php
$conn = new mysqli("db", "root", "password", "lamp_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM products";
$result = $conn->query($sql);

echo "<h2>Product List</h2>";
echo "<a href='product.php'>Add New Product</a><br><br>";

if ($result->num_rows > 0) {

    echo "<table border='1'>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
            </tr>";

    while($row = $result->fetch_assoc()) {

        echo "<tr>
        <td>".$row['id']."</td>
        <td>".$row['name']."</td>
        <td>$".$row['price']."</td>
        <td>
            <a href='edit.php?id=".$row['id']."'>Edit</a> |
            <a href='delete.php?id=".$row['id']."'>Delete</a>
        </td>
        </tr>";
    }

    echo "</table>";
}

$conn->close();
?>