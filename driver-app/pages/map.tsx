/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingScreen } from "@/components/LoadingScreen";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  bookingAtom,
  driverAtom,
  locationAtom,
  routesAtom,
  screenAtom,
  taxiAtom,
} from "@/state";
import Styles from "@/public/resources/maps.json";
import AddMarker from "@/utils/addMarker";
import { BackButton } from "@/components/BackButton";
import SetDirections from "@/utils/computeDirections";
import { rescaleMap } from "@/utils/rescaleMap";
import { StartTrip } from "@/components/StartTrip";
import { Trip } from "@/components/Trip";

export const markers: any = {
  taxiLocation: null,
  pickup: null,
  dropoff: null,
};

const libraries = ["places", "geometry"];
export let pickupRoute: any;
export let dropRoute: any;

export default function Map() {
  // States
  const [driver, setDriver] = useRecoilState(driverAtom);
  const [taxi, setTaxi] = useRecoilState(taxiAtom);
  const booking = useRecoilValue(bookingAtom);
  const [location, setLocationEvent] = useRecoilState(locationAtom);
  const [screen, setScreen] = useRecoilState(screenAtom);
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useRecoilState(routesAtom);

  // On map load... set location to current location
  const loadMap = useCallback(function callback(map: google.maps.Map) {
    setMapRef(map);
    navigator.geolocation.getCurrentPosition((position) => {
      const taxiLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );

      markers.taxiLocation = AddMarker(
        map,
        taxiLocation,
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

      map.panTo(taxiLocation);
      map.setZoom(18);

      setIsLoading(false);
    });
  }, []);

  // Retrieving cached states
  useEffect(() => {
    if (!driver.driverID) {
      setDriver(JSON.parse(localStorage.getItem("driver") as string));
    }
    if (!taxi.tmdtid) {
      setTaxi(JSON.parse(localStorage.getItem("taxi") as string));
    }

    return () => {
      setRoutes({ pickup: null, dropoff: null });
      setMapRef(undefined);
    };
  }, []);

  const createRoute = (type: string, polyline: any) => {
    setRoutes((routes: any) => ({
      ...routes,
      [type]: polyline.routes[0].overview_path,
    }));
  };

  useEffect(() => {
    if (routes.dropoff && routes.pickup && mapRef) {
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

      rescaleMap(mapRef as google.maps.Map, routes.dropoff);
    }
  }, [routes]);

  // On receiving a new booking request...
  useEffect(() => {
    console.log("Booking useEffect");
    if (isLoading) return;
    if (booking.pickUpLocation) setScreen("start");
  }, [booking, isLoading]);

  useEffect(() => {
    if (screen === "start") {
      const start = new google.maps.LatLng({
        lat: location.currentPosition.lat as number,
        lng: location.currentPosition.lng as number,
      });

      const pickup = new google.maps.LatLng({
        lat: booking.pickUpLocation.lat as number,
        lng: booking.pickUpLocation.lng as number,
      });

      const dropoff = new google.maps.LatLng({
        lat: booking.dropLocation.lat as number,
        lng: booking.dropLocation.lng as number,
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
    } else if (screen === "pickup") {
      rescaleMap(mapRef as google.maps.Map, routes.pickup!);
    } else if (screen === "dropoff") {
      rescaleMap(mapRef as google.maps.Map, routes.dropoff!);
    }
  }, [screen]);

  // On approving a new booking request...
  // useEffect(() => {

  // }, [dispatch]);

  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
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
          <StartTrip />
        ) : screen === "pickup" ? (
          <Trip type="pickup" />
        ) : screen === "dropoff" ? (
          <Trip type="dropoff" />
        ) : (
          "Error: Screen not found"
        )}

        <BackButton />
      </div>
    </LoadScriptNext>
  );
}
