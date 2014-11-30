<?php 
    require_once(dirname(__FILE__) . '/includes/db_settings.php');

    // Start XML file, create parent node
    $dom = new DOMDocument("1.0");
    $node = $dom->createElement("markers");
    $parnode = $dom->appendChild($node);
    // TODO: Add satellite name when it is added to DB.
    $sql = 'SELECT LAT, LON FROM tip';
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
        $newnode->setAttribute("lat", $row['LAT']);
        $newnode->setAttribute("lon", $row['LON']);
    }
    echo $dom->saveXML();
?>