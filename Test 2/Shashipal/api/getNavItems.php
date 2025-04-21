<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

validateRequest("GET");
$employee = validateToken();
$role = $employee["role"];
$pdo = getPDO();
try {
    $query = "SELECT name FROM menu WHERE menu_for = :role";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("role", $role, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_COLUMN);
    sendSuccessOutput("Menu Items fetched successfully",$result);
}catch(PDOException $e){
    sendErrorOutput("Database Error",500);
}