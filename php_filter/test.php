<?php
include_once 'includes/db_connection.php';
include_once 'includes/filters.php';

//example use of and_filter
filter($mysqli, ["ID_KEY" => ["2", "3"]]);
echo "<br><br>";
filter($mysqli, ["ID_KEY" => ["1 5", "10"]]);
echo "<br><br>";
filter($mysqli, ["ID_KEY" => ["1 5", "10"], "WINDOW" => ["200 400"]]);
echo "<br><br>";
filter($mysqli, ["ID_KEY" => ["1 5", "10"], "WINDOW" => ["14", "300"]]);
echo "<br><br>";