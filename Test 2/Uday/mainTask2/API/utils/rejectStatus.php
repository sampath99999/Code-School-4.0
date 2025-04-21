<?php

require_once("./DB.php");
require_once("./response.php");

if (!isset($_POST["id"])) {
    echo "Id is required";
    exit;
}

$pdo = getPDO();
$id = $_POST["id"];


$status = "Rejected";

$query = "UPDATE guest_requests 
            SET status = :status
            WHERE id = :id";

$stmt = $pdo->prepare($query);
$stmt->bindParam(":id", $id, PDO::PARAM_STR);
$stmt->bindParam(":status", $status, PDO::PARAM_STR);

if ($stmt->execute()) {
    sendSuccessOutput("Status Updated Successfully");
} else {
    sendErrorOutput("Updating Status is Failed");
}
