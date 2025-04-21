<?php 

require_once("./utils/db.php");
require_once("./utils/response.php");

$token = apache_request_headers()["Authorization"];

if(!$token) {
    sendErrorOutput("Invalid token");
}
else {
    $pdo = getPDO();
    $stmt = $pdo->prepare("select id from users where token=:token");
    $stmt->bindParam('token',$token);
    $stmt->execute();
    $user = $stmt->fetch();

    if($user['id']){
        $playlist_name = isset($_POST['playlist']) ? trim($_POST['playlist']) : '';
        if (empty($playlist_name)) {
            sendErrorOutput("Playlist name not exist");
            exit;
        }

        // Handle file uploads
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $allowed_types = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
        $uploaded_files = [];

        if (!empty($_FILES['music']['name'][0])) {
            foreach ($_FILES['music']['name'] as $key => $name) {
                $tmp_name = $_FILES['music']['tmp_name'][$key];
                $type = $_FILES['music']['type'][$key];
                $error = $_FILES['music']['error'][$key];

                if ($error === UPLOAD_ERR_OK && in_array($type, $allowed_types)) {
                    $file_name = uniqid() . '_' . basename($name);
                    $file_path = $upload_dir . $file_name;

                    if (move_uploaded_file($tmp_name, $file_path)) {
                        $uploaded_files[] = ['path' => $file_path, 'title' => $name];
                    } else {
                        sendErrorOutput("Failed to move upload");
                        exit;
                    }
                } else {
                    sendErrorOutput("Invalid file type or upload error");
                    exit;
                }
            }
        } else {
            sendErrorOutput("Invalid file type or upload error");
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO playlists (user_id, name) VALUES (:user_id, :name) RETURNING id');
        $stmt->execute(['user_id' => $user['id'], 'name' => $playlist_name]);
        $playlist_id = $stmt->fetchColumn();

        
        $stmt = $pdo->prepare('INSERT INTO songs (playlist_id, file_path, title) VALUES (:playlist_id, :file_path, :title)');
        foreach ($uploaded_files as $file) {
            $stmt->execute([
                'playlist_id' => $playlist_id,
                'file_path' => $file['path'],
                'title' => $file['title']
            ]);
        }
        }
}