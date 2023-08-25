Reference: https://beta.data.gov.sg/datasets/352/view
Alternate Link: https://data.gov.sg/dataset/taxi-availability

# Sample API Calls (GET)

**For Postman**

For a specified timestamp
https://api.data.gov.sg/v1/transport/taxi-availability?date_time=2023-08-13T12:32:24

Without a timestamp (defaults to current datetime)
https://api.data.gov.sg/v1/transport/taxi-availability


**From Frontend**

```js
fetch("https://api.data.gov.sg/v1/transport/taxi-availability")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const coordinates = data.features[0].geometry.coordinates;
  });
```

**From Backend**

```java
String uri = "https://api.data.gov.sg/v1/transport/taxi-availability";
RestTemplate restTemplate = new RestTemplate();
String result = restTemplate.getForObject(uri, String.class);

// Parsing the response as an object and extracting the taxi locations
Gson gson = new Gson();
GeoJson obj = gson.fromJson(result, GeoJson.class);
List<List<Float>> taxis = obj.getFeatures().get(0).getGeometry().getCoordinates();
```
