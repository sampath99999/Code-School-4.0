<?php
require_once("./DB.php");
require_once("./response.php");

$headers = apache_request_headers();
$token = $headers['authorization'] ?? '';

if (!$token) {
    sendErrorOutput("Token Not Found", 404);
}

$pdo = getPDO();

// Check for security
$query = "SELECT id FROM security WHERE token = :token";
$statement = $pdo->prepare($query);
$statement->bindParam(":token", $token, PDO::PARAM_STR);
$statement->execute();
$security = $statement->fetch(PDO::FETCH_ASSOC);

if ($security) {
    $security_id = $security["id"];
    $stmt = $pdo->prepare("SELECT guest_name, phone, veichle_number, status FROM guest_requests WHERE security_id = :id AND status != 'pending'");
    $stmt->bindParam(":id", $security_id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
    exit;
}

// Check for owner
$query = "SELECT id FROM owners WHERE token = :token";
$statement = $pdo->prepare($query);
$statement->bindParam(":token", $token, PDO::PARAM_STR);
$statement->execute();
$owner = $statement->fetch(PDO::FETCH_ASSOC);

if ($owner) {
    $owner_id = $owner["id"];
    $stmt = $pdo->prepare("SELECT guest_name, phone, veichle_number, status FROM guest_requests WHERE owner_id = :id AND status != 'pending'");
    $stmt->bindParam(":id", $owner_id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
    exit;
}

// If neither matched, return error response
echo json_encode([]);
exit;
?>
