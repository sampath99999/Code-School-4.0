<?php
require_once("../vendor/autoload.php");
require_once("../src/Database.php");
require_once("../src/Response.php");

try {
    $pdo->beginTransaction();

    $username = trim($_POST['username'] ?? "");
    $email = trim($_POST['email'] ?? "");
    $password = $_POST['password'] ?? "";

    if (!$username || !$email || !$password) {
        Response::error("All fields are required", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username OR email = :email");
    $stmt->execute(['username' => $username, 'email' => $email]);
    if ($stmt->fetch()) {
        Response::error("Username or Email already exists", 409);
    }

    $stmt = $pdo->prepare("
        INSERT INTO users (username, email, password)
        VALUES (:username, :email, :password)
    ");
    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'password' => md5($password),
    ]);
    $userId = $pdo->lastInsertId();

    $profileImageId = null;

    if (!empty($_FILES['profileImage']['name'])) {
        $file = $_FILES['profileImage'];
        $allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file['type'], $allowed)) {
            Response::error("Invalid image type", 400);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newFileName = "profile_" . uniqid() . "." . $ext;
        $uploadPath = "../uploads/" . $newFileName;
        move_uploaded_file($file['tmp_name'], $uploadPath);

        $stmt = $pdo->prepare("
            INSERT INTO file_uploads (user_id, context, file_name, file_type, file_path)
            VALUES (:user_id, 'profile_image', :file_name, :file_type, :file_path)
        ");
        $stmt->execute([
            'user_id' => $userId,
            'file_name' => $file['name'],
            'file_type' => $file['type'],
            'file_path' => $uploadPath,
        ]);
        $profileImageId = $pdo->lastInsertId();

        $pdo->prepare("UPDATE users SET profile_image_id = :imgId WHERE id = :userId")
            ->execute(['imgId' => $profileImageId, 'userId' => $userId]);
    }

    $pdo->commit();
    Response::success("Registration successful");
} catch (Exception $e) {
    $pdo->rollBack();
    Response::error("Server Error: " . $e->getMessage(), 500);
}
