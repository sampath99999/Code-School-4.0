<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

try {
    validateRequest("POST");
    $employee = validateToken();
    if ($employee["role"] != "admin") {
        sendErrorOutput("Unauthorized Request", 401);
    }

    $requiredFields = ["employeeId", "month", "year", "components"];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field])) {
            sendErrorOutput("$field is required", 400);
        }
    }

    $pdo = getPDO();
    
    $pdo->beginTransaction();

    try {
        $components = json_decode($_POST["components"], true);
        if (!isset($components["items"]) || !isset($components["totalSalary"])) {
            throw new Exception("Invalid components data");
        }

        $query = "INSERT INTO employee_salary (employee_id, month, year, net_salary, status) 
                  VALUES (:employeeId, :month, :year, :netSalary, true) 
                  RETURNING id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam("employeeId", $_POST["employeeId"], PDO::PARAM_INT);
        $stmt->bindParam("month", $_POST["month"], PDO::PARAM_INT);
        $stmt->bindParam("year", $_POST["year"], PDO::PARAM_INT);
        $stmt->bindParam("netSalary", $components["totalSalary"], PDO::PARAM_STR);
        $stmt->execute();
        $salaryId = $stmt->fetchColumn();

        foreach ($components["items"] as $item) {
            $query = "INSERT INTO employee_earnings_deductions (employee_id, earning_deduction_id, amount) 
                      VALUES (:employeeId, :componentId, :amount) 
                      RETURNING id";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam("employeeId", $_POST["employeeId"], PDO::PARAM_INT);
            $stmt->bindParam("componentId", $item["id"], PDO::PARAM_INT);
            $stmt->bindParam("amount", $item["amount"], PDO::PARAM_STR);
            $stmt->execute();
            $earningDeductionId = $stmt->fetchColumn();

            $query = "INSERT INTO employee_salary_earning_deduction (salary_id, employee_earning_deduction_id, status) 
                      VALUES (:salaryId, :earningDeductionId, true)";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam("salaryId", $salaryId, PDO::PARAM_INT);
            $stmt->bindParam("earningDeductionId", $earningDeductionId, PDO::PARAM_INT);
            $stmt->execute();
        }

        $pdo->commit();
        sendSuccessOutput("Payslip generated successfully");
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("General Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    sendErrorOutput("Error: " . $e->getMessage(), 500);
} 