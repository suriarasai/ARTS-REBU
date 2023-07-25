/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { routesAtom, screenAtom } from "@/state";
import { MoveTaxiMarker } from "@/utils/moveTaxiMarker";
import { pickupRoute, dropRoute, markers } from "@/pages/map";

export const Trip = ({ type }: { type: "dropoff" | "pickup" }) => {
  const routes = useRecoilValue(routesAtom);
  const [arrived, setArrived] = useState(false);
  const [, setScreen] = useRecoilState(screenAtom);

  useEffect(() => {
    MoveTaxiMarker(routes[type], 0, () => setArrived(true));
  }, [type]);

  const confirmArrival = () => {
    if (type === "pickup") {
      pickupRoute.setMap(null);
      dropRoute.setOptions({ strokeColor: "#16a34a" });
      setScreen("dropoff");
    } else if (type === "dropoff") {
      dropRoute.setMap(null);
      markers.dropoff.setMap(null);
      markers.dropoff = null;
      markers.pickup.setMap(null);
      markers.pickup = null;
      setScreen("");
    }
    setArrived(false)
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
