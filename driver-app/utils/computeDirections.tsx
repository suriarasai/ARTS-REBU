import AddMarker from "@/utils/AddMarker";
import { DispatchEvent, LocationEvent } from "@/types";
import { routes, markers } from "../pages/map";

export function computeDirections(
  map: google.maps.Map,
  location: LocationEvent,
  dispatch: DispatchEvent
) {
  const start = new google.maps.LatLng(location.currentPosition);

  const pickup = new google.maps.LatLng(
    dispatch.pickUpLocation.lat as number,
    dispatch.pickUpLocation.lng as number
  );

  const dropoff = new google.maps.LatLng(
    dispatch.dropLocation.lat as number,
    dispatch.dropLocation.lng as number
  );

  setDirections(map, routes.dropoff, pickup, dropoff, "#bbf7d0");
  setDirections(map, routes.pickup, start, pickup, "#4ade80");

  markers.pickup = AddMarker(
    map,
    pickup,
    "https://www.svgrepo.com/show/375861/pin2.svg"
  );
  markers.dropoff = AddMarker(
    map,
    dropoff,
    "https://www.svgrepo.com/show/375810/flag.svg"
  );
}
function setDirections(
  map: google.maps.Map,
  route: google.maps.Polyline,
  start: google.maps.LatLng,
  end: google.maps.LatLng,
  color: string
) {
  const directionsService = new google.maps.DirectionsService();

  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    function (result: any, status) {
      if (status == "OK") {
        route = new google.maps.Polyline({
          path: result.routes[0].overview_path,
          strokeColor: color,
          strokeOpacity: 1,
          strokeWeight: 4,
          geodesic: true,
        });
        route.setMap(map);
      } else {
        console.log("Error: Taxi directions API failed");
      }
    }
  );
}
