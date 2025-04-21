<?php

require_once("./utils/db.php");
require_once("./utils/response.php");

if($_SERVER["REQUEST_METHOD"] != "POST"){
    sendErrorOutput("Not found",404);
}

if(empty($_POST["username"])){
    sendErrorOutput("user name required",400);
}
if(empty($_POST["email"])){
    sendErrorOutput("email required",400);
}
if(empty($_POST["password"])){
    sendErrorOutput("Password is required",400);
}   

try {

    $pdo = getPDO();
    $email = $_POST['email'];
    
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email=:email");
    $stmt->execute([':email' => $email]);
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        sendErrorOutput('Email already exists',200);
    } 
    else {
        $username = $_POST["username"];
        $email = $_POST["email"];
        $password = md5($_POST['password']);

        $query = "insert into users(username,email,password) 
                    values (:username,:email,:password)";
        $statement = $pdo->prepare($query);
        $statement->bindParam(":username", $username, PDO::PARAM_STR);
        $statement->bindParam(":email", $email, PDO::PARAM_STR);
        $statement->bindParam(":password", $password, PDO::PARAM_STR);

        if($statement->execute()){
            sendSuccessOutput("Registered Successfully",200);
        }
        else {
            sendErrorOutput("Registration failed",400);
        }
    }
} 
catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}




