<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

$pdo = getPDO();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $request_id = isset($_POST['request_id']) ? (int)$_POST['request_id'] : 0;
    $status = isset($_POST['status']) ? $_POST['status'] : '';

    if ($request_id <= 0 || $status !== 'reject') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request ID or status']);
        exit;
    }

    try {
        $stmt1 = $pdo->prepare("DELETE FROM guard_requests WHERE id = :request_id");
        $stmt1->execute([':request_id' => $request_id]);
        $deletedFromGuard = $stmt1->rowCount();
    
        $stmt2 = $pdo->prepare("DELETE FROM owner_requests WHERE id = :request_id");
        $stmt2->execute([':request_id' => $request_id]);
        $deletedFromOwner = $stmt2->rowCount();
    
        echo json_encode([
            'status' => 'success',
            'message' => 'Request rejected and deleted',
            'deleted' => [
                'guard_requests' => $deletedFromGuard,
                'owner_requests' => $deletedFromOwner
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    
}
?>
