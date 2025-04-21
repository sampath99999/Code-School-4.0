<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
header('Content-Type: application/json');

$pdo = getPDO();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $visitor_name = $_POST['visitor_name'];
    $flat_number = $_POST['flat_number'];
    $query = "INSERT INTO guard_requests (visitor_name, flat_number, number, bike_number)
          VALUES (:visitor_name, :flat_number, :number, :bike_number)";
   
    
    try {
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':visitor_name', $visitor_name);
        $stmt->bindParam(':flat_number', $flat_number);
        $stmt->bindParam(':number', $_POST['number']); 
        $stmt->bindParam(':bike_number', $_POST['bike_number']); 
        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Request added successfully!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
