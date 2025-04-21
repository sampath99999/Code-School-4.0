<?php
ob_start();

require_once("./utils/db.php");
require_once("./utils/response.php");
require_once("./utils/token.php");

if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    sendErrorMessage("Method not allowed", 405);
}

if (!isset($_POST["username"]) && !isset($_POST["email"])) {
    sendErrorMessage("Username or email is required", 400);
}

if (!isset($_POST["password"])) {
    sendErrorMessage("Password is missing", 400);
}

$username = isset($_POST["username"]) ? $_POST["username"] : null;
$email = isset($_POST["email"]) ? $_POST["email"] : null;
$password = $_POST["password"];

try {
    $pdo = getPDO();
    $query = "SELECT * FROM admin WHERE (username = :username OR email_id = :email) AND password = :password";
    $statement = $pdo->prepare($query);
    $statement->bindParam("username", $username, PDO::PARAM_STR);
    $statement->bindParam("email", $email, PDO::PARAM_STR);
    $statement->bindParam("password", $password, PDO::PARAM_STR);
    $statement->execute();


    $data = $statement->fetch(PDO::FETCH_ASSOC);
    if (!$data) {
        sendErrorMessage("Username and password are invalid", 400);
    }

    $token = getRandomToken();
    $data["token"] = $token;

    $query = "UPDATE admin SET token = :token WHERE id = :id";
    $statement = $pdo->prepare($query);
    $statement->bindParam("token", $token, PDO::PARAM_STR);
    $statement->bindParam("id", $data["id"], PDO::PARAM_INT);
    $statement->execute();

    unset($data["password"]);

    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode([
        "success" => true,
        "message" => "Logged Successfully",
        "data" => $data
    ]);
    exit;
} catch (PDOException $e) {
    sendErrorMessage("Database error: " . $e->getMessage(), 500);
}
