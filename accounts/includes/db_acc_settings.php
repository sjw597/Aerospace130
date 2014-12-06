<?php
	$DBServer = '107.170.221.211';
	$DBUser   = 'sec_user';
	$DBPass   = 'q4FXknLH';
	$DBName   = 'secure_login';
	$acc_conn = mysqli_connect($DBServer, $DBUser, $DBPass, $DBName);
	// check connection
	if (mysqli_connect_errno()) {
		echo('Database connection failed: '  . mysqli_connect_error());
	}
define("CAN_REGISTER", "any");
define("DEFAULT_ROLE", "member");
 
define("SECURE", FALSE);    // FOR DEVELOPMENT ONLY!!!!
?>