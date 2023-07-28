/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  bookingAtom,
  driverAtom,
  routesAtom,
  screenAtom,
  taxiAtom,
} from "@/state";
import { MoveTaxiMarker } from "@/utils/moveTaxiMarker";
import { pickupRoute, dropRoute, markers } from "@/pages/map";
import { BookingEvent } from "@/types";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { produceKafkaChatEvent } from "@/server";

export const Trip = ({ type }: { type: "dropoff" | "pickup" }) => {
  const routes = useRecoilValue(routesAtom);
  const [arrived, setArrived] = useState(false);
  const [, setScreen] = useRecoilState(screenAtom);
  const driver = useRecoilValue(driverAtom);
  const taxi = useRecoilValue(taxiAtom);
  const [booking, setBooking] = useRecoilState(bookingAtom);

  useEffect(() => {
    MoveTaxiMarker(routes[type], 0, driver, taxi, () => setArrived(true));
  }, [type]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    let res;

    client.connect({}, () => {
      client.subscribe(
        "/user/d" + driver.driverID + "/queue/chatEvent",
        (message) => {
          res = JSON.parse(message.body);
          if (res.type === 'cancelTrip') {
            console.log("User cancelled trip")
          }
        }
      );
    });

    return () => {
      client.disconnect(() => console.log("Disconnected from server"));
    };
  }, []);

  const confirmArrival = () => {
    if (type === "pickup") {
      produceKafkaChatEvent(
        JSON.stringify({
          recipientID: "c" + booking.customerID,
          type: "arrivedToUser",
        })
      );
      pickupRoute.setMap(null);
      dropRoute.setOptions({ strokeColor: "#16a34a" });
      setScreen("dropoff");
    } else if (type === "dropoff") {
      produceKafkaChatEvent(
        JSON.stringify({
          recipientID: "c" + booking.customerID,
          type: "arrivedToDestination",
        })
      );
      dropRoute.setMap(null);
      markers.dropoff.setMap(null);
      markers.dropoff = null;
      markers.pickup.setMap(null);
      markers.pickup = null;
      setScreen("");
      setBooking({} as BookingEvent);
    }
    setArrived(false);
  };

  return (
    <div className="absolute bottom-0 w-3/4 left-0 right-0 justify-center mr-auto ml-auto mb-4 shadow-md p-4 bg-zinc-700 rounded-lg">
      <label className="w-full !mb-3">En route to {type} location</label>
      <button
        className={`flex justify-center py-2 text-white w-full rounded-md ${
          arrived ? "bg-green-400" : "bg-zinc-400"
        }`}
        onClick={confirmArrival}
        disabled={!arrived}
      >
        Confirm {type}
      </button>
    </div>
  );
};
