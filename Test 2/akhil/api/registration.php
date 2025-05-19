<?php 

require_once "../api/config/response.php";
require_once "../api/config/db.php";

if($_SERVER["REQUEST_METHOD"] != "POST"){
    Response::showErrorMessage("Sever Error not found",404);
}

if(!isset($_POST['firstname']) || !isset($_POST['lastname']) || !isset($_POST['email']) || !isset($_POST['password'])  ){
    Response::showErrorMessage("invalid input",400);
}
if(trim($_POST['firstname'])== "" || trim($_POST['lastname'])== "" || trim($_POST['email'])== "" ||  trim($_POST['password'])== ""  ){
    Response::showErrorMessage("empty input",400);
}

$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$email = $_POST['email'];
$password = md5($_POST['password']);

try{
    $pdo = getPDO();
    $query = "SELECT * FROM users WHERE email = :email";
    $statement = $pdo->prepare($query);
    $statement->execute([
        ":email" => $email
    ]);

    if($statement->rowCount() > 0){
        Response::showErrorMessage("user already exists",400);
    }


    $query = "INSERT INTO users (firstname,lastname,email,password) VALUES (:firstname, :lastname, :email, :password)";
    $statement = $pdo->prepare($query);
    $statement->execute([
        ":firstname" => $firstname,
        ":lastname" => $lastname,
        ":email" => $email,
        ":password" => $password,
    ]);
    $id = $pdo->lastInsertId();
    if (!file_exists("uploads/user_id".$id)) {    
         mkdir("uploads/user_id".$id, 0777, true); 
        }

}
catch(PDOException $e){
    Response::showErrorMessage($e->getMessage(),500);
}