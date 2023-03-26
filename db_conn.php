<?php

session_start();

$sname = "localhost";
$uname = "root";
$password = "";

$db_name = "ecc_lbfs";

$conn = mysqli_connect($sname, $uname, $password, $db_name);

if(!$conn)
{
    die("Database Connection Failed: ".mysqli_connect_error());
}
?>