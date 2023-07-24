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
  screenAtom,
  taxiAtom,
} from "@/state";
import Styles from "@/public/resources/maps.json";
import AddMarker from "@/utils/AddMarker";
import { BackButton } from "@/components/BackButton";
import { computeDirections } from "../utils/computeDirections";

export const markers: any = {
  initialLocation: null,
  taxiLocation: null,
  customerLocation: null,
  destinationLocation: null,
};

export const routes: any = {
  pickup: null,
  dropoff: null,
};

const libraries = ["places", "geometry"];

export default function Map() {
  // States
  const driver = useRecoilValue(driverAtom);
  const taxi = useRecoilValue(taxiAtom);
  const booking = useRecoilValue(bookingAtom);
  const [dispatch, setDispatchEvent] = useRecoilState(dispatchAtom);
  const [location, setLocationEvent] = useRecoilState(locationAtom);
  const [screen, setScreen] = useRecoilState(screenAtom);
  const [mapRef, setMapRef] = useState<google.maps.Map>();

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
          lat: initialLocation.lat(),
          lng: initialLocation.lng(),
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
  const location = useRecoilValue(locationAtom);
  const dispatch = useRecoilValue(dispatchAtom);
  const [, setScreen] = useRecoilState(screenAtom);

  computeDirections(map, location, dispatch);
  const startTrip = () => setScreen("pickup");

  return (
    <div className="absolute bottom-0 w-3/4 text-center left-0 right-0 justify-center mr-auto ml-auto mb-4 shadow-md p-4 bg-white rounded-lg">
      <h1 className="!text-black w-full !mb-3">準備はできたか?</h1>
      <button
        className="bg-green-600 flex justify-center py-2 text-white w-full rounded-md"
        onClick={startTrip}
      >
        はじめましょう
      </button>
    </div>
  );
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
