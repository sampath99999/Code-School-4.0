<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateToken.php";
require_once "./utils/validateData.php";

validateRequest("POST");
$employee = validateToken();
$employeeId = $employee["id"];
$formFields = [
    [
        "label" => "Date",
        "rules" => ["required"],
        "key" => "date",
    ],
];

$pdo =getPDO();

try {
    $query = "SELECT id,clock_out FROM employee_attendance WHERE employee_id = :id and date= :date";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("id", $employeeId, PDO::PARAM_INT);
    $stmt->bindParam("date", $_POST["date"], PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        if($result["clock_out"]){
            sendErrorOutput("You are already Clocked Out Today");
        }
        sendSuccessOutput(" clocked In",true);
    }
    
    sendSuccessOutput("Not Clocked",false);
} catch (PDOException $e) {
    sendErrorOutput("Database error", 500);
}