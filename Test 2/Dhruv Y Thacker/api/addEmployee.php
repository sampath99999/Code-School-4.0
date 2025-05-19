<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";
require_once "./utils/validateRequest.php";
require_once "./utils/validateData.php";
require_once "./utils/validateToken.php";

validateRequest("POST");
$employee = validateToken();
if ($employee["role"] != "admin") {
    sendErrorOutput("Unauthorized Request", 401);
}

$formFields = [
    [
        "label" => "Name",
        "rules" => ["required"],
        "key" => "name",
    ],
    [
        "label" => "Date of Birth",
        "rules" => ["required"],
        "key" => "dob",
    ],
    [
        "label" => "Phone",
        "rules" => ["required", "regex:/^\d{10}$/"],
        "key" => "phone",
    ],
    [
        "label" => "Designation",
        "rules" => ["required"],
        "key" => "designation",
    ],
    [
        "label" => "Department",
        "rules" => ["required"],
        "key" => "department",
    ],
    [
        "label" => "Email",
        "rules" => ["required", "regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/"],
        "key" => "email",
    ],
    [
        "label" => "Password",
        "rules" => ["required", "min:6"],
        "key" => "password",
    ],
    [
        "label" => "Role",
        "rules" => ["required", "accepts:admin,employee"],
        "key" => "role",
    ]
];

function validateEmail($email, $pdo) {
    $query = "SELECT * FROM users WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam("email", $email, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        sendErrorOutput("Email Already exists", 400);
    }
}

if (validateData($formFields)) {
    $pdo = getPDO();
    validateEmail($_POST["email"], $pdo);
    $password = md5($_POST["password"]);
    try {
        // Insert into employees table
        $query = "INSERT INTO employees (name, dob, phone, designation, department) VALUES (:name, :dob, :phone, :designation, :department) RETURNING id";
        $stmt = $pdo->prepare($query);
        $name = $_POST["name"];
        $dob = $_POST["dob"];
        $phone = $_POST["phone"];
        $designation = $_POST["designation"];
        $department = $_POST["department"];
        $stmt->bindParam("name", $name, PDO::PARAM_STR);
        $stmt->bindParam("dob", $dob, PDO::PARAM_STR);
        $stmt->bindParam("phone", $phone, PDO::PARAM_STR);
        $stmt->bindParam("designation", $designation, PDO::PARAM_STR);
        $stmt->bindParam("department", $department, PDO::PARAM_STR);
        $stmt->execute();
        $employeeId = $pdo->lastInsertId();

        // Insert into users table
        $query = "INSERT INTO users (employee_id, email, password, role) VALUES (:employee_id, :email, :password, :role)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam("employee_id", $employeeId, PDO::PARAM_INT);
        $stmt->bindParam("email", $_POST["email"], PDO::PARAM_STR);
        $stmt->bindParam("password", $password, PDO::PARAM_STR);
        $stmt->bindParam("role", $_POST["role"], PDO::PARAM_STR);
        $stmt->execute();

        sendSuccessOutput("Employee added successfully.");
    } catch (PDOException $e) {
        sendErrorOutput("Database Error: " . $e->getMessage(), 500);
    }
} 