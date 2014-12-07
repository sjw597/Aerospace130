<?php
include_once 'includes/db_connection.php';
include_once 'includes/filters.php';

$request_body = file_get_contents('php://input');
$param = json_decode($request_body);
$param = get_object_vars($param);
$filter_type = $param["type"];

// type 1 => nearest_filter(), type 2 => filter()   see includes/filters.php
if ($filter_type == '1')
    nearest_filter($mysqli, $param);
else if ($filter_type == '2') {
    unset($param["type"]);
    filter($mysqli, $param);
}