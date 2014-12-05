	function getXMLHTTP() {
	   var x = false;
	   try {
		  x = new XMLHttpRequest();
	   }catch(e) {
		 try {
			x = new ActiveXObject("Microsoft.XMLHTTP");
		 }catch(ex) {
			try {
				req = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e1) {
				x = false;
			}
		 }
	  }
	  return x;
	}
	
	function getCountry() { 
		var strURL="./findcountry.php";
	  var req = getXMLHTTP();
	  if (req) {
	   req.onreadystatechange = function() {
		if (req.readyState == 4) {
		 // only if "OK"
		 if (req.status == 200) {      
		  document.getElementById('countrydiv').innerHTML=req.responseText;
		 } else {
		  alert("Problem while using XMLHTTP:\n" + req.statusText);
		 }
		}    
	   }
	   req.open("GET", strURL, true);
	   req.send(null);
	  }  
	 }
	
	function getRegion(countryId) { 
		var strURL="./findregion.php?country="+countryId;
	  var req = getXMLHTTP();
	  if (req) {
	   req.onreadystatechange = function() {
		if (req.readyState == 4) {
		 // only if "OK"
		 if (req.status == 200) {      
		  document.getElementById('regiondiv').innerHTML=req.responseText;
		  document.getElementById('citydiv').innerHTML='<select name="city">'+
		  '<option>Select City</option>'+'</select>';
		 } else {
		  alert("Problem while using XMLHTTP:\n" + req.statusText);
		 }
		}    
	   }
	   req.open("GET", strURL, true);
	   req.send(null);
	  }  
	 }
	 
	 function getCity(countryId,regionId) {   
	  var strURL="./findcity.php?country="+countryId+"&region="+regionId;
	  var req = getXMLHTTP();
	   
	  if (req) {
	   
	   req.onreadystatechange = function() {
		if (req.readyState == 4) {
		 // only if "OK"
		 if (req.status == 200) {      
		  document.getElementById('citydiv').innerHTML=req.responseText;      
		 } else {
		  alert("Problem while using XMLHTTP:\n" + req.statusText);
		 }
		}    
	   }   
	   req.open("GET", strURL, true);
	   req.send(null);
	  }
		
	 }
	 