<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

validateRequest("GET");
$employee = validateToken();

$pdo = getPDO();
try{
    $query = "SELECT * FROM employee_attendance WHERE employee_id=:id";
$stmt = $pdo->prepare($query);
$stmt->bindParam("id",$employee["id"],PDO::PARAM_INT);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
sendSuccessOutput("Attendance fetched successfully",$result);
}catch(PDOException $e){
    sendErrorOutput("Database Error",500);
}