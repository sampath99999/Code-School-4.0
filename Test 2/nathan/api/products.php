<?php
require_once("./utils/db.php");
require_once("./utils/response.php");

try {
    $pdo = getPDO();
    $query = "SELECT * FROM products ORDER BY created_at DESC";
    $stmt = $pdo->query($query);

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::showSuccessMessage("Products fetched successfully", 200, $products);

} catch (PDOException $e) {
    Response::showErrorMessage("Database error: " . $e->getMessage(), 500);
}
