//_ Comments

function loadScript(src) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
  script.src = src;
}

loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBg0y5B69OtpzAkFAvlR8emxwdhQWjdw40&callback=initMap');

//var min_cons = 0.053513;
//var max_cons = 1.385856;
var min_cons = 0;
var max_cons = 0.5;

var pos = 0;

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

var map;
var timer = null;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 46.834427, lng: 8.424753}
  });

  map.data.addGeoJson(ch_cantons);

  // set the color from the first value of the json
  timerTick();
}

function timerTick() {
  curr_values = energy_usage[pos];
  
    document.getElementById("timer").innerHTML = curr_values.datetime;
  
    map.data.setStyle(function(feature) {
      var cons = curr_values[feature.getProperty('code')];
      var opacity = (cons - min_cons) / (max_cons - min_cons) * 2 - 1;
      if (opacity > 0) {
        return {
          fillColor: 'red',
          fillOpacity: Math.min(opacity, 1)
        };  
      } else {
        return {
          fillColor: 'green',
          fillOpacity: Math.min(-opacity, 1)
        };
      }
    });
    pos++;
}

//_ Main
$(document).ready(function () {
  $('#plus').click(function() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      pos = 0;
    } else {
      timer = setInterval(timerTick, 100);
    }
  });
});
