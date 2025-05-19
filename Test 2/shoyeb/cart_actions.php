<?php
require 'db.php';

$pdo = getPDO();
if (!$pdo) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

session_start();
$user_id = null;

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');


if ($action === 'get_cart' && isset($_GET['user_id'])) {
    $user_id = intval($_GET['user_id']);
} elseif (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
} elseif (isset($_POST['user_id'])) {
    $user_id = intval($_POST['user_id']);
}

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit;
}

try {
    $pdo->beginTransaction();

    switch ($action) {
        case 'get_cart':
            $sql_fetch = "
                SELECT
                    cart.id,
                    products.name,
                    products.price::float AS price,
                    products.image_url,
                    cart.quantity
                FROM cart
                JOIN products ON cart.product_id = products.id
                WHERE cart.user_id = ?
            ";
            $stmt_fetch = $pdo->prepare($sql_fetch);
            $stmt_fetch->execute([$user_id]);
            $cartItems = $stmt_fetch->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($cartItems);
            break;

        case 'update_quantity':
            if (!isset($_POST['item_id']) || !isset($_POST['quantity'])) {
                throw new Exception('Missing item ID or quantity for updating cart');
            }
            $item_id_update = intval($_POST['item_id']);
            $quantity_update = intval($_POST['quantity']);

            if ($quantity_update < 1) {
                throw new Exception('Quantity must be at least 1');
            }

            $sql_update = "
                UPDATE cart
                SET quantity = ?
                WHERE id = ? AND user_id = ?
            ";
            $stmt_update = $pdo->prepare($sql_update);
            $stmt_update->execute([$quantity_update, $item_id_update, $user_id]);

            if ($stmt_update->rowCount() > 0) {
                echo json_encode(['success' => true]);
            } else {
                throw new Exception('Failed to update cart item');
            }
            break;

        case 'remove_item':
            if (!isset($_POST['item_id'])) {
                throw new Exception('Missing item ID for removing from cart');
            }
            $item_id_remove = intval($_POST['item_id']);

            $sql_remove = "
                DELETE FROM cart
                WHERE id = ? AND user_id = ?
            ";
            $stmt_remove = $pdo->prepare($sql_remove);
            $stmt_remove->execute([$item_id_remove, $user_id]);

            if ($stmt_remove->rowCount() > 0) {
                echo json_encode(['success' => true]);
            } else {
                throw new Exception('Failed to remove item from cart');
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }

    $pdo->commit();

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>