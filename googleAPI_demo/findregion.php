<?php 
	$country=intval($_GET['country']); 
	include('../includes/db_settings.php');

	$query="SELECT id, region_name FROM region WHERE country_id='$country' ORDER BY region_name asc";
	$result=$conn->query($query);
?>

<select name="region" onchange="getCity(<?php echo $country?>,this.value)">
	<option>Select Region</option>
	<?php while ($row=mysqli_fetch_array($result, MYSQLI_ASSOC)) { ?>
		<option value=<?php echo $row['id']?>><?php echo $row['region_name']?></option>
	<?php } ?>
</select>