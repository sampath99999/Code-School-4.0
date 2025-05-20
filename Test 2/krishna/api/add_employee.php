<?php

require_once "./utils/DB.php";


header('Content-Type: application/json');

// Get POST data
// $data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare SQL statement
        $pdo = getPDO();
        $query = "INSERT INTO employees (name, email, date_of_birth, phone_number, address,password) 
                VALUES (:name, :email, :dateOfBirth, :phoneNumber, :address, :password)";

        $stmt = $pdo->prepare($query);


        $hashedPassword = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // Bind parameters
        $stmt->bindParam(':name', $_POST['name']);
        $stmt->bindParam(':email', $_POST['email']);
        $stmt->bindParam(':dateOfBirth', $_POST['dateOfBirth']);
        $stmt->bindParam(':phoneNumber', $_POST['phoneNumber']);
        $stmt->bindParam(':address', $_POST['address']);
        $stmt->bindParam(':password', $hashedPassword);

        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'Employee added successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
