<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

try {
    validateRequest("GET");
    $employee = validateToken();

    $pdo = getPDO();

    // Get employee details with email
    $query = "SELECT e.*, u.email 
              FROM employees e 
              JOIN users u ON e.id = u.employee_id 
              WHERE e.id = :employeeId";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("employeeId", $employee["employee_id"], PDO::PARAM_INT);
    $stmt->execute();
    $employeeDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$employeeDetails) {
        sendErrorOutput("Employee not found", 404);
    }

    // Format date of birth
    $employeeDetails['dob'] = date('d-m-Y', strtotime($employeeDetails['dob']));

    // Remove sensitive information
    unset($employeeDetails['password']);

    sendSuccessOutput("Profile fetched successfully", $employeeDetails);
} catch (PDOException $e) {
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
} catch (Exception $e) {
    sendErrorOutput("Error: " . $e->getMessage(), 500);
}
?> 