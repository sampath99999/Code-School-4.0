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

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        Response::error("Method Not Allowed", 405);
    }

    $message = trim($_POST["message_text"] ?? '');
    $fileId = null;

    if (isset($_FILES["file"]) && $_FILES["file"]["error"] === UPLOAD_ERR_OK) {
        $uploadDir = "../uploads/";
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileName = basename($_FILES["file"]["name"]);
        $fileTmpPath = $_FILES["file"]["tmp_name"];
        $fileType = mime_content_type($fileTmpPath);
        $filePath = $uploadDir . uniqid("chat_") . "_" . $fileName;

        if (move_uploaded_file($fileTmpPath, $filePath)) {
            $insertFile = $pdo->prepare("INSERT INTO file_uploads (user_id, context, file_name, file_type, file_path) VALUES (:user_id, 'chat_message', :file_name, :file_type, :file_path)");
            $insertFile->execute([
                ":user_id" => $userId,
                ":file_name" => $fileName,
                ":file_type" => $fileType,
                ":file_path" => $filePath
            ]);
            $fileId = $pdo->lastInsertId();
        }
    }

    if (empty($message) && !$fileId) {
        Response::error("Message or file is required", 400);
    }

    $stmt = $pdo->prepare("INSERT INTO messages (sender_id, message_text, file_id) VALUES (:sender_id, :message_text, :file_id)");
    $stmt->bindValue(":sender_id", $userId, PDO::PARAM_INT);
    $stmt->bindValue(":message_text", $message);
    $stmt->bindValue(":file_id", $fileId, PDO::PARAM_INT);
    $stmt->execute();

    Response::success("Message sent successfully");
} catch (Exception $e) {
    Response::error("Server error: " . $e->getMessage(), 500);
}
