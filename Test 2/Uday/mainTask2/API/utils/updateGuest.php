<?php
require_once("./DB.php");
require_once("./response.php");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    sendErrorOutput("Not found", 404);
}

if (!isset($_POST["name"])) {
    sendErrorOutput("name is required", 400);
}
if (!isset($_POST["phone"])) {
    sendErrorOutput("phone is required", 400);
}
if (!isset($_POST["vehicle"])) {
    sendErrorOutput("vehicle is required", 400);
}
if (!isset($_POST["flat_number"])) {
    sendErrorOutput("flat number is required", 400);
}

$pdo = getPDO();
$name = $_POST["name"];
$phone = $_POST["phone"];
$vehicle = $_POST["vehicle"];
$flat_number = $_POST["flat_number"];


$statement = $pdo->prepare("select id from owners where flat_number=:flat_number");
$statement->bindParam(":flat_number", $flat_number, PDO::PARAM_STR);
$statement->execute();

$owner = $statement->fetch(PDO::FETCH_ASSOC);
$owner_id = $owner["id"];

$headers = apache_request_headers();
$token = $headers['authorization'];

if (!$token) {
    sendErrorOutput("Token Not Found", 404);
}

$pdo = getPDO();
$query = "select id from security where token=:token";
$statement1 = $pdo->prepare($query);
$statement1->bindParam("token", $token, PDO::PARAM_STR);
$statement1->execute();

$security = $statement1->fetch(PDO::FETCH_ASSOC);
$security_id = $security["id"];


$query2 = "insert into guest_requests (guest_name,phone,veichle_number,flat_number,security_id,owner_id)
         values(:guest_name,:phone,:veichle_number,:flat_number,:security_id,:owner_id)";
$statement2 = $pdo->prepare($query2);
$statement2->bindParam(":guest_name", $name, PDO::PARAM_STR);
$statement2->bindParam(":phone", $phone, PDO::PARAM_STR);
$statement2->bindParam(":veichle_number", $vehicle, PDO::PARAM_STR);
$statement2->bindParam(":flat_number", $flat_number, PDO::PARAM_STR);
$statement2->bindParam(":security_id", $security_id, PDO::PARAM_STR);
$statement2->bindParam(":owner_id", $owner_id, PDO::PARAM_STR);

if ($statement2->execute()) {
    sendSuccessOutput("Inserting guest details Successfull");
} else {
    sendErrorOutput("insertion of guest details failed  ");
}
