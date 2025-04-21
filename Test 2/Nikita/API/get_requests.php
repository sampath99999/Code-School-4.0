<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
header('Content-Type: application/json');

$pdo = getPDO();

$query = "SELECT id, visitor_name, flat_number, status FROM guard_requests";

$statement = $pdo->prepare($query);
$statement->execute();
$leaveRequests = $statement->fetchAll(PDO::FETCH_ASSOC);

sendSuccessOutput("Leave requests fetched successfully", $leaveRequests);
?>
