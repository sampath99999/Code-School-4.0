<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

try {
    validateRequest("GET");
    $employee = validateToken();

    if (!isset($_GET["payslipId"])) {
        sendErrorOutput("Payslip ID is required", 400);
    }

    $pdo = getPDO();

    // Get payslip details
    $query = "SELECT es.*, 
                     TO_CHAR(TO_DATE(es.month::text, 'MM'), 'Month') as month_name
              FROM employee_salary es
              WHERE es.id = :payslipId
              AND es.status = true
              LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("payslipId", $_GET["payslipId"], PDO::PARAM_INT);
    $stmt->execute();
    $payslip = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$payslip) {
        sendErrorOutput("Payslip not found", 404);
    }

    // Get employee details
    $query = "SELECT e.*, u.email 
              FROM employees e 
              JOIN users u ON e.id = u.employee_id 
              WHERE e.id = :employeeId";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("employeeId", $payslip["employee_id"], PDO::PARAM_INT);
    $stmt->execute();
    $employeeDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get earnings and deductions for this payslip
    $query = "SELECT 
                eed.amount,
                edm.description,
                edm.type
              FROM employee_salary_earning_deduction esed
              JOIN employee_earnings_deductions eed ON esed.employee_earning_deduction_id = eed.id
              JOIN earning_deduction_master edm ON eed.earning_deduction_id = edm.id
              WHERE esed.salary_id = :salaryId
              AND esed.status = true
              ORDER BY edm.type, edm.description";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("salaryId", $payslip["id"], PDO::PARAM_INT);
    $stmt->execute();
    $components = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Separate earnings and deductions
    $earnings = array_filter($components, function($item) {
        return $item['type'] == 0;
    });
    $deductions = array_filter($components, function($item) {
        return $item['type'] == 1;
    });

    $response = [
        'employee' => $employeeDetails,
        'payslip' => [
            'id' => $payslip['id'],
            'month' => $payslip['month'],
            'month_name' => $payslip['month_name'],
            'year' => $payslip['year'],
            'net_salary' => $payslip['net_salary'],
            'created_at' => $payslip['created_at']
        ],
        'earnings' => array_values($earnings),
        'deductions' => array_values($deductions)
    ];

    sendSuccessOutput("Payslip details fetched successfully", $response);
} catch (PDOException $e) {
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
} catch (Exception $e) {
    sendErrorOutput("Error: " . $e->getMessage(), 500);
} 