<?php 
    require_once(dirname(__FILE__) . '/accounts/includes/db_acc_settings.php');
	require_once(dirname(__FILE__) . '/accounts/includes/functions.php');
	require_once(dirname(__FILE__) . '/includes/db_settings.php');
	
	sec_session_start(); 

    // Start XML file, create parent node
    $dom = new DOMDocument("1.0");
	
	$node = $dom->createElement("markers");
    $parnode = $dom->appendChild($node);
	
	// This is for user account location preference.
	if (login_check($acc_conn) == true) {
		$uid = $_SESSION['user_id'];
		$sql = 'SELECT distinct lattitude, longitude, city.city_name FROM memberloc, city 
				WHERE memberloc.regionid = city.region_id AND
					memberloc.city = city.city_name AND
					memberloc.id = ' . $uid;
		$results = $conn->query($sql);
		$user_coordinates = $results->fetch_assoc();
		if ($user_coordinates != null){
	    $node = $dom->createElement("location");
		$newnode = $parnode->appendChild($node);
		$newnode->setAttribute("lat", $user_coordinates['lattitude']);
        $newnode->setAttribute("lon", $user_coordinates['longitude']);
		$newnode->setAttribute("city", $user_coordinates['city_name']);
		}
	}

    $sql = 'SELECT NAME, LAT, LON, NORAD_CAT_ID, max(INSERT_EPOCH), DIRECTION FROM tip GROUP BY NAME';
    $results = $conn->query($sql);

    if($results === false) {
      trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $conn->error, E_USER_ERROR);
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
?>