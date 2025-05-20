<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['employee_id'])) {
    // Redirect to login page if not authenticated
    header('Location: login.php');
    exit;
}

// Return employee_id for use in the frontend
$employeeId = $_SESSION['employee_id'];
?>