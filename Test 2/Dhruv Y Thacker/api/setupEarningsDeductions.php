<?php
require_once "./utils/DB.php";
require_once "./utils/response.php";

try {
    $pdo = getPDO();
    
    $query = "SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'earning_deduction_master'
    )";
    $stmt = $pdo->query($query);
    $tableExists = $stmt->fetchColumn();

    if (!$tableExists) {
        $query = "CREATE TABLE earning_deduction_master (
            id SERIAL PRIMARY KEY,
            description VARCHAR(255) NOT NULL UNIQUE,
            type SMALLINT NOT NULL CHECK (type IN (0, 1)),
            status BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $pdo->exec($query);
    }

    $defaultComponents = [
        ['Basic Salary', 0],
        ['House Rent Allowance', 0],
        ['Bonus', 0],
        ['Professional Tax', 1],
        ['Income Tax', 1],
        ['Provident Fund', 1]
    ];

    foreach ($defaultComponents as $component) {
        $query = "INSERT INTO earning_deduction_master (description, type, status) 
                  SELECT :description, :type, true 
                  WHERE NOT EXISTS (
                      SELECT 1 FROM earning_deduction_master 
                      WHERE description = :description AND type = :type
                  )";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam("description", $component[0], PDO::PARAM_STR);
        $stmt->bindParam("type", $component[1], PDO::PARAM_INT);
        $stmt->execute();
    }

    $query = "SELECT * FROM earning_deduction_master ORDER BY type, description";
    $stmt = $pdo->query($query);
    $components = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendSuccessOutput("Setup completed successfully", [
        'components' => $components
    ]);
} catch (PDOException $e) {
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
} catch (Exception $e) {
    sendErrorOutput("Error: " . $e->getMessage(), 500);
} 