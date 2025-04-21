<?php 

require_once("./utils/db.php");
require_once("./utils/response.php");
require_once("./utils/token.php");

if($_SERVER["REQUEST_METHOD"] != "POST"){
    sendErrorOutput("Not found",404);
}

if(empty($_POST["username"])){
    sendErrorOutput("User Name required",400);
}

if(empty($_POST["password"])){
    sendErrorOutput("Password is required",400);
}   

$username = $_POST['username'];
$password = md5($_POST['password']);

$pdo = getPDO();

$query = "select * from users where username= :username and password=:password";
$statement = $pdo->prepare($query);
$statement->bindParam("username", $username, PDO::PARAM_STR);
$statement->bindParam("password", $password, PDO::PARAM_STR);
$statement->execute();

$data = $statement->fetch(PDO::FETCH_ASSOC);

if(!$data){
    sendErrorOutput("username and password are invalid",400);
}

else {
    $token = getRandomToken();
    $data['token'] = $token;

    $query = "UPDATE users SET token = :token where id=:id";
    $statement = $pdo->prepare($query);
    $statement->bindParam("token", $token, PDO::PARAM_STR);
    $statement->bindParam("id", $data["id"], PDO::PARAM_INT);
    $statement->execute();
    unset($data['password']);

    sendSuccessOutput("Login successful",$data);
}

