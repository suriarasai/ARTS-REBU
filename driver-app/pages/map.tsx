/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingScreen } from "@/components/LoadingScreen";
import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  bookingAtom,
  dispatchAtom,
  driverAtom,
  locationAtom,
  routesAtom,
  screenAtom,
  taxiAtom,
} from "@/state";
import Styles from "@/public/resources/maps.json";
import AddMarker from "@/utils/AddMarker";
import { BackButton } from "@/components/BackButton";
import SetDirections from "../utils/computeDirections";

export const markers: any = {
  initialLocation: null,
  taxiLocation: null,
  customerLocation: null,
  destinationLocation: null,
};

const libraries = ["places", "geometry"];
let pickupRoute: any;
let dropRoute: any;

export default function Map() {
  // States
  const driver = useRecoilValue(driverAtom);
  const taxi = useRecoilValue(taxiAtom);
  const booking = useRecoilValue(bookingAtom);
  const [dispatch, setDispatchEvent] = useRecoilState(dispatchAtom);
  const [location, setLocationEvent] = useRecoilState(locationAtom);
  const [screen, setScreen] = useRecoilState(screenAtom);
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useRecoilState(routesAtom);

  // On map load... set location to current location
  const loadMap = useCallback(function callback(map: google.maps.Map) {
    setMapRef(map);
    navigator.geolocation.getCurrentPosition((position) => {
      const initialLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );

      markers.initialLocation = AddMarker(
        map,
        initialLocation,
        "https://www.svgrepo.com/show/375911/taxi.svg"
      );

      setLocationEvent({
        tmdtid: taxi.tmdtid,
        driverID: driver.driverID,
        taxiNumber: taxi.taxiNumber,
        currentPosition: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        availabilityStatus: true,
      });

      map.panTo(initialLocation);
      map.setZoom(18);

      setIsLoading(false);
    });
  }, []);

  const createRoute = (type: string, polyline: any) => {
    setRoutes((routes) => ({
      ...routes,
      [type]: polyline.routes[0].overview_path,
    }));
  };

  useEffect(() => {
    if (routes.dropoff && routes.pickup) {
      dropRoute = new google.maps.Polyline({
        path: routes.dropoff,
        strokeColor: "#bbf7d0",
        strokeOpacity: 1.0,
        strokeWeight: 4.0,
      });
      dropRoute.setMap(mapRef);

      pickupRoute = new google.maps.Polyline({
        path: routes.pickup,
        strokeColor: "#16a34a",
        strokeOpacity: 1.0,
        strokeWeight: 4.0,
      });
      pickupRoute.setMap(mapRef);
    }
  }, [routes]);

  // On receiving a new booking request...
  useEffect(() => {
    if (isLoading) return;

    console.log("Booking useEffect");
    setDispatchEvent({
      ...dispatch,
      pickUpLocation: {
        lat: 1.297761,
        lng: 103.772688,
      },
      dropLocation: {
        lat: 1.304604,
        lng: 103.768289,
      },
      customerName: "Water bottle",
      customerPhoneNumber: 12345678,
    });
    setScreen("start");
  }, [booking, isLoading]);

  useEffect(() => {
    if (screen === "start") {
      const start = new google.maps.LatLng({
        lat: location.currentPosition.lat as number,
        lng: location.currentPosition.lng as number,
      });

      const pickup = new google.maps.LatLng({
        lat: dispatch.pickUpLocation.lat as number,
        lng: dispatch.pickUpLocation.lng as number,
      });

      const dropoff = new google.maps.LatLng({
        lat: dispatch.dropLocation.lat as number,
        lng: dispatch.dropLocation.lng as number,
      });

      SetDirections(start, pickup, createRoute, "pickup");
      SetDirections(pickup, dropoff, createRoute, "dropoff");

      markers.pickup = AddMarker(
        mapRef as google.maps.Map,
        pickup,
        "https://www.svgrepo.com/show/375861/pin2.svg"
      );
      markers.dropoff = AddMarker(
        mapRef as google.maps.Map,
        dropoff,
        "https://www.svgrepo.com/show/375810/flag.svg"
      );
    }
  }, [screen]);

  // On approving a new booking request...
  // useEffect(() => {

  // }, [dispatch]);

  return (
    <>
      <main>
        <LoadScriptNext
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
          loadingElement={<LoadingScreen />}
          libraries={libraries as any}
        >
          <div className="relative h-screen w-screen">
            <GoogleMap
              zoom={15}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                minZoom: 3,
                styles: Styles,
              }}
              onLoad={loadMap}
            />

            {screen === "" ? null : screen === "start" ? (
              <StartTripUI map={mapRef as google.maps.Map} />
            ) : screen === "pickup" ? (
              <PickUpUI />
            ) : screen === "dropoff" ? (
              <DropOffUI />
            ) : (
              "Error: Screen not found"
            )}

            <BackButton />
          </div>
        </LoadScriptNext>
      </main>
    </>
  );
}

const StartTripUI = ({ map }: { map: google.maps.Map }) => {
  const [, setScreen] = useRecoilState(screenAtom);

  const startTrip = () => setScreen("pickup");

  return (
    <div className="absolute bottom-0 w-3/4 left-0 right-0 justify-center mr-auto ml-auto mb-4 shadow-md p-4 bg-zinc-700 rounded-lg">
      <label className="w-full !mb-3">Ready to go?</label>
      <button
        className="bg-green-400 flex justify-center py-2 text-white w-full rounded-md"
        onClick={startTrip}
      >
        Begin Route
      </button>
    </div>
  );
};

// Marker disappearing... is it because it's not a state var...
function moveTaxiMarker(
  marker: google.maps.Marker,
  polyline: any,
  iter: number,
  timer: number,
  stepsPerMinute = 1000,
  _callback: Function
) {
  if (polyline.length - 1 >= iter) {
    marker.setPosition(new google.maps.LatLng(
      polyline[iter].lat as number,
      polyline[iter].lng as number
    ));

    window.setTimeout(function () {
      moveTaxiMarker(
        marker,
        polyline,
        iter + 1,
        timer,
        stepsPerMinute,
        _callback
      );
    }, timer);
  } else {
    // the taxi has 'arrived'
    _callback();
  }
}

const PickUpUI = () => {
  const routes = useRecoilValue(routesAtom);
  // UI: Button to confirm
  // Taxi Movement
  // Erase Marker
  // console.log("polyline", (routes.dropoff as any).routes[0].overview_path);
  // console.log(routes.pickup)
  moveTaxiMarker(markers.initialLocation, routes.pickup!, 0, 1000, 60, () => {});
  const confirmPickup = () => {
    // console.log(routes);
    console.log(markers.initialLocation.getPosition().lat(), markers.initialLocation.getPosition().lng())
  };

  return (
    <div className="absolute bottom-0 w-3/4 left-0 right-0 justify-center mr-auto ml-auto mb-4 shadow-md p-4 bg-zinc-700 rounded-lg">
      <label className="w-full !mb-3">En route to pickup location</label>
      <button
        className="bg-green-400 flex justify-center py-2 text-white w-full rounded-md"
        onClick={confirmPickup}
      >
        Confirm Pickup
      </button>
    </div>
  );
};

const DropOffUI = () => {
  // UI: Button to confirm
  // Reset Markers
  return null;
};
