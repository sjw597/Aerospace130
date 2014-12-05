<?php 
	$regionId   = $_GET['region'];
	include('../includes/db_settings.php');

	$query="SELECT city_name FROM city WHERE region_id='$regionId'";
	$result=$conn->query($query);
?>
<select name="city">
	<option>Select City</option>
	<?php while($row=mysqli_fetch_array($result, MYSQLI_ASSOC)) { ?>
		<option value=<?php echo $row['city_name']?>><?php echo $row['city_name']?></option>
	<?php } ?>
</select>