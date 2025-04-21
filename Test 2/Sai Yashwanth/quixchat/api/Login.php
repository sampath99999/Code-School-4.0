<?php

require_once("../vendor/autoload.php");
require_once("../src/Database.php");
require_once("../src/Response.php");
require_once("../src/Auth.php");

try {

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        Response::error("Method Not Allowed", 405);
    }

    $validationRules = [
        "username" => [
            "required" => true,
            "error" => "Username is required."
        ],
        "password" => [
            "required" => true,
            "pattern" => "/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/",
            "error" => "Password must be at least 6 characters long with letters, numbers and a special character."
        ]
    ];

    $formData = [];
    foreach ($validationRules as $field => $rules) {
        if ($rules["required"] && empty($_POST[$field])) {
            Response::error($rules["error"], 400);
        }
        if (isset($rules["pattern"]) && !preg_match($rules["pattern"], $_POST[$field])) {
            Response::error($rules["error"], 400);
        }
        $formData[$field] = trim($_POST[$field]);
    }

    $hashedPassword = md5($formData["password"]);

    $query = "SELECT * FROM users WHERE username = :username AND password = :password";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":username", $formData["username"]);
    $statement->bindParam(":password", $hashedPassword);

    $statement->execute();
    $user = $statement->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        Response::error("Invalid username or password.", 401);
    }

    $userImage = null;

    if ($user["profile_image_id"]) {
        $imageQuery = "SELECT * FROM file_uploads WHERE id = :image_id";
        $imageStmt = $pdo->prepare($imageQuery);
        $imageStmt->bindParam(":image_id", $user["profile_image_id"]);
        $imageStmt->execute();
        $image = $imageStmt->fetch(PDO::FETCH_ASSOC);
        if ($image) {
            $userImage = $image["file_path"];
        }
    }

    $payload = [
        "id" => $user["id"],
        "username" => $user["username"],
        "email" => $user["email"],
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24)
    ];

    $token = JwtManager::encodeToken($payload);

    $updateQuery = "UPDATE users SET token = :token WHERE id = :id";
    $updateStmt = $pdo->prepare($updateQuery);
    $updateStmt->bindParam(":token", $token);
    $updateStmt->bindParam(":id", $user["id"]);
    $updateStmt->execute();

    Response::success("Login successful", [
        "id" => $user["id"],
        "username" => $user["username"],
        "email" => $user["email"],
        "profile_image" => $userImage,
        "token" => $token
    ]);
} catch (Exception $e) {
    Response::error("Server error: " . $e->getMessage(), 500);
}
