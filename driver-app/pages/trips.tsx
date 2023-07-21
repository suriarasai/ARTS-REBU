import { LoadingScreen } from "@/components/LoadingScreen";
import BottomNav from "@/components/bottomNav";
import { BookingEvent } from "@/types";
import { Suspense } from "react";
import { FaCheckCircle, FaCompass, FaFlag } from "react-icons/fa";

const trips: BookingEvent[] = [
  {
    status: "requested",
    customerName: "Customerini",
    pickUpLocation: {
      placeName: "NUS ISS",
      address: "25 Heng Keng Mui Terrace",
      postcode: "123456",
    },
    dropLocation: {
      placeName: "NUS Central Library",
      address: "12 Kent Ridge Crescent",
      postcode: "122334",
    },
    fare: 23.2,
    eta: 1234,
    distance: 2420,
  },
  {
    status: "requested",
    customerName: "Customerini",
    pickUpLocation: {
      placeName: "NUS ISS",
      address: "25 Heng Keng Mui Terrace",
      postcode: "123456",
    },
    dropLocation: {
      placeName: "NUS Central Library",
      address: "12 Kent Ridge Crescent",
      postcode: "122334",
    },
    fare: 23.2,
    eta: 1234,
    distance: 2420,
  },
];

export default function Trips() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="space-y-3 p-6 pt-12">
        <h1>Ride Requests</h1>
        {trips.map((trip, index) => (
          <RideRequest trip={trip} key={index} />
        ))}
      </main>
      <BottomNav />
    </Suspense>
  );
}

const RideRequest = ({ trip }: { trip: BookingEvent }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm py-2 px-4 flex">
      <div className="w-5/6 flex flex-col">
        <b>{trip.customerName}</b>

        <div className="flex items-center mt-1">
          <FaCompass className="mr-2 text-green-400 text-sm" />
          <p>
            {trip.pickUpLocation.address + ", " + trip.pickUpLocation.postcode}
          </p>
        </div>

        <div className="flex items-center mb-1.5">
          <FaFlag className="mr-2 text-green-400 text-sm" />
          <p>{trip.dropLocation.address + ", " + trip.dropLocation.postcode}</p>
        </div>

        <div className="flex mt-1.5">
          <CircleLabel label={"$" + trip.fare} />
          <CircleLabel label={Math.round(trip.eta / 60) + " min"} />
          <CircleLabel label={Math.round(trip.distance! / 60) + " km"} />
        </div>
      </div>

      <div className="w-1/6 flex items-center justify-center border-l-2 border-gray-300">
        <FaCheckCircle className="text-4xl text-green-400" />
      </div>
    </div>
  );
};

const CircleLabel = ({ label }: { label: string }) => {
  return (
    <div className="rounded-xl bg-green-600 w-fit px-2 py-0.5 mr-1">
      <p className="text-xs text-white font-semibold uppercase">{label}</p>
    </div>
  );
};
