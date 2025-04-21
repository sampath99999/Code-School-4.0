<?php
ob_start();

require_once("./utils/db.php");
require_once("./utils/response.php");
require_once("./utils/token.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendErrorMessage("Method not allowed", 405);
}

if (!isset($_POST["songTitle"], $_POST["artists"], $_POST["category"])) {
    sendErrorMessage("Missing required fields", 400);
}

if (!isset($_FILES["posterFile"], $_FILES["songFile"])) {
    sendErrorMessage("Both poster and song files are required", 400);
}

$songTitle = $_POST["songTitle"];
$artists = $_POST["artists"];
$category = $_POST["category"];

$posterFile = $_FILES["posterFile"];
$songFile = $_FILES["songFile"];

// echo json_encode($_FILES['songFile']);
// exit;


try {
    // Generate unique filenames
    $posterFileName = uniqid("poster_") . "_" . basename($posterFile["name"]);
    $songFileName = uniqid("song_") . "_" . basename($songFile["name"]);

    $posterPath = "../uploads/posters/" . $posterFileName;
    $songPath = "../uploads/songs/" . $songFileName;

    // Create directories if not exist
    if (!is_dir("../uploads/posters")) mkdir("../uploads/posters", 0777, true);
    if (!is_dir("../uploads/songs")) mkdir("../uploads/songs", 0777, true);

    if (!move_uploaded_file($posterFile["tmp_name"], $posterPath)) {
        sendErrorMessage("Poster file upload failed", 500);
    }

    if (!move_uploaded_file($songFile["tmp_name"], $songPath)) {
        sendErrorMessage("Song file upload failed", 500);
    }

    // Store in DB
    $pdo = getPDO();
    $query = "INSERT INTO songs (poster, category_id, song_title, artists, file_path)
              VALUES (:poster, :category, :songTitle, :artists, :filePath)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("poster", $posterPath, PDO::PARAM_STR);
    $stmt->bindParam("category", $category, PDO::PARAM_INT);
    $stmt->bindParam("songTitle", $songTitle, PDO::PARAM_STR);
    $stmt->bindParam("artists", $artists, PDO::PARAM_STR);
    $stmt->bindParam("filePath", $songPath, PDO::PARAM_STR);
    $stmt->execute();

    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "success",
        "message" => "Song uploaded successfully"
    ]);
    exit;

} catch (PDOException $e) {
    sendErrorMessage("Database error: " . $e->getMessage(), 500);
}
