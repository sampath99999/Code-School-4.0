<?php
header('Content-Type: application/json');
require_once 'db.php';

$pdo = getPDO();
$category = $_GET['category'] ?? '';

// Allow only valid categories
$allowed = ['mobile', 'laptops', 'accessories'];
if (!in_array(strtolower($category), $allowed)) {
    echo json_encode([]);
    exit;
}

// Fetch products
$stmt = $pdo->prepare("SELECT * FROM products WHERE category = ?");
$stmt->execute([$category]);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Convert price to float to avoid JS error
foreach ($products as &$product) {
    $product['price'] = (float)$product['price'];
}

echo json_encode($products);
