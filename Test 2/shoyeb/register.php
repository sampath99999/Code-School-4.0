<?php
include 'db.php';
header('Content-Type: application/json');

$pdo = getPDO();

if (!$pdo) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Validate
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

// Check if user already exists
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    exit;
}

// Register user
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$accessToken = bin2hex(random_bytes(16)); // generate access token

$stmt = $pdo->prepare("INSERT INTO users (name, email, password, access_token) VALUES (?, ?, ?, ?)");
try {
    $stmt->execute([$name, $email, $hashedPassword, $accessToken]);
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
