var consoleControllers = angular.module('consoleControllers', []);
consoleControllers.controller('mainpanelCtrl', ['$scope',
    function($scope) {}
]);

var map_global;

consoleControllers.controller('demo1Ctrl', ['$scope',
    function($scope) {
        scopeSetup(0);
        // Create the autocomplete object, restricting the search
        // to geographical location types.
        var autocomplete = new google.maps.places.Autocomplete(
            /** @type {HTMLInputElement} */
            (document.getElementById('autocomplete')), {
                types: ['geocode']
            });
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            $scope.changeMapCenter();
        });
        var myLatlng = new google.maps.LatLng(0,0);
        var mapOptions = {
	    minZoom: 2,
	    maxZoom: 8,
            zoom: 2,
            center: myLatlng,
	    mapTypeControl: false,
	    streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

	map_global=map;

	nite.init(map);
	
	$scope.downloadUrl= function(url,callback){
            var request = window.ActiveXObject ?
                new ActiveXObject('Microsoft.XMLHTTP') :
                new XMLHttpRequest;

            request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    request.onreadystatechange = $scope.doNothing;
                    callback(request, request.status);
                }
            };
	    
            request.open('GET', url, true);
            request.send(null);
        }


	$scope.downloadUrl("http://107.170.221.211/ct_workspace/Aerospace130/generate_mark_xml.php", function(data) {
            var xml = data.responseXML;
            var markers = xml.documentElement.getElementsByTagName("marker");
	    var userlocation = xml.documentElement.getElementsByTagName("location");
            for (var i = 0; i < markers.length; i++) {
		addMarker(markers[i]);
            }

	    //TODO: this isn't working. 
	    /*
	    if (userlocation != null){
		console.log(userlocation[0].getAttribute("lat"));
		console.log(userlocation[0].getAttribute("lon"));
		var point = new google.maps.LatLng(
		    parseFloat(userlocation[0].getAttribute("lat")),
		    parseFloat(userlocation[0].getAttribute("lon")));
		map.setCenter(point);
	    }
	    */
        });


/*
	$scope.downloadUrl("http://107.170.221.211/ta_workspace/Aerospace130/generate_mark_xml.php", function(data) {
	    var xml = data.responseXML;
            var markers = xml.documentElement.getElementsByTagName("marker");
	    //var MultiMap = require("collections/multi-map");
	    var objToPath = {};
            for (var i = 0; i < markers.length; i++) {
		//console.log(i);
		var objID = markers[i].getAttribute("id");
		//console.log(objID);
		if(objID in objToPath) {
		    //add the marker to the end of the existing array
		    //console.log("in path");
		    var arr = objToPath[objID];
		    arr[arr.length] = markers[i];
		} else {
		    //make a new array with the marker in it, and put in objToPath
		    //console.log("not in path");
		    var arr = new Array(markers[i]);
		    objToPath[objID] = arr;
		}
            }
	    //now objToPath is filled
	    //sort each array in objToPath by time and draw the path on the map
	    for(var pathID in objToPath) {
		//console.log(pathID);
		//console.log(objToPath[pathID].length);
		if(pathID > 11000 || pathID < 10000) //in this example, only plot a few objects
		    continue;
		var path = objToPath[pathID];
		path.sort(function(a,b) {
		   return a.getAttribute("time").localeCompare(b.getAttribute("time")); 
		});
		/*
		for(var i = 0; i < path.length; i++) {
		    console.log(path[i].getAttribute("time"));
		}
		*/
		/*
		var highInterest = false;
		var currentPathCoordinates = []
		for(var i = 0; i < path.length; i++) {
		    if(path[i].getAttribute("intr").toLowerCase() == "y")
			highInterest = true;
		    currentPathCoordinates[currentPathCoordinates.length] = 
			new google.maps.LatLng(parseFloat(path[i].getAttribute("lat")),
					       parseFloat(path[i].getAttribute("lon")));
		}
		var currentPath = new google.maps.Polyline({
		    path: currentPathCoordinates,
		    geodesic: true,
		    strokeColor: '#'+Math.floor(Math.random()*16777215).toString(16), //random color
		    strokeOpacity: 1.0,
		    strokeWeight: highInterest ? 4 : 2
		});
		currentPath.setMap(map);
	    }
	    //removed the marker thing for this
	    /*
            for (var i = 0; i < markers.length; i++) {
                //console.log(markers[i].getAttribute("lat"));
                //console.log(markers[i].getAttribute("lon"));
                var point = new google.maps.LatLng(
                    parseFloat(markers[i].getAttribute("lat")),
                    parseFloat(markers[i].getAttribute("lon")));
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png'
                });
            }
	    */
		/*
	});*/

        $scope.doNothing = function() {}

        $scope.changeMapCenter = function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17); // Why 17? Because it looks good.
            }
        }
    }
]);

consoleControllers.controller('accountCtrl', function() {});

consoleControllers.controller('blankCtrl', function() {});

