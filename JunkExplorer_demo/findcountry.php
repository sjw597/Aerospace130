<?php
	include('../includes/db_settings.php');

	$sqlCountry="select id,country from country
				 order by country asc ";
	$resCountry=$conn->query($sqlCountry);
?>

<select name="country" onChange="getRegion(this.value)" style="width:132px">
	<option>Select Country</option>
	<?php while ($row=mysqli_fetch_array($resCountry, MYSQLI_ASSOC)) { ?>
		<option value=<?php echo $row['id']?>><?php echo $row['country']?></option>
	<?php } ?>
</select>