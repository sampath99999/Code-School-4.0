<?php

require_once "./utils/DB.php";
require_once "./utils/response.php";

function validateToken()
{
    $headers = apache_request_headers();
    if (!isset($headers["Authorization"])) {
        sendErrorOutput("employee not found", 404);
    }
    $token = $headers["Authorization"];
    $pdo = getPDO();
    try {
        $query = "SELECT * FROM users WHERE token=:token";
        $statement = $pdo->prepare($query);
        $statement->bindParam("token", $token, PDO::PARAM_STR);
        $statement->execute();
        $employee = $statement->fetch(PDO::FETCH_ASSOC);
        if (!$employee) {
            sendErrorOutput("Invalid Token", 498);
        }
        return $employee;
    } catch (PDOException $e) {
        sendErrorOutput("Error in Database", 500);
    }
}