//credit to http://stackoverflow.com/questions/18368485/angular-js-resizable-div-directive
//modified to fit Bootstrap
consoleControllers.directive('resizer',
    function($document) {
        return function($scope, $element, $attrs) {
            var initPosX = 0.0;
            var dragMin = $($attrs.resizerLeft).offset().left + 100;
            var dragMax = $element.offset().left;
            $element.on('mousedown', function(event) {
                event.preventDefault();
                initPosX = $element.offset().left + parseFloat($($attrs.resizerRight).css('width'));
                initPosX += parseFloat($($attrs.resizerRight).css('padding-left'));
                initPosX += parseFloat($($attrs.resizerRight).css('padding-right'));
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {

                if ($attrs.resizer == 'vertical') {
                    // Handle vertical resizer
                    var x = event.clientX;
                    x = x > dragMax ? dragMax : x;
                    x = x < dragMin ? dragMin : x;
                    $element.css({
                        marginLeft: x + 'px'
                    });

                    $($attrs.resizerLeft).css({
                        width: (x - parseFloat($($attrs.resizerLeft).css('marginLeft'))) + 'px'
                    });
                    if (typeof $attrs.resizerLeftt != "undefined") {
                        $($attrs.resizerLeftt).css({
                            width: (x - parseFloat($($attrs.resizerLeftt).css('marginLeft'))) + 'px'
                        });
                    }
                    //console.log(initPosX, x);
                    $($attrs.resizerRight).css({
                        marginLeft: x + 'px',
                        width: (initPosX - x) + 'px'
                    });

                } else {
                    //I didnt modified this part to fit Bootstrap, need to change a little bit
                    // Handle horizontal resizer
                    var y = window.innerHeight - event.pageY;

                    $element.css({
                        bottom: y + 'px'
                    });

                    $($attrs.resizerTop).css({
                        bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
                    });
                    $($attrs.resizerBottom).css({
                        height: y + 'px'
                    });
                }
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        };
    }
);

function scopeSetup(index) {
    for (var i = 0; i <= 1; i++) {
        document.getElementById('utilities_' + i).style.backgroundColor = (i == index ? '#cccccc' : '');
    }
}


/*
  A global array of marker points. We need this in case we want to remove points
  with filters, or iterate through them for export. From now on, use the following
  functions to add or remove points to the map.
*/
var marker_arr = [];

function addMarker(marker_xml) {
    var location = new google.maps.LatLng(
	parseFloat(marker_xml.getAttribute("lat")),
	parseFloat(marker_xml.getAttribute("lon")));

    var name = marker_xml.getAttribute("name");

    var marker = new google.maps.Marker({
	map: map_global,
	position: location,
	icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png',
	title: name
    });

    var content = 'NAME: ' + name + 
	'<br> NORAD ID: ' + marker_xml.getAttribute("id") + 
	'<br> LAT: ' + marker_xml.getAttribute("lat") + 
	'<br> LON: ' + marker_xml.getAttribute("lon") +
	'<br> DIRECTION: ' + marker_xml.getAttribute("dir")
    ;
    
    var infowindow = new google.maps.InfoWindow()
    
    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow, name){
	return function() {
	    infowindow.setContent(content);
	    infowindow.open(map_global,marker);
	    document.getElementById("points_location").innerHTML="";
	    document.getElementById("wiki").innerHTML ="<iframe id='wiki' src='http://en.m.wikipedia.org/w/index.php?search=" +name+"'></iframe>";
	};
    })(marker,content,infowindow, name));

    //add the point to the gloabal array
    marker_arr.push(marker);
}

function deleteMarkers() {
    for(var i=0;i<marker_arr.length;i++)
	marker_arr[i].setMap(null);
    marker_arr=[];
}


/*
  TODO: generate a file for output. For now,
  just print the points that have been displayed
  out to the console.
*/
function printPoints() {
    scopeSetup(1);
    document.getElementById("wiki").innerHTML="";
    for(var i=0;i<marker_arr.length;i++) {
	document.getElementById("wiki").innerHTML = "";
	document.getElementById("points_location").innerHTML +="<p>"+ marker_arr[i].getTitle()+" "+marker_arr[i].getPosition()+"<\p>";
    }
}


function filter_aux() {

    var filter_types=document.getElementsByName('filtertype');
    var minLat=document.getElementsByName('minLat');
    var maxLat=document.getElementsByName('maxLat');
    var minLon=document.getElementsByName('minLon');
    var maxLon=document.getElementsByName('maxLon');
    var radius=document.getElementsByName('radius');

    var i=0;
    while(i<3) {
	if(filter_types[i].checked)
	    break;
	i++;
    }

    switch(i) {
    case 0:
	filterRequest(
	    {
		type: "2",
		LON: {"0":minLon[0].value+" "+maxLon[0].value,},
		LAT: {"0":minLat[0].value+" "+maxLat[0].value,}
	    }
	);
	break;
    case 1:
	filterRequest(
	    {
		type : "1",
		LON : maxLon[1].value,
		LAT : maxLat[1].value,
		DIS : radius[0].value
	    }
	);
	break;
    case 2:
	filterRequest(
	    {
		type: "2",
		LON: {"0":"0 360"},
		LAT: {"0":"-90 90"}
	    }
	);
    }
}

/*
  The filterRequest function jakes a JS object using the AND/OR filter method
  designed by Sunny. It will apply that filter to the map.
*/
function filterRequest(object) {
var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://107.170.221.211/ct_workspace/Aerospace130/php_filter/data.php"); //TODO: don't hard code this URL. for some reason php wasn't working when I worked out of my home directory on the server
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            var xml=xmlhttp.responseXML;
	    deleteMarkers();
	    var markers = xml.documentElement.getElementsByTagName("marker");
	    for (var i = 0; i < markers.length; i++) {
		addMarker(markers[i]);
	    }
        }
    };

    xmlhttp.send(JSON.stringify(object));
}


/*
  Clear all the printed points and wikipedia from screen.
*/
function clearScreen() {
	    document.getElementById("points_location").innerHTML="";
	    document.getElementById("wiki").innerHTML ="<p>Press on a satellite marker on the right for more information!</p>";
}
