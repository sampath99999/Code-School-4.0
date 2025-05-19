<?php
require_once "response.php";
const DB_HOST = "localhost";
const DB_PORT = 5432;
const DB_NAME = "payroll";
const DB_USER = "postgres";
const DB_PASS = "Hello@123";

function getPDO()
{
   try{
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    return $pdo;
   }
   catch(PDOException $e){
    sendErrorOutput($e->getMessage(),500);
   }
}