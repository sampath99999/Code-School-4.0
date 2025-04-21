<?php
require_once("./DB.php");
require_once("./response.php");
require_once("./token.php");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
  sendErrorOutput("Not found", 404);
}

if (!isset($_POST["email"])) {
  sendErrorOutput("email is required", 400);
}
if (!isset($_POST["password"])) {
  sendErrorOutput("password is required", 400);
}
if (!isset($_POST["role"])) {
  sendErrorOutput("role is required", 400);
  exit;
}

$pdo = getPDO();
$email = $_POST["email"];
$role = $_POST["role"];
$password = $_POST["password"];

if ($role == 'FlatOwner') {

  $query = "SELECT * FROM owners WHERE email = :email and password = :password";
  $stmt = $pdo->prepare($query);
  $stmt->bindParam(":email", $email, PDO::PARAM_STR);
  $stmt->bindParam(":password", $password, PDO::PARAM_STR);
  $stmt->execute();

  $data = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$data) {
    sendErrorOutput("Invalid Email or Password", 400);
  }

  $token = getRandomToken();
  $data["token"] = $token;

  $query = "UPDATE owners SET token = :token WHERE id = :id";
  $statement = $pdo->prepare($query);
  $statement->bindParam("token", $token, PDO::PARAM_STR);
  $statement->bindParam("id", $data["id"], PDO::PARAM_INT);
  $statement->execute();
} else {

  $query = "SELECT * FROM security WHERE email = :email and password = :password";
  $stmt = $pdo->prepare($query);
  $stmt->bindParam("email", $email, PDO::PARAM_STR);
  $stmt->bindParam("password", $password, PDO::PARAM_STR);
  $stmt->execute();

  $data = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$data) {
    sendErrorOutput("Invalid Email or Password", 400);
  }

  $token = getRandomToken();
  $data["token"] = $token;

  $query = "UPDATE security SET token = :token WHERE id = :id";
  $statement = $pdo->prepare($query);
  $statement->bindParam("token", $token, PDO::PARAM_STR);
  $statement->bindParam("id", $data["id"], PDO::PARAM_INT);
  $statement->execute();
}


unset($data["password"]);
sendSuccessOutput("Login Successfull", $data);
