//_ Comments

function loadScript(src) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
  script.src = src;
}

loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBg0y5B69OtpzAkFAvlR8emxwdhQWjdw40&callback=initMap');

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 47.2221, lng: 8.3156}
  });

  var icons = {
    "hydro": {
      url: 'hydro.png',
      scaledSize: new google.maps.Size(25, 25)
    },
    "nuclear": {
      url: 'nuclear.png',
      scaledSize: new google.maps.Size(25, 25)
    },
    "wind": {
      url: 'wind.png',
      scaledSize: new google.maps.Size(25, 25)
    },
    "solar": {
      url: 'solar.png',
      scaledSize: new google.maps.Size(20, 20)
    }
  };

  var markers = [];

  for (var i = 0; i < alldata.length; i++) {
    if ((Number(alldata[i]["power_output_kw"]) < 60) && (alldata[i]["type"] == "hydro")) {
      continue;
    }
    var marker = new google.maps.Marker({
      position: {lat: Number(alldata[i]["latitude"]), lng: Number(alldata[i]["longitude"])},
      icon: icons[alldata[i]["type"]],
      type: alldata[i]["type"],
      map: map,
      name: alldata[i]["name"],
      power: alldata[i]["power_output_kw"]
    });
    markers.push(marker);
  };

  for (var i = 0; i < markers.length; i++) {
    google.maps.event.addListener(markers[i], 'click', function(event) {
      $("#side-info").empty();
      $("#close").removeClass('hidden');
      $("#side-info").append("<p class='bold'> " + this.name + "</p>");
      $("#side-info").append("<p>" + this.type + "</p>");
      $("#side-info").append("<img src='" + this.icon.url + "'></img>");

      $("#side-info").append("<p>Power output: " + this.power + "</p>");
      console.log(i, i%2);
      if ( this.type == "hydro") {
	$("#side-info").append("<img class='historical' src='chart.png'></img>");
      } else {
	$("#side-info").append("<img class='historical' src='chart2.png'></img>");
      }
      
      document.getElementById('map').style.width = "80%";
    });
  };


//_ Google Map
var styledMapType = new google.maps.StyledMapType(
  [
    {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{color: '#c9b2a6'}]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{color: '#dcd2be'}]
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#053914'}]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{color: '#ae9e90'}]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#93817c'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{color: '#a5b076'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#447530'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#f5f1e6'}]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{color: '#fdfcf8'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#f8c967'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#e9bc62'}]
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{color: '#e98d58'}]
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [{color: '#db8555'}]
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry.stroke',
      stylers: [{visibility: 'show'}]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{color: '#806b63'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [{color: '#8f7d77'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#ebe3cd'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{color: '#b9d3c2'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#92998d'}]
    }
  ],
  {name: 'Styled Map'});

  // map.mapTypes.set('styled_map', styledMapType);
  // map.setMapTypeId('styled_map');
}

//_ Main
$(document).ready(function () {
  $('#close').click(function() {
    $("#close").addClass('hidden');
    document.getElementById('map').style.width = "100%";
  });

  $('#plus').click(function() {
    $('#form').removeClass('hidden');
  });

  $('#contact-submit').click(function() {
    $('#contact').reset();
    $('#form').addClass('hidden');
  });

  
});

//_ Emacs vars
// Local Variables:
// mode: javascript
// allout-layout: (0 :)
// eval: (allout-mode)
// End:
