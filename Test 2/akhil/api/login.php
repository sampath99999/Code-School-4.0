<?php

require_once("../api/config/generatetoken.php");
require_once("../api/config/db.php");
require_once("../api/config/response.php");


if($_SERVER["REQUEST_METHOD"] != "POST"){
    Response::showErrorMessage("Sever Error not found",404);
}

if(!isset($_POST["email"])|| trim($_POST["email"]) == ""){
    Response::showErrorMessage("email required",404);
}
if(!isset($_POST["password"]) || trim($_POST["password"]) == ""){
    Response::showErrorMessage("password required",404);
}

$email = $_POST["email"];
$password = md5($_POST["password"]);

try{
$pdo = getPDO();
$query = "SELECT * FROM users WHERE email = :email AND password = :password";
$statement = $pdo->prepare($query);
$statement->execute([
    ":email" => $email,
    ":password" => $password
]);
$data = $statement->fetch(PDO::FETCH_ASSOC);

if(!$data){
    Response::showErrorMessage("invalid credentails ",404);
}

    $token = generateToken();
    $data["token"] = $token;
    unset($data["password"]);

    $query = "UPDATE  users SET token = :token WHERE id = :id";

    $statement = $pdo->prepare($query);
    $statement->execute([
        ":token" => $token,
        ":id" => $data["id"]
    ]);
    Response::showSuccessMessage("Logged in Successfully",200, $data);
}
catch(PDOException $e){
    Response::showErrorMessage($e->getMessage(),500);
}



