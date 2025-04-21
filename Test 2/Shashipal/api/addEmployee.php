<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/getToken.php";
require_once "./utils/validateData.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";

validateRequest("POST");
$employee = validateToken();
if ($employee["role"] != "hr") {
    sendErrorOutput("Unauthorized Request",401);
}

$formFields = [
    [
        "label" => "Name",
        "rules" => ["required"],
        "key" => "name",
    ],
    [
        "label" => "Date of Birth",
        "rules" => ["required"],
        "key" => "dateOfBirth",
    ],
    [
        "label" => "Phone Number",
        "rules" => ["required","min:10","max:10"],
        "key" => "phoneNumber",
    ],
    [
        "label" => "Address",
        "rules" => ["required"],
        "key" => "address",
    ],
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
function validateEmail($email,$pdo){
    $query = "SELECT * FROM employees WHERE email=:email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("email",$_POST["email"],PDO::PARAM_STR);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if($result){
        sendErrorOutput("Email Already exists",400);
    }
}
if(validateData($formFields)){
    $pdo = getPDO();
    validateEmail($_POST["email"],$pdo);
    $password =md5($_POST["password"]);
    try{
        $query = "INSERT INTO employees (name,email,date_of_birth,phone_number,address,password) VALUES(:name,:email,:date_of_birth,:phone_number,:address,:password)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("name",$_POST["name"],PDO::PARAM_STR);
    $stmt->bindParam("email",$_POST["email"],PDO::PARAM_STR);
    $stmt->bindParam("date_of_birth",$_POST["dateOfBirth"],PDO::PARAM_STR);
    $stmt->bindParam("phone_number",$_POST["phoneNumber"],PDO::PARAM_STR);
    $stmt->bindParam("address",$_POST["address"],PDO::PARAM_STR);
    $stmt->bindParam("password",$password,PDO::PARAM_STR);
    $stmt->execute();
    sendSuccessOutput("Employee Added Successfully");
    }catch(PDOException $e){
        sendErrorOutput("Database Error",500);
    }

}