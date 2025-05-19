<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

try {
    validateRequest("GET");
    $employee = validateToken();

    $pdo = getPDO();


    $query = "SELECT 
                es.*,
                TO_CHAR(TO_DATE(es.month::text, 'MM'), 'Month') as month_name
              FROM employee_salary es
              WHERE es.employee_id = :employeeId
              AND es.status = true
              ORDER BY es.year DESC, es.month DESC";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("employeeId", $employee["employee_id"], PDO::PARAM_INT);
    $stmt->execute();
    $payslips = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendSuccessOutput("Payslips fetched successfully", $payslips);
} catch (PDOException $e) {
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
} catch (Exception $e) {
    sendErrorOutput("Error: " . $e->getMessage(), 500);
}
?> 