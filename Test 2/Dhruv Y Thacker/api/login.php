<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/generateToken.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateData.php";

validateRequest("POST");
$formFields = [
    [

        "label" => "Email",
        "rules" => ["required", "regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$/"],
        "key" => "email",

    ],
    [

        "label" => "Password",
        "rules" => ["required","min:6"],
        "key" => "password",
    ]
];

if(validateData($formFields)){
    $pdo = getPDO();
    $password = md5($_POST["password"]);
    try{
        $query = "SELECT * FROM users WHERE email = :email and password = :password";
    $stmt= $pdo->prepare($query);
    $stmt->bindParam("email",$_POST["email"],PDO::PARAM_STR);
    $stmt->bindParam("password",$password,PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!$result){
        sendErrorOutput("Invalid Credentials",400);
    }

    $token = generateToken();
    $query = "UPDATE users SET token =:token WHERE id = :id";
    $stmt= $pdo->prepare($query);
    $stmt->bindParam("token",$token,PDO::PARAM_STR);
    $stmt->bindParam("id",$result["id"],PDO::PARAM_INT);
    $stmt->execute();
    $result["token"] = $token;
    unset($result["password"]);
    sendSuccessOutput("Login Successful",$result);
    }
    catch(PDOException $e){
        sendErrorOutput("Database Error",500);
    }
}