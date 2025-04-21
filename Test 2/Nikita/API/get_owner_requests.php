<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
header('Content-Type: application/json');

$pdo = getPDO();

$query = "SELECT 
    owner.id AS owner_request_id,
    gr.id AS guard_request_id,
    gr.visitor_name,
    gr.flat_number,
    owner.status
FROM owner_requests owner
JOIN guard_requests gr ON owner.request_id = gr.id;";

$statement = $pdo->prepare($query);
$statement->execute();
$ownerRequests = $statement->fetchAll(PDO::FETCH_ASSOC);

sendSuccessOutput("Owner requests fetched successfully", $ownerRequests);
?>
