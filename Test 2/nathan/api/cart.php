<?php
require_once("./utils/db.php");
require_once("./utils/response.php");

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;
$headers = apache_request_headers();
$token = $headers["Authorization"] ?? null;
$pdo = getPDO();

function getUserIdFromToken($token, $pdo) {
    $query = "SELECT id FROM users WHERE token = :token";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":token", $token, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result["id"] ?? null;
}


if ($method === 'GET' && $action === 'get') {
    if (!$token) {
        Response::showErrorMessage("Authentication token missing", 401);
        exit;
    }

    $user_id = getUserIdFromToken($token, $pdo);
    if (!$user_id) {
        Response::showErrorMessage("Invalid token", 401);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                ci.product_id AS id,
                p.name,
                p.price,
                p.image_url,
                ci.quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = :user_id
        ");
        $stmt->execute([':user_id' => $user_id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::showSuccessMessage("Cart fetched successfully", 200, $items);
    } catch (PDOException $e) {
        Response::showErrorMessage("Database error: " . $e->getMessage(), 500);
    }
}


elseif ($method === 'POST') {
    $product_id = $_POST['product_id'] ?? null;
    $quantity = $_POST['quantity'] ?? 1;

    if (!$token) {
        Response::showErrorMessage("Authentication token missing", 401);
        exit;
    }

    $user_id = getUserIdFromToken($token, $pdo);
    if (!$user_id) {
        Response::showErrorMessage("Invalid token", 401);
        exit;
    }

    if (!$product_id) {
        Response::showErrorMessage("Product ID is required", 400);
        exit;
    }

    try {
        
        $check = $pdo->prepare("SELECT quantity FROM cart_items WHERE user_id = :user_id AND product_id = :product_id");
        $check->execute([':user_id' => $user_id, ':product_id' => $product_id]);
        $existing = $check->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            $update = $pdo->prepare("UPDATE cart_items SET quantity = quantity + :quantity WHERE user_id = :user_id AND product_id = :product_id");
            $update->execute([
                ':quantity' => $quantity,
                ':user_id' => $user_id,
                ':product_id' => $product_id
            ]);
            Response::showSuccessMessage("Cart updated successfully", 200);
        } else {
            $insert = $pdo->prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)");
            $insert->execute([
                ':user_id' => $user_id,
                ':product_id' => $product_id,
                ':quantity' => $quantity
            ]);
            Response::showSuccessMessage("Product added to cart successfully", 200);
        }

    } catch (PDOException $e) {
        Response::showErrorMessage("Database error: " . $e->getMessage(), 500);
    }
}
?>
