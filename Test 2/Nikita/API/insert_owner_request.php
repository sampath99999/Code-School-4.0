<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
header('Content-Type: application/json');

try {
    $pdo = getPDO();
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['request_id'])) {
        sendErrorOutput("Missing request ID");
        exit;
    }

    $requestId = $data['request_id'];
    $stmt = $pdo->prepare("INSERT INTO owner_requests (request_id, status) VALUES (:request_id, 'reject')");
    $stmt->bindParam(':request_id', $requestId, PDO::PARAM_INT);
    $stmt->execute();

    sendSuccessOutput("Request sent successfully");
} catch (Exception $e) {
    sendErrorOutput("Error sending request: " . $e->getMessage());
}
