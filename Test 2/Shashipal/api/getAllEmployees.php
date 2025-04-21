<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

validateRequest("GET");
$employee = validateToken();
if($employee["role"] != 'hr'){
    sendErrorOutput("Unauthorized request",401);
}

$pdo = getPDO();
try{
    $query = "SELECT * FROM employees WHERE role='employee'";
$stmt=$pdo->prepare($query);
$stmt->execute();
$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
sendSuccessOutput("Employees fetched successfully",$result);
}catch(PDOException $e){
    sendErrorOutput("Database Error",500);
}
