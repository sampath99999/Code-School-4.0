<?php
session_start();
require 'db.php';

$pdo = getPDO();  // PDO object yahan milega

if (!$pdo) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $product_id = $_POST['product_id'];
    $quantity = $_POST['quantity'];

    // Check if item already in cart
    $stmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$user_id, $product_id]);

    if ($stmt->rowCount() > 0) {
        // If exists, update quantity
        $update = $pdo->prepare("UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?");
        $update->execute([$quantity, $user_id, $product_id]);
    } else {
        // Else, insert new item
        $insert = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $insert->execute([$user_id, $product_id, $quantity]);
    }

    echo json_encode(['success' => true, 'message' => 'Product added to cart']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
