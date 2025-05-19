<?php
require 'db.php';
header('Content-Type: application/json');

$pdo = getPDO();
if (!$pdo) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$user_id = $_POST['user_id'] ?? null;
if (!$user_id || !is_numeric($user_id)) {
    echo json_encode(["success" => false, "message" => "Invalid user ID"]);
    exit;
}

try {
    $pdo->beginTransaction();

    
    $cart_stmt = $pdo->prepare("
        SELECT c.product_id, c.quantity, p.price, p.name 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = :user_id
        FOR UPDATE");
    $cart_stmt->execute([':user_id' => $user_id]);
    $items = $cart_stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($items)) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Cart is empty"]);
        exit;
    }

    
    $total = 0;
    foreach ($items as $item) {
        if (!is_numeric($item['quantity']) || $item['quantity'] < 1) {
            throw new Exception("Invalid quantity for product {$item['name']}");
        }
        if (!is_numeric($item['price']) || $item['price'] <= 0) {
            throw new Exception("Invalid price for product {$item['name']}");
        }
        $total += $item['price'] * $item['quantity'];
    }

   
    $order_stmt = $pdo->prepare("
        INSERT INTO orders (user_id, total_amount, status) 
        VALUES (:user_id, :total, 'pending') 
        RETURNING id");
    $order_stmt->execute([':user_id' => $user_id, ':total' => $total]);
    $order_id = $order_stmt->fetchColumn();

    
    $item_stmt = $pdo->prepare("
        INSERT INTO order_items (order_id, product_id, quantity, price) 
        VALUES (:order_id, :product_id, :quantity, :price)");
    
    foreach ($items as $item) {
        $item_stmt->execute([
            ':order_id' => $order_id,
            ':product_id' => $item['product_id'],
            ':quantity' => $item['quantity'],
            ':price' => $item['price']
        ]);
    }


    $delete_stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = :user_id");
    $delete_stmt->execute([':user_id' => $user_id]);

    $pdo->commit();

    echo json_encode([
        "success" => true, 
        "order_id" => $order_id,
        "total" => number_format($total, 2)
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Order Error: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Database error occurred",
        "error" => $e->getMessage()
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}
?>