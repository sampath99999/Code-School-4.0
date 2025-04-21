<?php

const DB_HOST = "localhost";
const DB_PORT = 5432;
const DB_NAME = "attendancemanagement";
const DB_USERNAME = "postgres";
const DB_PASSWORD = '996619';

function getPDO()
{
    try {
        $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
        $pdo = new PDO($dsn, DB_USERNAME, DB_PASSWORD, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        return $pdo;
    } catch (PDOException $e) {
        echo "Database Connection Error: " . $e->getMessage();
        exit; 
    }
}
