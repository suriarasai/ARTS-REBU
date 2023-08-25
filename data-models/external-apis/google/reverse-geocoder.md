Documentation: https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
Example: https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse

```js
fetch(
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat()},${coordinates.lng()}&key=${
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  }`
)
  .then((response) => response.json())
  .then((data) => {
    const extractedAddress = data.results[0];
  });
```

- Note: This is the old way of doing it - refer to the documentation for the new method. Output is the same
