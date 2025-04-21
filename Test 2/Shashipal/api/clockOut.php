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
    [
        "label" => "Clock out Time",
        "rules" => ["required"],
        "key" => "clockOut",
    ],
    [
        "label" => "Latitude",
        "rules" => ["required"],
        "key" => "latitude",
    ],
    [
        "label" => "Longitude",
        "rules" => ["required"],
        "key" => "longitude",
    ],

];
function validateClockIn($date,$employeeId, $pdo)
{
    try {
        $query = "SELECT id,latitude,longitude FROM employee_attendance WHERE employee_id = :id and date= :date";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam("id", $employeeId, PDO::PARAM_INT);
        $stmt->bindParam("date", $date, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$result) {
            sendErrorOutput("You have not clocked In yet");
        }
        if($result["latitude"] !== $_POST["latitude"] || $result["longitude"] !== $_POST["longitude"]){
            sendErrorOutput("You have moved out Cannot clock out");
        }

    } catch (PDOException $e) {
        sendErrorOutput("Database error" .$e->getMessage(), 500);
    }
}

if (validateData($formFields)) {
    $pdo = getPDO();
    validateClockIn($_POST["date"],$employeeId, $pdo);
    try {
        $query = "UPDATE employee_attendance SET clock_out = :clockOut WHERE employee_id = :id and date= :date";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam("id", $employeeId, PDO::PARAM_INT);
        $stmt->bindParam("date", $_POST["date"], PDO::PARAM_STR);
        $stmt->bindParam("clockOut", $_POST["clockOut"], PDO::PARAM_STR);
        $stmt->execute();
        sendSuccessOutput("Clocked Out successfully");
    } catch (PDOException $e) {
        sendErrorOutput("Database error" .$e->getMessage(), 500);
    }

}