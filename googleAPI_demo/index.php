<?php
include_once '../accounts/includes/db_acc_settings.php';
include_once '../accounts/includes/functions.php';

sec_session_start();
 
if (login_check($mysqli) == true) {
    $logged = 'in';
} else {
    $logged = 'out';
}
?>

<html ng-app="MX_DebugConsoleApp">
  <head>
    <title>Demo</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <script type="text/javascript" src="js/lib/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/lib/angular.min.js"></script>
    <script type="text/javascript" src="js/lib/angular-route.min.js"></script>
    <script type="text/javascript" src='js/app.js'></script>
    <script type="text/javascript" src='js/controllers.js'></script>
    <script type="text/javascript" src='js/printjson.js'></script>
	<script type="text/JavaScript" src="../accounts/js/sha512.js"></script> 
	<script type="text/JavaScript" src="../accounts/js/forms.js"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=places"></script>
  </head>
  <body ng-controller="mainpanelCtrl">
    <div class = 'navbar navbar-default navbar-fixed-top' role='navigation'>
	
		<form class="navbar-form navbar-right" role="search" action="../accounts/includes/process_account.php" method="post">

			<div class="form-group">
				<input type="text" class="form-control" name="username" id="username" placeholder="Username">
			</div>
			<div class="form-group">
				<input type="password" class="form-control" name="password" id="password" placeholder="Password">
			</div> 
			
			<input type="button" value="Login" class="btn btn-default" onclick="formhash(this.form, this.form.password);"/>
			
			<input type="button" value="Register" class="btn btn-default" onclick="return regformhash(this.form, this.form.username, this.form.password);"/>
			
		</form>
		
		
		<div class="container-fluid" style="background-image: url(./img/banner.png); height: 100px; border: 1px solid #0082D5">
		<div style="background-color:rgba(225, 225, 225, .7); margin-top:10px; height:80px; width:400px; padding:20px; border-radius:10px ">LOGO</div>	
		<div class='navbar-header'> </div>
        <p class="navbar-text" style="color:black">{{prompt}}</p>
      </div>
    </div>
    <div class="container-fluid">
      <div class='col-sm-1 col-md-1 sidebar'>
        <ul class='nav nav-sidebar'>
          <li><a id='utilities_0' style='' href="#/demo1">Search</a></li>
        </ul>
      </div>
      <div ng-view></div>
    </div>
  </body>
</html>
