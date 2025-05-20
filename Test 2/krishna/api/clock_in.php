<?php
require_once "./utils/DB.php";
require_once './utils/validateToken.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = getPDO();
    try {
        $clockIn = $_POST['clockIn'];
       $user = validateToken();

       $employeeId = $user["id"];
        $checkQuery = "SELECT id FROM attendance 
               WHERE employee_id = :employeeId 
               AND clock_in::date = CURRENT_DATE";

        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->bindParam(':employeeId', $user["id"]);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Already clocked in today']);
            exit();
        }

  
        $query = "INSERT INTO attendance (employee_id, status) 
                 VALUES (:employeeId, 'present')";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':employeeId', $employeeId);
       
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'Clock in recorded successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?> 