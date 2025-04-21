<?php

const DB_HOST = "localhost";
const DB_PORT = "5432";
const DB_NAME = "gateway";
const DB_USERNAME = "postgres";
const DB_PASSWORD = "Uday@123";

function getPDO()
{
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
    $pdo = new PDO($dsn, DB_USERNAME, DB_PASSWORD, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    return $pdo;
}
