<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
require_once("./utils/token.php");

if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    sendErrorOutput("Invalid Request Method", 405);
}

if (!isset($_POST['username']) || empty(trim($_POST['username']))) {
    sendErrorOutput("Name is required", 400);
}

if (!isset($_POST['password']) || empty(trim($_POST['password']))) {
    sendErrorOutput("Password is required", 400);
}

$name = trim($_POST["username"]);
$password =(trim($_POST['password']));

$pdo = getPDO();

$query = "SELECT id, name, role FROM users 
          WHERE name = :name AND password = :password";
$statement = $pdo->prepare($query);
$statement->bindParam(":name", $name, PDO::PARAM_STR);
$statement->bindParam(":password", $password, PDO::PARAM_STR);
$statement->execute();
$data = $statement->fetch(PDO::FETCH_ASSOC);

if (!$data) {
    sendErrorOutput("Invalid Name or Password", 401);
}


$token = getRandomToken();
$data["token"] = $token;


$updateQuery = "UPDATE users SET token = :token WHERE id = :id";
$updateStmt = $pdo->prepare($updateQuery);
$updateStmt->bindParam(":token", $token, PDO::PARAM_STR);
$updateStmt->bindParam(":id", $data["id"], PDO::PARAM_INT);
$updateStmt->execute();


sendSuccessOutput("Logged In Successfully!", [
    "id" => $data["id"],
    "username" => $data["name"],
    "role" => $data["role"],
    "token" => $token
]);
?>
