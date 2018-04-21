const MapWrapper = function(container, center, zoom) {
  this.googleMap = new google.maps.Map(container, {
    center: center,
    zoom: zoom
  });
};

MapWrapper.prototype.addMarker = function (coOrds) {
  const marker = new google.maps.Marker({
    map: this.googleMap,
    position: coOrds
  });
};

  MapWrapper.prototype.setCenter = function (coOrds) {
    this.googleMap.setCenter(coOrds);
  };
