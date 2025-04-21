<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');
$pdo = getPDO();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $request_id = isset($_POST['request_id']) ? (int)$_POST['request_id'] : 0;
    $status = isset($_POST['status']) ? $_POST['status'] : '';

    if ($request_id <= 0 || !in_array($status, ['approve', 'reject'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        exit;
    }

    try {
        $pdo->beginTransaction();
    
        $update1 = $pdo->prepare("UPDATE guard_requests SET status = :status WHERE id = :id");
        $update1->execute([':status' => $status, ':id' => $request_id]);
        $rows1 = $update1->rowCount();
    
        $update2 = $pdo->prepare("UPDATE owner_requests SET status = :status WHERE id = :id");
        $update2->execute([':status' => $status, ':id' => $request_id]);
        $rows2 = $update2->rowCount();
    
        $pdo->commit();
    
        echo json_encode([
            'status' => 'success',
            'message' => 'Status updated',
            'updates' => [
                'guard_requests' => $rows1,
                'owner_requests' => $rows2
            ]
        ]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    
}
?>
