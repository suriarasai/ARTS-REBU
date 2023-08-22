Documentation: https://developers.google.com/maps/documentation/directions/overview

```js
const directionsService = new google.maps.DirectionsService();
directionsService.route(
  {
    origin: new google.maps.LatLng(origin.lat, origin.lng),
    destination: new google.maps.LatLng(dest.lat, dest.lng),
    travelMode: google.maps.TravelMode.DRIVING,
  },
  function (result, status) {
    if (status == "OK") {
      taxiRoute = new google.maps.Polyline({
        path: result.routes[0].overview_path,
        strokeColor: "#16a34a",
        strokeOpacity: 1,
        strokeWeight: 4,
      });
      taxiRoute.setMap(map);
      const tripDuration = Math.round(
        result.routes[0].legs[0].duration.value / 60
      );
    }
  }
);
```

- Note: Google has 2 route calculation APIs: `directions` and `routes`. Routes does route optimization and is traffic aware (as well as more expensive) while `directions` is the legacy version.
