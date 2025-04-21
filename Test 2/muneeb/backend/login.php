<?php
require_once __DIR__ . "/utils/db.php";
require_once __DIR__ . "/utils/response.php";

if ($_SERVER["REQUEST_METHOD"] !== 'POST') {
    sendErrorOutput("Not Found", 404);
}

$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;

if (!$email || !$password) {
    sendErrorOutput("email and Password are required", 400);
}

$pdo = getPDO();
$query = "SELECT * FROM employees WHERE email = :email AND password = :password";
$statement = $pdo->prepare($query);
$statement->execute([
    ':email' => $email,
    ':password' => $password 
]);

$data = $statement->fetch(PDO::FETCH_ASSOC);

if (!$data) {
    sendErrorOutput("Invalid email or Password", 400);
}

sendSuccessOutput("Login successful", $data);