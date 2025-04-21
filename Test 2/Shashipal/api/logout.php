<?php

require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";


validateRequest("POST");

$employee = validateToken();

$token = $employee["token"];

$pdo = getPDO();

try {
    $query = "UPDATE employees SET token = null WHERE token = :token";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("token", $token, PDO::PARAM_STR);
    $stmt->execute();
    sendSuccessOutput("Logout Successful",);
} catch (PDOException $e) {
    sendErrorOutput("Database Error" . $e->getMessage(), 500);
}
