<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

validateRequest("GET");
$employee = validateToken();
if ($employee["role"] != "admin") {
    sendErrorOutput("Unauthorized Request", 401);
}

$pdo = getPDO();
try {
    $query = "SELECT e.*, u.email, u.role 
              FROM employees e 
              LEFT JOIN users u ON e.id = u.employee_id 
              ORDER BY e.created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendSuccessOutput("Employees fetched successfully", $employees);
} catch (PDOException $e) {
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
} 