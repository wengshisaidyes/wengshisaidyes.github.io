mapboxgl.accessToken = 'pk.eyJ1IjoiZHJheXJzIiwiYSI6ImNrM3FjazBpejAwOTQzam51aGR1YXVnN3IifQ.8qNcA8Pofrg1Ud_bSl9Hmg';

var map = new mapboxgl.Map({
  container: 'nwi-map',
  style: 'mapbox://styles/drayrs/ck58qmky20y1t1cnwat40g5y2',
  center: [-78.887, 44.139],
  zoom: 8,
  scrollZoom: false,
  boxZoom: true,
  dragPan: false
});

map.addControl(new mapboxgl.NavigationControl());

//https://github.com/mapbox/mapbox-gl-js/issues/2618
    let clickFunc = function (e) {
        map.dragPan.enable();
        map.off('click', clickFunc);
    };

    let zoomFunc = function (e) {
        if (e.source !== 'fitBounds') {
            map.dragPan.enable();
            map.off('zoomend', zoomFunc);
        }
    };

map.on('click', clickFunc);
map.on('zoomend', zoomFunc);

var geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-78.832098, 44.130857]
    },
    properties: {
      link: 'wedding',
      title: 'Nestleton Waters Inn',
      street: '3440 Beacock Road',
      town: 'Nestleton Station',
      province: 'Ontario'
    }
    },{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-78.692327, 43.896437]
    },
    properties: {
        link: 'rooms',
        title: 'Comfort Inn & Suites',
        street: '35 Spicer Square',
        town: 'Bowmanville',
        province: 'Ontario'
    }
    }]
};

function buildLocationList(data) {
  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    var prop = currentFeature.properties;

    // Add nav buttons to map
    var locations = document.getElementById('nwi-map-nav');
    var location = locations.appendChild(document.createElement('div'));
    location.className = 'map-link';
    location.id = 'link-' + prop.link;
    location.innerHTML = '<h3>' + prop.link + '</h3><p><em>' + currentFeature.properties.title + '</em></p>' +
    '<p>' + currentFeature.properties.street + '</p>' +
    '<p>' + currentFeature.properties.town + ', ' + currentFeature.properties.province + '</p>';
    location.dataPosition = i;

    location.addEventListener('click', function(e) {
      var clickedListing = data.features[this.dataPosition];
      flyToLocation(clickedListing);
      //createPopUp(clickedListing);
      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.classList.add('active');
    });

  }
}

function flyToLocation(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<p><em>' + currentFeature.properties.title + '</em></p>' +
    '<p>' + currentFeature.properties.street + '</p>' +
    '<p>' + currentFeature.properties.town + ', ' + currentFeature.properties.province + '</p>')
    .addTo(map);
}

geojson.features.forEach(function(marker) {

    var el = document.createElement('div');
    el.className = 'marker';

    el.addEventListener('click', function(e) {
        var activeItem = document.getElementsByClassName('active');
        flyToLocation(marker);
        //createPopUp(marker);
        e.stopPropagation();
        if (activeItem[0]) {
            activeItem[0].classList.remove('active');
        }
        var listing = document.getElementById('link-' + marker.properties.link);
        listing.classList.add('active');
        console.log(listing);
    });

    new mapboxgl.Marker(el, {offset: [0, -23]})
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
});

map.on('load', function(e) {
    buildLocationList(geojson);
});
