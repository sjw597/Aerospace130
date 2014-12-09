<?php
include_once 'db_connection.php';

function nearest_filter($mysqli, $param) {
    $sql = "SELECT NAME, LAT, LON, NORAD_CAT_ID, max(INSERT_EPOCH), DIRECTION FROM tip GROUP BY NAME";
	$results = $mysqli->query($sql);
    if($results === false) {
      trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $mysqli->error, E_USER_ERROR);
    }
	// Start XML file, create parent node
    $dom = new DOMDocument("1.0");
	
	$node = $dom->createElement("markers");
    $parnode = $dom->appendChild($node);
	
	header("Content-type: text/xml");
    while($row = $results->fetch_assoc()){
            $dis = sqrt(pow($row['LAT']  - $param['LAT'], 2) + pow($row['LON']  - $param['LON'], 2));
            if ($dis <= $param["DIS"]){
				$node = $dom->createElement("marker");
				$newnode = $parnode->appendChild($node);
				$newnode->setAttribute("name", $row['NAME']);
				$newnode->setAttribute("lat", $row['LAT']);
				$newnode->setAttribute("lon", $row['LON']);
				$newnode->setAttribute("id", $row['NORAD_CAT_ID']);
				$newnode->setAttribute("time", $row['INSERT_EPOCH']);
				$newnode->setAttribute("dir", $row['DIRECTION']);
			}
	}
	echo $dom->saveXML();
}


function filter($mysqli, $param) {
    
	$select = "SELECT NAME, LAT, LON, NORAD_CAT_ID, max(INSERT_EPOCH), DIRECTION FROM tip";
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

    $sql = $select . $where . "GROUP BY NAME" . ";";
    //echo $sql . '<br>';
	
	// Start XML file, create parent node
    $dom = new DOMDocument("1.0");
	
	$node = $dom->createElement("markers");
    $parnode = $dom->appendChild($node);
    
	$results = $mysqli->query($sql);
    if($results === false) {
      trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $mysqli->error, E_USER_ERROR);
    }
	// We want to print out XML for AJAX calls.
    header("Content-type: text/xml");

    $results->data_seek(0);
    while($row = $results->fetch_assoc()){
        // ADD TO XML DOCUMENT NODE
        $node = $dom->createElement("marker");
        $newnode = $parnode->appendChild($node);
		$newnode->setAttribute("name", $row['NAME']);
        $newnode->setAttribute("lat", $row['LAT']);
        $newnode->setAttribute("lon", $row['LON']);
		$newnode->setAttribute("id", $row['NORAD_CAT_ID']);
		$newnode->setAttribute("time", $row['INSERT_EPOCH']);
		$newnode->setAttribute("dir", $row['DIRECTION']);
    }
    echo $dom->saveXML();
}