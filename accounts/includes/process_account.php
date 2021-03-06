<?php
include_once 'db_acc_settings.php';
include_once 'functions.php';
 
sec_session_start(); // Our custom secure way of starting a PHP session.
 
if (isset($_POST['username'], $_POST['p'])) {
	if (isset($_POST['l']))
	{
		$username = $_POST['username'];
		$password = $_POST['p']; // The hashed password.
	 
		if (login($username, $password, $acc_conn) == true) {
			// Login success 
			header('Location: ../../JunkExplorer_demo/index.php');
			exit();
		} else {
			// Login failed 
			header('Location: ../../JunkExplorer_demo/index.php?error=1');
		}
	}
	elseif (isset($_POST['r']))
	{
    // Sanitize and validate the data passed in
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);
    if (strlen($password) != 128) {
        // The hashed pwd should be 128 characters long.
        // If it's not, something really odd has happened
        $error_msg .= '<p class="error">Invalid password configuration.</p>';
    }

    // check existing username
    $prep_stmt = "SELECT id FROM members WHERE username = ? LIMIT 1";
    $stmt = $acc_conn->prepare($prep_stmt);
 
    if ($stmt) {
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->store_result();
 
                if ($stmt->num_rows == 1) {
                        // A user with this username already exists
                        $error_msg .= '<p class="error">A user with this username already exists</p>';
                        $stmt->close();
                }
                $stmt->close();
        } else {
                $error_msg .= '<p class="error">Database error line 55</p>';
                $stmt->close();
        }
	echo "checked existing username";
    // TODO: 
    // We'll also have to account for the situation where the user doesn't have
    // rights to do registration, by checking what type of user is attempting to
    // perform the operation.
 
    if (empty($error_msg)) {
        // Create a random salt
        //$random_salt = hash('sha512', uniqid(openssl_random_pseudo_bytes(16), TRUE)); // Did not work
        $random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
 
        // Create salted password 
        $password = hash('sha512', $password . $random_salt);
 
        // Insert the new user into the database 
        if ($insert_stmt = $acc_conn->prepare("INSERT INTO members (username, password, salt) VALUES (?, ?, ?)")) {
            $insert_stmt->bind_param('sss', $username, $password, $random_salt);
            // Execute the prepared query.
            if (! $insert_stmt->execute()) {
                header('Location: ../error.php?err=Registration failure: INSERT');
            }
        }
        header('Location: ../register_success.php');
    }
}
	
} else {
    // The correct POST variables were not sent to this page. 
    echo 'Invalid Request';
}