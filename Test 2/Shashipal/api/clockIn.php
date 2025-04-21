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
        "label" => "Clock In Time",
        "rules" => ["required"],
        "key" => "clockIn",
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
$remarks = null;
if (isset($_POST["remarks"])) {
    $remarks = $_POST["remarks"];
}
function validateClockIn($date, $employeeId, $pdo)
{
    try {
        $query = "SELECT id FROM employee_attendance WHERE employee_id = :id and date= :date";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam("id", $employeeId, PDO::PARAM_INT);
        $stmt->bindParam("date", $date, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            sendErrorOutput("You have already clocked In");
        }
    } catch (PDOException $e) {
        sendErrorOutput("Database error", 500);
    }
}

if (validateData($formFields)) {
    $pdo = getPDO();
    validateClockIn($_POST["date"], $employeeId, $pdo);
    try {
        $query = "INSERT INTO employee_attendance (employee_id,date,clock_in,latitude,longitude,remarks) VALUES (:employeeId,:date,:clock_in,:latitude,:longitude,:remarks)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam("employeeId", $employeeId, PDO::PARAM_INT);
        $stmt->bindParam("date", $_POST["date"], PDO::PARAM_STR);
        $stmt->bindParam("clock_in", $_POST["clockIn"], PDO::PARAM_STR);
        $stmt->bindParam("latitude",$_POST["latitude"],PDO::PARAM_STR);
        $stmt->bindParam("longitude",$_POST["longitude"],PDO::PARAM_STR);
        $stmt->bindParam("remarks", $remarks, PDO::PARAM_STR);
        $stmt->execute();
        sendSuccessOutput("Clocked In successfully");
    } catch (PDOException $e) {
        sendErrorOutput("Database error", 500);
    }

}

