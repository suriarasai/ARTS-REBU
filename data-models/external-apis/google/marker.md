Documentation: https://developers.google.com/maps/documentation/javascript/markers
Infowindows: https://developers.google.com/maps/documentation/javascript/infowindows 

# Initialization

```js
const newTaxi = new google.maps.Marker({
  map: map,
  title: "Marker Title",
  position: { lat: coordinate.lat, lng: coordinate.lng },
  icon: {
    url: "https://www.svgrepo.com/show/375911/taxi.svg",
    scaledSize: new google.maps.Size(30, 30),
  },
});

```

- `map` is the variable that stores the map reference
- `position` is a google.maps.latLng object
- `icon` and `title` are optional fields


# Toggling

```js
newTaxi.setMap(null) // Hide
newTaxi.setMap(map) // Show

```


# Adding a Infowindow

```js
const infoWindow = new google.maps.InfoWindow();
marker.addListener("click", () => {
  infoWindow.close();  // close all other InfoWindows
  infoWindow.setContent(marker.getTitle());
  infoWindow.open(marker.getMap(), marker);
});

```
