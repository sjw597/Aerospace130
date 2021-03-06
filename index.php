<html>
    <head>
        <style type="text/css">
            html, body, #map-canvas { height: 100%; margin: 0px; padding: 20px;}
        </style>

        <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDXkzKanWb-2ZL379LTw0tVvMTpnElNajM">
        </script>

        <script type="text/javascript">
            function downloadUrl(url,callback) {
                var request = window.ActiveXObject ?
                    new ActiveXObject('Microsoft.XMLHTTP') :
                    new XMLHttpRequest;

                request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                        request.onreadystatechange = doNothing;
                        callback(request, request.status);
                    }
                };

                request.open('GET', url, true);
                request.send(null);
            }
            
            function doNothing() {}

            function initialize() {
                var mapOptions = {
                    center: { lat: -34.397, lng: 150.644},
                    zoom: 2
                };
                var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                
                downloadUrl("generate_mark_xml.php", function(data) {
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
            }
            google.maps.event.addDomListener(window, 'load', initialize);
        </script>
    </head>

    <body>
        <div id="map-canvas"></div>
    </body>
</html>