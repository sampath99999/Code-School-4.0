<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

try {
    validateRequest("GET");
    $employee = validateToken();

    $requiredFields = ["employeeId", "month", "year"];
    foreach ($requiredFields as $field) {
        if (!isset($_GET[$field])) {
            sendErrorOutput("$field is required", 400);
        }
    }

    $pdo = getPDO();

    // Get payslip ID
    $query = "SELECT id 
              FROM employee_salary 
              WHERE employee_id = :employeeId 
              AND month = :month 
              AND year = :year 
              AND status = true 
              LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("employeeId", $_GET["employeeId"], PDO::PARAM_INT);
    $stmt->bindParam("month", $_GET["month"], PDO::PARAM_INT);
    $stmt->bindParam("year", $_GET["year"], PDO::PARAM_INT);
    $stmt->execute();
    $payslipId = $stmt->fetchColumn();

    if (!$payslipId) {
        sendErrorOutput("No payslip found for the selected month and year", 404);
    }

    sendSuccessOutput("Payslip ID fetched successfully", ["payslipId" => $payslipId]);
} catch (PDOException $e) {
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
} catch (Exception $e) {
    sendErrorOutput("Error: " . $e->getMessage(), 500);
}
?> 