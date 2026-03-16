<?php
$conn = new mysqli("db", "root", "password", "lamp_db");

$id = $_GET["id"];

$sql = "DELETE FROM products WHERE id=$id";

$conn->query($sql);

header("Location: index.php");
?>