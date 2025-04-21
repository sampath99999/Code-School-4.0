<?php
require_once("../vendor/autoload.php");
require_once("../src/Database.php");
require_once("../src/Response.php");
require_once("../src/Auth.php");

try {
    $headers = getallheaders();
    $authHeader = $headers["Authorization"] ?? $headers["authorization"] ?? null;

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        Response::error("Unauthorized Access - No token provided", 401);
    }

    $token = $matches[1];
    $authenticatedUser = JwtManager::decodeToken($token);

    if (!$authenticatedUser) {
        Response::error("Invalid or expired token.", 401);
    }

    $userId = $authenticatedUser["id"];
    $role = $authenticatedUser["role"] ?? "user";

    if ($role !== "user" && $role !== "admin") {
        Response::error("Access Denied. Only users can access this resource.", 403);
    }

    $query = "
    SELECT 
        m.id,
        m.message_text,
        m.created_at,
        u.username,
        fu.file_path AS profile_image,
        f.file_name,
        f.file_type,
        f.file_path
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    LEFT JOIN file_uploads f ON m.file_id = f.id
    LEFT JOIN file_uploads fu ON u.profile_image_id = fu.id
    ORDER BY m.created_at ASC
    ";


    $stmt = $pdo->query($query);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success("Messages fetched successfully", $messages);
} catch (Exception $e) {
    Response::error("Server error: " . $e->getMessage(), 500);
}
