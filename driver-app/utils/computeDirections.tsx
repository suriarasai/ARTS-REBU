export default function SetDirections(
  start: google.maps.LatLng,
  end: google.maps.LatLng,
  createRoute: Function,
  type: string
) {
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    function (result, status) {
      if (status == "OK") {
        createRoute(type, result);
      }
    }
  );
  return null;
}
