<?php
$conn = new mysqli("db", "root", "password", "lamp_db");

$id = $_GET["id"];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = $_POST["name"];
    $price = $_POST["price"];

    $sql = "UPDATE products 
            SET name='$name', price='$price'
            WHERE id=$id";

    $conn->query($sql);

    header("Location: index.php");
}

$result = $conn->query("SELECT * FROM products WHERE id=$id");
$row = $result->fetch_assoc();
?>

<h2>Edit Product</h2>

<form method="POST">

Name:<br>
<input type="text" name="name" value="<?php echo $row['name']; ?>"><br><br>

Price:<br>
<input type="number" step="0.01" name="price" value="<?php echo $row['price']; ?>"><br><br>

<input type="submit" value="Update Product">

</form>