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
        var myLatlng = new google.maps.LatLng(-34.397, 150.644);
        var mapOptions = {
            zoom: 8,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = new google.maps.LatLng(
                    position.coords.latitude, position.coords.longitude);
                map.setCenter(geolocation);
                autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
                    geolocation));
            });
        }

	
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
            for (var i = 0; i < markers.length; i++) {
                console.log(markers[i].getAttribute("lat"));
                console.log(markers[i].getAttribute("lon"));
                var point = new google.maps.LatLng(
                    parseFloat(markers[i].getAttribute("lat")),
                    parseFloat(markers[i].getAttribute("lon")));
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png'
                });
            }
        });



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
