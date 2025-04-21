<?php
ob_start();

require_once("./utils/db.php");
require_once("./utils/response.php");
require_once("./utils/token.php");

if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    sendErrorMessage("Not found", 404);
}

if (!isset($_POST["username"])) {
    sendErrorMessage("Missing username", 400);
}

if (!isset($_POST["email"])) {
    sendErrorMessage("Missing email", 400);
}

if (!isset($_POST["password"])) {
    sendErrorMessage("Password is missing", 400);
}

if (!isset($_POST["confirm_password"])) {
    sendErrorMessage("Password should match", 400);
}

$username = $_POST["username"];
$email = $_POST["email"];
$password = $_POST["password"];

$pdo = getPDO();
$query = "INSERT INTO admin(username,email_id,password) VALUES(
            :username,:email,:password
        );";
$statement = $pdo->prepare($query);
$statement->bindParam("username", $username, PDO::PARAM_STR);
$statement->bindParam("email",$email, PDO::PARAM_STR);
$statement->bindParam("password", $password, PDO::PARAM_STR);
$statement->execute();

$rowCount = $statement->rowCount();

ob_end_clean();
header('Content-Type: application/json');
echo json_encode([
    "status" => "success",
    "message" => "$rowCount admin added successfully"
]);
exit;