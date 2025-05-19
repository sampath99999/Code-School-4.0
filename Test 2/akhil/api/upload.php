<?php 
require_once("../api/config/db.php");
require_once("../api/config/response.php");
header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['id'])) {
    Response::showErrorMessage("Unauthorized", 401);
}


$user_id = $_SESSION['id'];
if (!isset($_POST['artist'], $_POST['music_name'], $_FILES['file'])) {
    Response::showErrorMessage("Missing required fields", 400);
}

$user_id = $_SESSION['id'];
$artist = $_POST['artist'];
$music_name = $_POST['music_name'];
$image_url = $_POST['image_url'] ?? '';
$file = $_FILES['file'];


if (!is_dir('uploads') && !mkdir('uploads', 0755)) {
    Response::showErrorMessage("Could not create upload directory", 500);
}

$filename = time() . '_' . basename($file['name']);
$target_path = 'uploads/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $target_path)) {
    Response::showErrorMessage("File upload failed", 500);
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare("INSERT INTO songs (user_id, image_url, file_path, artist, music_name) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $image_url, $target_path, $artist, $music_name]);

    Response::showSuccessMessage("Upload successful", 200, [
        'image_url' => $image_url,
        'file_path' => $target_path,
        'artist' => $artist,
        'music_name' => $music_name
    ]);

} catch (PDOException $e) {
    Response::showErrorMessage("Database error", 500);
}
