/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingScreen } from "@/components/LoadingScreen";
import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  bookingAtom,
  dispatchAtom,
  driverAtom,
  locationAtom,
  screenAtom,
  taxiAtom,
} from "@/state";
import Styles from "@/public/resources/maps.json";
import AddMarker from "@/utils/AddMarker";
import { BackButton } from "@/components/BackButton";

const markers: any = {
  initialLocation: null,
  taxiLocation: null,
  customerLocation: null,
  destinationLocation: null,
};

export default function Map() {
  // States
  const driver = useRecoilValue(driverAtom);
  const taxi = useRecoilValue(taxiAtom);
  const booking = useRecoilValue(bookingAtom);
  const [dispatch, setDispatchEvent] = useRecoilState(dispatchAtom);
  const [locationEvent, setLocationEvent] = useRecoilState(locationAtom);
  const [screen, setScreen] = useRecoilState(screenAtom);

  // On map load... set location to current location
  const loadMap = useCallback(function callback(map: google.maps.Map) {
    navigator.geolocation.getCurrentPosition((position) => {
      const initialLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

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
          lat: initialLocation.lat,
          lng: initialLocation.lng,
        },
        availabilityStatus: true,
      });

      map.panTo(initialLocation);
      map.setZoom(18);
    });
  }, []);

  // On receiving a new booking request...
  useEffect(() => {
    console.log("Booking useEffect");
  }, [booking]);

  // On approving a new booking request...
  useEffect(() => {
    setScreen("start");
  }, [dispatch]);

  return (
    <>
      <main>
        <LoadScriptNext
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
          loadingElement={<LoadingScreen />}
          libraries={["places", "geometry"]}
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
              <StartTripUI />
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

const StartTripUI = () => {
  // UI: Button to confirm
  // Directions to user
  // Directions from user to destination
  // Taxi Movement
  // Location Events
  return null;
};

const PickUpUI = () => {
  // UI: Button to confirm
  // Taxi Movement
  // Erase Marker
  return null;
};

const DropOffUI = () => {
  // UI: Button to confirm
  // Reset Markers
  return null;
};
