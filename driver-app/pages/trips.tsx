import { LoadingScreen } from "@/components/LoadingScreen";
import BottomNav from "@/components/bottomNav";
import { HREF } from "@/constants";
import { bookingAtom, driverAtom, taxiAtom } from "@/state";
import { BookingEvent } from "@/types";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { FaCheckCircle, FaCompass, FaFlag } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { pingCurrentLocation } from "../utils/pingCurrentLocation";
import { produceDispatchEvent } from "../utils/produceDispatchEvent";

import en from "@/locales/en";
import zh from "@/locales/zh";
import ja from "@/locales/ja";

export default function Trips() {
  const router = useRouter();
  const { locale } = router;
  const lang = locale === "en" ? en : locale === "zh" ? zh : ja;

  const [trips, setTrips] = useState<BookingEvent[]>([]);
  const driver = useRecoilValue(driverAtom);

  // Booking stream consumer: Looking for rides to match with
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe(
        "/user/d" + driver.driverID + "/queue/bookingEvent",
        (newEvent) => {
          addBooking(JSON.parse(newEvent.body));
        }
      );
    });

    return () => {
      client.disconnect(() => console.log("Disconnected from server"));
    };
  }, []);

  const addBooking = (newEvent: BookingEvent) => {
    setTrips((trips) => [...trips, newEvent]);
  };

  const removeBooking = (customerID: number) => {
    setTrips((trips) => trips.filter((trip) => trip.customerID !== customerID));
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="space-y-3 p-6 pt-12">
        <h1>{lang.rideRequests}</h1>
        {trips.length > 0 ? (
          trips.map((trip, index) => (
            <RideRequest trip={trip} remove={removeBooking} key={index} />
          ))
        ) : (
          <p className="!text-white italic">{lang.waitingForTrips}</p>
        )}
      </main>
      <BottomNav t={lang} />
    </Suspense>
  );
}

const RideRequest = ({
  trip,
  remove,
}: {
  trip: BookingEvent;
  remove: Function;
}) => {
  const router = useRouter();
  const taxi = useRecoilValue(taxiAtom);
  const driver = useRecoilValue(driverAtom);
  const [, setBooking] = useRecoilState(bookingAtom);
  const onApprove = () => {
    remove(trip.customerID);
    setBooking(trip);
    produceDispatchEvent(trip, taxi, driver);
    pingCurrentLocation(taxi.tmdtid, driver.driverID, taxi.taxiNumber);

    router.push(HREF.MAP);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm py-2 px-4 flex">
      <div className="w-5/6 flex flex-col">
        <b>{trip.customerName}</b>

        <div className="flex items-center mt-1">
          <FaCompass className="mr-2 text-green-400 text-sm" />
          <p>
            <span className="font-normal">{trip.pickUpLocation.address}</span>
            {", " + trip.pickUpLocation.postcode}
          </p>
        </div>

        <div className="flex items-center mb-1.5">
          <FaFlag className="mr-2 text-green-400 text-sm" />
          <p>
            <span className="font-normal">{trip.dropLocation.address}</span>
            {", " + trip.dropLocation.postcode}
          </p>
        </div>

        <div className="flex mt-1.5">
          <CircleLabel label={"$" + trip.fare} />
          <CircleLabel label={Math.round(trip.eta / 60) + " min"} />
          <CircleLabel label={Math.round(trip.distance! / 1000) + " km"} />
        </div>
      </div>

      <div className="w-1/6 flex items-center justify-center border-l-2 border-gray-300">
        <FaCheckCircle
          className="text-4xl text-green-400"
          onClick={onApprove}
        />
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
