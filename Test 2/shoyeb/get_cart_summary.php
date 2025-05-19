<?php
require 'db.php'; 

$pdo = getPDO(); 

if (!$pdo) {
    die(json_encode(["error" => "Database connection failed"]));
}

$user_id = $_GET['user_id'];

try {
    $stmt = $pdo->prepare("SELECT c.product_id AS id, c.quantity, p.name, p.price, p.image_url 
                       FROM cart c
                       JOIN products p ON c.product_id = p.id
                       WHERE c.user_id = :user_id");

    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
} catch (PDOException $e) {
    error_log("Query Error: " . $e->getMessage());
    echo json_encode(["error" => "Failed to fetch cart summary"]);
}
?>