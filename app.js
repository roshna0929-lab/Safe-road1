let map, userMarker, directionsService, directionsRenderer;

navigator.geolocation.getCurrentPosition(pos=>{
  let loc = {lat: pos.coords.latitude, lng: pos.coords.longitude};
  map = new google.maps.Map(document.getElementById("map"), {
    center: loc, zoom: 14
  });

  userMarker = new google.maps.Marker({
    position: loc,
    map: map,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({map});

  loadDangerRoads();
});

function getRoute(){
  directionsService.route({
    origin: from.value || userMarker.getPosition(),
    destination: to.value,
    travelMode: "DRIVING"
  }, res=>{
    directionsRenderer.setDirections(res);
  });
}

function loadDangerRoads(){
  let roads = JSON.parse(localStorage.getItem("roads") || "[]");
  roads.forEach(r=>{
    let path = r.coords.split("|").map(c=>{
      let p=c.split(",");
      return {lat:parseFloat(p[0]), lng:parseFloat(p[1])};
    });

    new google.maps.Polyline({
      path, map,
      strokeColor:"red",
      strokeWeight:5
    });
  });
}

function findPlaces(type){
  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location:userMarker.getPosition(),
    radius:2000,
    type:[type]
  }, res=>{
    res.forEach(p=>{
      new google.maps.Marker({map, position:p.geometry.location});
    });
  });
}

function callPolice(){
  window.location.href="tel:100";
}
