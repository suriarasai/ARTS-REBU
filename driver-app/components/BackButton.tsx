import { HREF } from "@/constants";
import { useRouter } from "next/router";
import { FaAngleLeft } from "react-icons/fa";

export const BackButton = () => {
  const router = useRouter();
  const routeToTrips = () => router.push(HREF.TRIPS);
  return (
    <div className="absolute top-0 left-0 mt-3 ml-3">
      <button
        onClick={routeToTrips}
        className="flex items-center bg-green-600 text-white rounded-md px-2 py-1 shadow-md"
      >
        <FaAngleLeft className="mr-1" /> Trips
      </button>
    </div>
  );
};
