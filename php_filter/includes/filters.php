<?php

function filter($mysqli, $param) {
    $select = "SELECT * FROM tip";
    $where = " ";
    $first_k = true;
    foreach ($param as $k => $v) {
        if (!$first_k) {
            $where .= "AND ";
        }
        else
            $where .= "WHERE ";
        $first_k = false;
        $first_k2 = true;
        foreach ($v as $k2 => $v2) {
            if (!$first_k2)
                $where .= "OR ";
            else
                $where .= "(";
            $first_k2 = false;
            $v2 = explode(" ", $v2);
            if (count($v2) == 1) {
                $where .= $k . " = '" . $v2[0] . "' ";
            }
            else if (count($v2) == 2) {
                $where .= "(" . $k . " >= '" . $v2[0] . "' AND ";
                $where .= $k . " <= '" . $v2[1] . "') ";
            }
        }
        $where .= ") ";
    }

    $sql = $select . $where . ";";
    echo $sql . '<br>';
    if ($result = $mysqli->query($sql)) {
        while ($obj = $result->fetch_object())
            echo(json_encode($obj));
    }
    else
        echo "Error: " . $sql . "<br>" . $mysqli->error;
}