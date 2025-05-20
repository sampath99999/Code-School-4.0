<?php
require_once "./utils/DB.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $clockOut = $data['clockOut'];
        $employeeId = $_SESSION['employee_id']; 

       
        $checkQuery = "SELECT id FROM attendance 
                      WHERE employee_id = :employeeId 
                      AND DATE(clock_in) = CURDATE()
                      AND clock_out IS NOT NULL";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->bindParam(':employeeId', $employeeId);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Already clocked out today']);
            exit();
        }

        
        $query = "UPDATE attendance 
                 SET clock_out = :clockOut 
                 WHERE employee_id = :employeeId 
                 AND DATE(clock_in) = CURDATE()";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':employeeId', $employeeId);
        $stmt->bindParam(':clockOut', $clockOut);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            echo json_encode(['success' => false, 'message' => 'No clock in record found for today']);
            exit();
        }

        echo json_encode(['success' => true, 'message' => 'Clock out recorded successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?> 