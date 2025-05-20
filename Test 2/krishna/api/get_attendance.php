<?php
header('Content-Type: application/json');
require_once './utils/DB.php';
require_once './utils/validateToken.php';

$date = $_GET['date'] ?? date('Y-m-d');
$user = validateToken();
$pdo = getPDO();
$employeeId = $user['id'];
try {
    $query = "SELECT clock_in, clock_out,status FROM attendance WHERE employee_id = :employeeId AND DATE(clock_in) = :date";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':employeeId', $employeeId, PDO::PARAM_INT);
    $stmt->bindParam(':date', $date);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'success' => true,
            'data' => $data
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => null
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching attendance data: ' . $e->getMessage()
    ]);
}
?>