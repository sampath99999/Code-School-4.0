<?php

require_once("./utils/db.php");
require_once("./utils/response.php");
require_once("./generateToken.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    Response::showErrorMessage("Invalid request method", 405);
    exit;
}

$username = isset($_POST["username"]) ? trim($_POST["username"]) : "";
$password = isset($_POST["password"]) ? trim($_POST["password"]) : "";
$isAdminLogin = isset($_POST["admin"]) && $_POST["admin"] === 'true'; 

if ($username === "") {
    Response::showErrorMessage("Username is required", 400);
    exit;
}

if ($password === "") {
    Response::showErrorMessage("Password is required", 400);
    exit;
}

$hashedPassword = md5($password);

try {
    $pdo = getPDO();

    
    if ($isAdminLogin) {
        $query = "SELECT * FROM users WHERE name = :name AND password_hash = :password AND is_admin = TRUE";
    } else {
        $query = "SELECT * FROM users WHERE name = :name AND password_hash = :password";
    }

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":name", $username);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        Response::showErrorMessage("Invalid credentials or unauthorized access", 401);
        exit;
    }

    $token = generateToken();
    $user["token"] = $token;
    unset($user["password_hash"]); 

   
    $updateQuery = "UPDATE users SET token = :token WHERE id = :id";
    $updateStmt = $pdo->prepare($updateQuery);
    $updateStmt->bindParam(":token", $token);
    $updateStmt->bindParam(":id", $user["id"]);
    $updateStmt->execute();

    Response::showSuccessMessage("Login successful", 200, $user);

} catch (PDOException $e) {
    Response::showErrorMessage("Database error: " . $e->getMessage(), 500);
}
