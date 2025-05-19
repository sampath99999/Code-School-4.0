<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    validateRequest("GET");
    $employee = validateToken();
    if ($employee["role"] != "admin") {
        sendErrorOutput("Unauthorized Request", 401);
    }

    if (!isset($_GET["employeeId"])) {
        sendErrorOutput("Employee ID is required", 400);
    }

    $pdo = getPDO();
    
    $query = "SELECT e.*, u.email, u.role 
              FROM employees e 
              JOIN users u ON e.id = u.employee_id 
              WHERE e.id = :employeeId";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("employeeId", $_GET["employeeId"], PDO::PARAM_INT);
    $stmt->execute();
    $employeeDetails = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$employeeDetails) {
        sendErrorOutput("Employee not found", 404);
    }

    $query = "SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'earning_deduction_master'
    )";
    $stmt = $pdo->query($query);
    $tableExists = $stmt->fetchColumn();

    if (!$tableExists) {
        $query = "CREATE TABLE earning_deduction_master (
            id SERIAL PRIMARY KEY,
            description VARCHAR(255) NOT NULL UNIQUE,
            type SMALLINT NOT NULL CHECK (type IN (0, 1)),
            status BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $pdo->exec($query);

        $defaultComponents = [
            ['Basic Salary', 0],
            ['House Rent Allowance', 0],
            ['Bonus', 0],
            ['Professional Tax', 1],
            ['Income Tax', 1],
            ['Provident Fund', 1]
        ];

        foreach ($defaultComponents as $component) {
            $query = "INSERT INTO earning_deduction_master (description, type, status) 
                      VALUES (:description, :type, true)";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam("description", $component[0], PDO::PARAM_STR);
            $stmt->bindParam("type", $component[1], PDO::PARAM_INT);
            $stmt->execute();
        }
    }

    $query = "SELECT id, description, type 
              FROM earning_deduction_master 
              WHERE status = true 
              ORDER BY type, description";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $allComponents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $availableEarnings = array_filter($allComponents, function($item) {
        return $item['type'] == 0;
    });
    $availableDeductions = array_filter($allComponents, function($item) {
        return $item['type'] == 1;
    });


    $query = "SELECT eed.*, edm.description, edm.type 
              FROM employee_earnings_deductions eed 
              JOIN earning_deduction_master edm ON eed.earning_deduction_id = edm.id 
              WHERE eed.employee_id = :employeeId AND edm.status = true";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("employeeId", $_GET["employeeId"], PDO::PARAM_INT);
    $stmt->execute();
    $components = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $earnings = array_filter($components, function($item) {
        return $item['type'] == 0;
    });
    $deductions = array_filter($components, function($item) {
        return $item['type'] == 1;
    });

    $response = [
        'employee' => $employeeDetails,
        'current_earnings' => array_values($earnings),
        'current_deductions' => array_values($deductions),
        'available_components' => [
            'earnings' => array_values($availableEarnings),
            'deductions' => array_values($availableDeductions)
        ]
    ];


    sendSuccessOutput("Employee details fetched successfully", $response);
} catch (PDOException $e) {
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
} catch (Exception $e) {
    sendErrorOutput("Error: " . $e->getMessage(), 500);
} 