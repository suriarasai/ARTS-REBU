Documentation: https://developers.google.com/maps/documentation/javascript/shapes#polylines 
Examples: https://developers.google.com/maps/documentation/javascript/examples/polyline-simple 

# Initialization

```js
const polyline = new google.maps.Polyline({
  path: result.routes[0].overview_path,
  map: map,
  strokeColor: "#16a34a",
  strokeOpacity: 1,
  strokeWeight: 4,
});
```
* Path, `google.maps.LatLng[]`, is returned from the `DirectionsService()` API
* `map` is the variable that stores the map reference


# Toggling

```js
polyline.setMap(map)  // Showing
polyline.setMap(null)  // Hiding
```