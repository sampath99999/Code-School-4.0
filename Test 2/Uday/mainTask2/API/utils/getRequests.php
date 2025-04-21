<?php
require_once("./DB.php");
require_once("./response.php");

$headers = apache_request_headers();
$token = $headers['authorization'];

if (!$token) {
    sendErrorOutput("Token Not Found", 404);
}

$pdo = getPDO();
$query = "select id from owners where token=:token";
$statement1 = $pdo->prepare($query);
$statement1->bindParam("token", $token, PDO::PARAM_STR);
$statement1->execute();

$owner = $statement1->fetch(PDO::FETCH_ASSOC);
$owner_id = $owner["id"];

$stmt2 = $pdo->prepare("select gr.id as guest_id,gr.guest_name,gr.phone,gr.veichle_number,gr.status
                          from guest_requests gr
                          join owners o on gr.owner_id=o.id
                          where o.id=:owner_id");
$stmt2->bindParam(":owner_id", $owner_id, PDO::PARAM_STR);
$stmt2->execute();

$newRequests = $stmt2->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($newRequests);

// sendSuccessOutput("Approval Requests",$newRequests);
