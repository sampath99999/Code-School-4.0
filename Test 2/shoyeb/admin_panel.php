<?php
require 'db.php';

header('Content-Type: application/json');

try {
    $pdo = getPDO();

    if ($_GET['action'] === 'users') {
        $stmt = $pdo->query("SELECT id, name, email FROM users");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    } 
    elseif ($_GET['action'] === 'order_items') {
        $stmt = $pdo->query("SELECT id, order_id, product_id, quantity, price FROM order_items");
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($items);
    }
    else {
        echo json_encode(['error' => 'Invalid action']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>