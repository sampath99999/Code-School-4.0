<?php

require_once("./utils/db.php");
require_once("./utils/response.php");
require_once("./generateToken.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    Response::showErrorMessage("Invalid request method", 405);
}

$username = isset($_POST["username"]) ? trim($_POST["username"]) : "";
$password = isset($_POST["password"]) ? trim($_POST["password"]) : "";

if ($username === "") {
    Response::showErrorMessage("Username is required", 400);
}

if ($password === "") {
    Response::showErrorMessage("Password is required", 400);
}

$hashedPassword = md5($password);

try {
    $pdo = getPDO();
    $query = "SELECT * FROM users WHERE name = :name AND password_hash = :password";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":name", $username);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        Response::showErrorMessage("Invalid credentials", 401);
    }

    $token = generateToken();
    $user["token"] = $token;
    unset($user["password"]);

   
    $updateQuery = "UPDATE users SET token = :token WHERE id = :id";
    $updateStmt = $pdo->prepare($updateQuery);
    $updateStmt->bindParam(":token", $token);
    $updateStmt->bindParam(":id", $user["id"]);
    $updateStmt->execute();

    Response::showSuccessMessage("Login successful", 200, $user);

} catch (PDOException $e) {
    Response::showErrorMessage("Database error: " . $e->getMessage(), 500);
}
