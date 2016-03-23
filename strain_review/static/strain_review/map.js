var loc = [];
var strainloc = [];
// initialize everything
function initialize() {

  // custom map type, change map style to something softer
  var customMapType = new google.maps.StyledMapType(
  // custom map light dream from snazzy maps
  [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}],
     {
      name: 'Custom Style'

  });

  var customMapTypeId = 'custom_style';
  var myOptions = {
    zoom: 10,

    mapTypeControlOptions: {
        mapTypeIds: [ google.maps.MapTypeId.ROADMAP, customMapTypeId ],
        position:google.maps.ControlPosition.BOTTOM_CENTER
    },
  };



  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);

  var geocoder = new google.maps.Geocoder();
  var infowindow = new google.maps.InfoWindow({
    maxWidth: 150
  });



// initialize on user location with W3C geolocation
  document.getElementById('plotIt').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });


  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.


  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
      // place marker on user location upon initialization
      var marker = new google.maps.Marker({
        position: initialLocation,
        title: 'Your Location',
        map: map
      });

      google.maps.event.addDomListener(window, 'load', initialize)
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }


function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }

  // geocoding function for user to change location
function geocodeAddress(geocoder, resultsMap) {
  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById('hotdog').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      loc[0]=results[0].geometry.location.lat();
      loc[1]=results[0].geometry.location.lng();

      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};


 // get data from API via AJAX request
  $(document).ready(function() {
    $('#sendIt').on('click', function(event){
      event.preventDefault();
      var userChoice = $('#hotdog').val();
      var strainGame;

    // make an ajax call to get strains objects
    $.ajax({
      url: 'https://www.cannabisreports.com/api/v1.0/strains/search/' + userChoice,
      method: 'GET',
      data: {
        key: 'fd6b7cc1c345cdfe7605da9d46a1d5f3dfc614aa'
      },

      dataType: 'jsonp',

      })


      .fail(function(err){
        if (err) throw err;
      })

      .done(function(data){
      var query = data;
      strainGame = query.data[0].ucpc;

      $.ajax({
      url: 'https://www.cannabisreports.com/api/v1.0/strains/'+strainGame+'/availability/geo/'+loc[0]+'/'+loc[1]+'/25',
      method: 'GET',
      data : {
        key: 'fd6b7cc1c345cdfe7605da9d46a1d5f3dfc614aa'
      },
      dataType: 'jsonp',
    })

    .fail(function(err){
        if (err) throw err;
    })

    .done(function(data){
        for (i=0; i < data.data.length; i++){
            strainloc.push(data.data[i].location);
          };

        function dropMarker(loc) {
          var image = "http://marijuanapolitics.com/wp-content/uploads/leaflet-maps-marker-icons/marijuana.png";
          var latlng = new google.maps.LatLng(loc.lat, loc.lng);
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: image
          });
          google.maps.event.addListener(marker, 'click', function(){
            infowindow.close(); // Close previously opened infowindow
            infowindow.setContent( "<div id='infowindow'>" + "</div>");
            infowindow.open(map, marker);
            $.ajax({
              url: loc['link'],
              method: 'GET',
              data: {
                key: 'fd6b7cc1c345cdfe7605da9d46a1d5f3dfc614aa'
              },
              dataType: 'jsonp'
            })

            .fail(function(err){
              if (err) throw err;
            })
            .done(function(data){
              $("#infowindow").append('<h3><a href="' + data.data.url + '" target="_blank">' + loc['name'] +
              "</a></h3>" + "<p>" + data.data["city"] + "," + data.data["state"] + "<br>" +
              data.data.address["address1"] + "<br>" +data.data.address["zip"] + "</p>");
            });
          });
        } // end of dropMarker

        for (i = 0; i < strainloc.length; i++) {
          dropMarker(strainloc[i]);
        };
      }) // end of .done function
    })
    })
  });
};
