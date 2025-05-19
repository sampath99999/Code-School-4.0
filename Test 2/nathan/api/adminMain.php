<?php
require_once("./utils/validateToken.php");
require_once("./utils/response.php");   
require_once("./utils/db.php");



if (!isset($_POST['name'])) {
    Response::showErrorMessage("Product name is required", 400);
}
if (!isset($_POST['price']) || !is_numeric($_POST['price'])) {
    Response::showErrorMessage("Valid price is required", 400);
}


$name = trim($_POST['name']);
$description = trim($_POST['description'] ?? '');
$price = (float) $_POST['price'];
$stock_quantity = (int) ($_POST['stock_quantity'] ?? 0);
$image_url = trim($_POST['image_url'] ?? '');

try {
    $pdo = getPDO();

 
    $checkQuery = "SELECT COUNT(*) FROM products WHERE name = :name";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->bindValue(':name', $name, PDO::PARAM_STR);
    $checkStmt->execute();
    $exists = $checkStmt->fetchColumn();

    if ($exists) {
        Response::showErrorMessage("Product with the same name already exists", 409);
    }


    $query = "INSERT INTO products (name, description, price, stock_quantity, image_url)
              VALUES (:name, :description, :price, :stock_quantity, :image_url)";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':name', $name, PDO::PARAM_STR);
    $stmt->bindValue(':description', $description, PDO::PARAM_STR);
    $stmt->bindValue(':price', $price);
    $stmt->bindValue(':stock_quantity', $stock_quantity, PDO::PARAM_INT);
    $stmt->bindValue(':image_url', $image_url, PDO::PARAM_STR);
    $stmt->execute();

    Response::showSuccessMessage("Product added successfully", 201);
} 
catch (Exception $e) {
    Response::showErrorMessage("Error: " . $e->getMessage(), 500);
}
