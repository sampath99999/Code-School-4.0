<?php
ob_start();

require_once './utils/db.php'; 
require_once './utils/response.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    sendErrorMessage("Invalid Method", 404);
}

if (!isset($_GET["token"])) {
   sendErrorMessage("Token is required", 400);
}
if (!isset($_GET["categoryId"])) {
    sendErrorMessage("Category Id is required", 400);
}
$token = $_GET['token'];
$categoryId = $_GET['categoryId'];
$pdo = getPDO();

// Verify token
$query = "SELECT * FROM admin WHERE token = :token";
$stmt = $pdo->prepare($query);
$stmt->bindParam(":token", $token, PDO::PARAM_STR);
$stmt->execute();
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin) {
   sendErrorMessage("Token invalid", 401);
}

// Fetch song
// Fetch song
$query = "SELECT c.description,s.id, s.poster, s.song_title, s.artists, s.file_path
          FROM songs s
          JOIN categories c ON s.category_id = c.id";

if ($categoryId != 0) {
    $query .= " WHERE s.category_id = :categoryId";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":categoryId", $categoryId, PDO::PARAM_INT);
    $stmt->execute();
} else {
    $stmt = $pdo->prepare($query);
    $stmt->execute();
}



$songs = $stmt->fetchAll(PDO::FETCH_ASSOC);

ob_end_clean();

echo json_encode([
    "status" => "success",
    "data" => $songs
]);
exit;