/* eslint-disable react-hooks/exhaustive-deps */
import { Booking } from "@/components/streamLogs/Booking";
import { useEffect, useState } from "react";
import AddressList from "@/public/resources/addresses.json";
import LicenseList from "@/public/resources/licenses.json";

let timeoutFunction: any;
const fleetSize = 2500;
let randCID = shuffle(
  Array(240)
    .fill(1)
    .map((_, i) => i + 1)
);
let randDID = shuffle(
  Array(2500)
    .fill(1)
    .map((_, i) => i + 1)
);

export default function StreamLogs() {
  const [toggleSim, setToggleSim] = useState(false);
  const [stopWatch, setStopwatch] = useState(0);
  const controlSim = () => setToggleSim(!toggleSim);
  const [events, setEvents] = useState<Booking[]>([]);

  useEffect(() => {
    if (!toggleSim) return;

    iterator(stopWatch + 1);

    return () => {
      clearTimeout(timeoutFunction);
    };
  }, [toggleSim]);

  function iterator(iter: number) {
    timeoutFunction = setTimeout(function () {
      // Creating a new booking every second
      const booking = new Booking(
        iter,
        randCID.next().value!,
        AddressList[Math.floor(Math.random() * AddressList.length)],
        AddressList[Math.floor(Math.random() * AddressList.length)]
      );

      // Updating list of bookings
      setEvents((events) => [...events, booking]);

      // Assigning dispatch events randomly
      setEvents((events) => {
        const requested = events.filter(
          (event: Booking) => event.status === "requested"
        );

        const toDispatch =
          requested[Math.floor(Math.random()) * requested.length];

        const randBool = Math.random() < 0.5
        
        if (!toDispatch || randBool) return [...events]

        toDispatch.dispatchBooking(
          randDID.next().value!,
          LicenseList[Math.floor(Math.random() * LicenseList.length)]
        );

        return [
          ...events.filter(
            (event: Booking) => event.bookingID !== toDispatch.bookingID
          ),
          toDispatch
        ];
      });

      // Creating completion events randomly

      // Moving to the next iteration
      setStopwatch((stopWatch) => stopWatch + 1);
      if (toggleSim) {
        iterator(iter + 1);
      }
    }, 1000);
  }

  return (
    <div className="bg-zinc-200 h-screen w-screen space-y-5">
      <div className="mt-20 bg-neutral-50 shadow-sm p-3 flex space-x-2 w-1/2 mr-auto ml-auto rounded-md">
        <div className="flex-1 text-center space-y-1">
          <p className="text-xl">{events.length}</p>
          <p className="text-xs font-bold">Total</p>
        </div>
        <div className="flex-1 text-center space-y-1">
          <p className="text-xl">
            {
              events.filter((message: any) => message.status === "dispatched")
                .length
            }
          </p>
          <p className="text-xs font-bold">In-Progress</p>
        </div>
        <div className="flex-1 text-center space-y-1">
          <p className="text-xl">
            {
              events.filter((message: any) => message.status === "requested")
                .length
            }
          </p>
          <p className="text-xs font-bold">Pending</p>
        </div>
        <div className="flex-1 text-center space-y-1">
          <p className="text-xl">
            {fleetSize -
              events.filter((message: any) => message.status === "dispatched")
                .length}
          </p>
          <p className="text-xs font-bold">Free Drivers</p>
        </div>
      </div>

      <div className="bg-neutral-50 p-3 w-11/12 mr-auto ml-auto rounded-md shadow-sm h-4/6 overflow-y-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Msg. Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length >= 1 &&
              events.toReversed().map((message: any, index: number) => (
                <tr key={index} className="center-table-contents">
                  <td>{message.bookingID}</td>
                  <td>{message.customerID}</td>
                  <td>{message.driverID}</td>
                  <td>{message.taxiNumber}</td>
                  <td>{message.pickUpLocation}</td>
                  <td>{message.dropLocation}</td>
                  <td>{message.messageReceivedTime}</td>
                  <td>{message.status}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="absolute top-0 left-0 mt-24 ml-16 flex space-x-2">
          <button
            className={toggleSim ? "bg-zinc-300" : ""}
            onClick={controlSim}
          >
            {toggleSim ? "Pause" : "Start"} Simulation
          </button>
          <button className="bg-zinc-50" disabled>
            {stopWatch + " s."}
          </button>
        </div>
      </div>
    </div>
  );
}

function* shuffle(array: number[]) {
  var i = array.length;

  while (i--) {
    yield array.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
  }
}
