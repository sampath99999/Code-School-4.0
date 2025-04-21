<?php
require_once __DIR__ . "/utils/db.php";
require_once __DIR__ . "/utils/response.php";

$pdo = getPDO();

// Check if POST data is received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = $_POST['fullName'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';
    $department = $_POST['department'] ?? '';
    $position = $_POST['position'] ?? '';
    $hireDate = $_POST['hireDate'] ?? '';


    header('Content-Type: application/json');
    echo json_encode(["status" => true, "message" => "Employee added successfully.", "data" => null]);
    // Validate required fields
    if (empty($fullName) || empty($email) || empty($password) || empty($role) || empty($hireDate)) {
        sendErrorOutput('Please fill all required fields.', 400);
    }
    try {
        $checkQuery = "SELECT COUNT(*) FROM Employees WHERE Email = :email";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();
        $emailExists = $checkStmt->fetchColumn();

        if ($emailExists > 0) {
            sendErrorOutput('Email already exists.', 409);
            exit();
        }
        $hashedPassword = md5($password);

        $query = "INSERT INTO Employees (FullName, Email, Password, Role, Department, Position, HireDate) 
                  VALUES (:fullName, :email, :password, :role, :department, :position, :hireDate)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':fullName', $fullName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':department', $department);
        $stmt->bindParam(':position', $position);
        $stmt->bindParam(':hireDate', $hireDate);
        $stmt->execute();
        sendSuccessOutput('Employee added successfully.');
        exit();
    } catch (PDOException $e) {
        sendErrorOutput('Failed to add employee: ' . $e->getMessage(), 500);
        exit();
    }
} else {
    sendErrorOutput('Invalid request method.', 405);
    exit();
}