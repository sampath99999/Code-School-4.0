<?php
require_once("./DB.php");
require_once("./response.php");

$pdo = getPDO();
$stmt = $pdo->query("SELECT flat_number FROM owners ORDER BY flat_number ASC");

$flats = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($flats);