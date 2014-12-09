<?php
		include_once '../accounts/includes/functions.php';
		include_once '../accounts/includes/db_acc_settings.php';
		include_once('../includes/db_settings.php');
		sec_session_start();

		$countryid=intval($_POST['country']);
		$regionid=intval($_POST['region']);
		$city=$_POST['city']; 
		$uid = $_SESSION['user_id'];

		$query="INSERT INTO memberloc (id, countryid, regionid, city) VALUES (" .$uid. "," .$countryid. "," .$regionid. ", '" .$city."') ON DUPLICATE KEY UPDATE countryid=" .$countryid. ", regionid=" .$regionid. ", city='" .$city. "'";
		$result=$conn->query($query);
		if ($result == true) {
			echo "Update success! You should be redirected in three seconds.";
		}
		else{
			echo "Failed query.  You should be redirected in three seconds.";
		}
		echo '<meta http-equiv="refresh" content="3;url=index.php" />';
		exit();
?>