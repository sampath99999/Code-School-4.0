<?php
require_once "db.php";

$pdo = getPDO();

if (!$pdo) {
    die("Database connection failed.");
}

try {
    $admins = $pdo->query("SELECT id, password FROM admin_users")->fetchAll(PDO::FETCH_ASSOC);

    foreach ($admins as $admin) {
        // Agar password already hashed hai, toh skip karo
        if (password_get_info($admin['password'])['algo']) {
            continue;
        }

        $hashed = password_hash($admin['password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE admin_users SET password = ? WHERE id = ?");
        $stmt->execute([$hashed, $admin['id']]);
    }

    echo "✅ Admin passwords hashed successfully!";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
