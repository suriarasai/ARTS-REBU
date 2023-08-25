Documentation: https://developers.google.com/maps/documentation/routes/compute_route_directions
Example: https://developers.google.com/maps/documentation/routes/demo

# Computing the route:

```js
axios
  .post(
    `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    {
      origin: {
        location: {
          latLng: {
            latitude: origin.lat,
            longitude: origin.lng,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.lat,
            longitude: destination.lng,
          },
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      extraComputations: ["TRAFFIC_ON_POLYLINE"],
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },
      languageCode: "en-US",
      units: "IMPERIAL",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "routes.duration,routes.distanceMeters,routes.polyline,routes.legs.polyline,routes.travelAdvisory,routes.legs.travelAdvisory",
      },
    }
  )
  .then((response) => {
    callback(response.data.routes[0]);
  });
```

# Rendering the Route

```js
const renderDirections = async (map, encodedPath, setPolyline) => {
  const path = google.maps.geometry.encoding.decodePath(
    encodedPath.polyline.encodedPolyline
  );

  const intervals = encodedPath.travelAdvisory.speedReadingIntervals;
  let routePolyline: google.maps.Polyline[] = [];

  intervals.map((segment) => {
    const segmentPolyline = new google.maps.Polyline({
      path: path.slice(
        segment.startPolylinePointIndex,
        segment.endPolylinePointIndex + 1
      ),
      strokeColor: polylineTrafficColors[segment.speed],
      strokeOpacity: 1,
      strokeWeight: 6,
    });
    segmentPolyline.setMap(map);
    routePolyline.push(segmentPolyline);
  });

  setPolyline(routePolyline);
};
```

* To show/hide the polyline (`google.maps.Polyline[]`), iterate through each sub-polyline and set the map to null