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
    center: {lat: 46.834427, lng: 8.424753}
  });

  map.data.addGeoJson(ch_cantons);
}
