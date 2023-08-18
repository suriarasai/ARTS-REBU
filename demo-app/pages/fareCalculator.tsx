import computeFare from "@/components/fareCalculator/computeFare";
import {
  destinationInputAtom,
  originInputAtom,
  pickupTimeAtom,
  taxiTypeAtom,
  tripDetailsAtom,
} from "@/components/fareCalculator/state";
import { LocationInterface } from "@/types";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const libraries = ["places", "geometry"];

export default function FareCalculator() {
  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      libraries={libraries as any}
    >
      <div className="flex space-x-5 absolute left-0 right-0 mr-auto ml-auto mt-32 w-1/2">
        <div className="flex bg-zinc-100 border-2 border-green-500 p-8 rounded shadow-sm space-y-3 w-3/4 flex-col">
          <TaxiTypeDropdown />
          <PickupTimeDropdown />
          <OriginInput />
          <DestinationInput />
          <CalculateFareButton />
        </div>

        <div className="bg-zinc-100 border-2 border-green-500 p-8 rounded shadow-sm w-1/3">
          <TripDetails />
        </div>
      </div>
    </LoadScriptNext>
  );
}

function TaxiTypeDropdown() {
  const [, setTaxiType] = useRecoilState(taxiTypeAtom);
  return (
    <>
      <select
        defaultValue=""
        className="rounded-l-lg"
        onChange={(e) => setTaxiType(e.target.value)}
      >
        <option value="" disabled>
          Taxi Type
        </option>
        <option value="regular">Regular</option>
        <option value="plus">Plus</option>
      </select>
    </>
  );
}

function PickupTimeDropdown() {
  const [pickUpTime, setPickUpTime] = useRecoilState(pickupTimeAtom);
  return (
    <>
      <select
        defaultValue=""
        className="rounded-l-lg"
        onChange={(e) => setPickUpTime(e.target.value)}
      >
        <option value="" disabled>
          Pickup Time
        </option>
        <option value="regular">Regular</option>
        <option value="peak">Peak</option>
        <option value="night">Night</option>
      </select>
    </>
  );
}

function OriginInput() {
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [, setOrigin] = useRecoilState(originInputAtom);

  const onRetrieve = () => {
    const retrievedAddress = autocomplete.getPlace();
    setOrigin(getAddress(retrievedAddress) as any);
  };

  return (
    <>
      <Autocomplete
        onLoad={(e) => setAutocomplete(e)}
        onPlaceChanged={onRetrieve}
        options={{ componentRestrictions: { country: "sg" } }}
        fields={["address_components", "geometry", "formatted_address"]}
      >
        <input type="text" placeholder="Enter origin location" />
      </Autocomplete>
    </>
  );
}

function DestinationInput() {
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [, setDestination] = useRecoilState(destinationInputAtom);

  const onRetrieve = () => {
    const retrievedAddress = autocomplete.getPlace();
    setDestination(getAddress(retrievedAddress) as any);
  };

  return (
    <>
      <Autocomplete
        onLoad={(e) => setAutocomplete(e)}
        onPlaceChanged={onRetrieve}
        options={{ componentRestrictions: { country: "sg" } }}
        fields={["address_components", "geometry", "formatted_address"]}
      >
        <input type="text" placeholder="Enter destination location" />
      </Autocomplete>
    </>
  );
}

function CalculateFareButton() {
  const origin = useRecoilValue(originInputAtom);
  const destination = useRecoilValue(destinationInputAtom);
  const taxiType = useRecoilValue(taxiTypeAtom);
  const pickUpTime = useRecoilValue(pickupTimeAtom);
  const [, setTripDetails] = useRecoilState(tripDetailsAtom);

  const handleClick = () => {
    computeRoute(origin, destination, (distance: number, duration: number) => {
      const fare = computeFare(
        taxiType,
        origin.postcode,
        destination.postcode,
        distance,
        pickUpTime
      );
      setTripDetails({
        distance: distance,
        fare: fare,
        duration: duration,
      });
    });
  };

  return (
    <>
      <button className="w-full" onClick={handleClick}>
        Calculate
      </button>
    </>
  );
}

function getAddress(place: any) {
  let postcode = "";

  for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
    const componentType = component.types[0];

    switch (componentType) {
      case "postal_code": {
        postcode = component.long_name;
        break;
      }
    }
  }

  return {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
    postcode: postcode,
  } as LocationInterface;
}

function computeRoute(
  origin: LocationInterface,
  dest: LocationInterface,
  _callback: Function
) {
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(
    {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(dest.lat, dest.lng),
      travelMode: google.maps.TravelMode.DRIVING,
    },
    function (result, status) {
      if (status == "OK") {
        const distance = Math.round(
          result!.routes[0].legs[0].distance!.value / 1000
        );
        const duration = Math.round(
          result!.routes[0].legs[0].duration!.value / 60
        );
        _callback(distance, duration);
      }
    }
  );
}

function TripDetails() {
  const tripDetails = useRecoilValue(tripDetailsAtom);
  console.log(tripDetails.fare);
  return (
    <>
      <b className="text-xs font-bold mb-2">Overview</b>
      <p>Fare: ${tripDetails.fare.total}</p>
      <p>Distance: {tripDetails.distance + " km"}</p>
      <p>Duration: {tripDetails.duration + " min"}</p>
      <hr className="my-2 border-zinc-400" />
      <b className="text-xs font-bold mb-2">Fare Breakdown</b>
      <p>Booking: ${tripDetails.fare.booking}</p>
      <p>Base: ${tripDetails.fare.base}</p>
      <p>Metered: ${tripDetails.fare.metered}</p>
      <p>Peak: ${tripDetails.fare.peak}</p>
      <p>Location: ${tripDetails.fare.location}</p>
      <p>Temp: ${tripDetails.fare.tempSurcharge}</p>
      <p>Total: ${tripDetails.fare.total}</p>
    </>
  );
}
