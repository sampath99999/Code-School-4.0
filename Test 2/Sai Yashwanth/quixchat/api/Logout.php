<?php
require_once("../vendor/autoload.php");
require_once("../src/Database.php");
require_once("../src/Response.php");
require_once("../src/Auth.php");

header("Content-Type: application/json");

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        Response::error("Method Not Allowed", 405);
    }

    $headers = getallheaders();
    $authHeader = $headers["Authorization"] ?? $headers["authorization"] ?? null;

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        Response::error("Unauthorized - No token provided", 401);
    }

    $token = $matches[1];

    $decoded = JwtManager::decodeToken($token);
    if (!$decoded) {
        Response::error("Invalid or expired token", 401);
    }

    $userId = $decoded['id'];

    $stmt = $pdo->prepare("UPDATE users SET token = NULL, token_expires = NULL WHERE id = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        Response::success("Logged out successfully");
    } else {
        Response::error("User not found or already logged out", 404);
    }
} catch (Exception $e) {
    Response::error("Server error: " . $e->getMessage(), 500);
}
