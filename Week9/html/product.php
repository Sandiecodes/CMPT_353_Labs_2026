<?php
$conn = new mysqli("db", "root", "password", "lamp_db");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = $_POST["name"];
    $price = $_POST["price"];

    $sql = "INSERT INTO products (name, price)
            VALUES ('$name','$price')";

    $conn->query($sql);

    header("Location: index.php");
}
?>

<h2>Add Product</h2>

<form method="POST">

Name:<br>
<input type="text" name="name"><br><br>

Price:<br>
<input type="number" step="0.01" name="price"><br><br>

<input type="submit" value="Add Product">

</form>