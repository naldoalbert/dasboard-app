<?php
function getConnection()
{
    $host = 'localhost';
    $db_name = 'dasboard-app'; //masukan npm kalian
    $username = 'root';
    $password = '';
    $conn = new mysqli($host, $username, $password, $db_name);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}