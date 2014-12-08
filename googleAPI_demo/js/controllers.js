var consoleControllers = angular.module('consoleControllers', []);
consoleControllers.controller('mainpanelCtrl', ['$scope',
    function($scope) {}
]);
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

	nite.init(map);
	
	$scope.downloadUrl= function(url,poststring,callback){
            var request = window.ActiveXObject ?
                new ActiveXObject('Microsoft.XMLHTTP') :
                new XMLHttpRequest;

            request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    request.onreadystatechange = $scope.doNothing;
                    callback(request, request.status);
                }
            };
	    
            request.open('POST', url, true);
            request.send(poststring);
        }


	$scope.downloadUrl("http://107.170.221.211/ct_workspace/Aerospace130/generate_mark_xml.php", null, function(data) {
            var xml = data.responseXML;
            var markers = xml.documentElement.getElementsByTagName("marker");
			var userlocation = xml.documentElement.getElementsByTagName("location");
            for (var i = 0; i < markers.length; i++) {
				var point = new google.maps.LatLng(
					parseFloat(markers[i].getAttribute("lat")),
					parseFloat(markers[i].getAttribute("lon")));
				var marker = new google.maps.Marker({
					map: map,
					position: point,
					icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png'
				});
				var content = '<b>' + markers[i].getAttribute("name") + '</b>' + 
							'<br> NORAD ID: ' + markers[i].getAttribute("id") + 
							'<br> LAT: ' + markers[i].getAttribute("lat") + 
							'<br> LON: ' + markers[i].getAttribute("lon") +
							'<br> DIRECTION: ' + markers[i].getAttribute("dir")
							;
				var name = markers[i].getAttribute("name");

				var infowindow = new google.maps.InfoWindow()

				google.maps.event.addListener(marker,'click', (function(marker,content,infowindow, name){
					return function() {
						infowindow.setContent(content);
						infowindow.open(map,marker);
						document.getElementById('wiki').src = "http://en.m.wikipedia.org/w/index.php?search=" + name;
					};
				})(marker,content,infowindow, name));  
            }
			if (userlocation != null){
				console.log(userlocation[0].getAttribute("lat"));
				console.log(userlocation[0].getAttribute("lon"));
				var point = new google.maps.LatLng(
						parseFloat(userlocation[0].getAttribute("lat")),
						parseFloat(userlocation[0].getAttribute("lon")));
				map.setCenter(point);
			}
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
    for (var i = 0; i < 1; i++) {
        document.getElementById('utilities_' + i).style.backgroundColor = (i == index ? '#cccccc' : '');
    }
}
