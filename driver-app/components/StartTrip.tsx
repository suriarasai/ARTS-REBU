import { useRecoilState } from "recoil";
import { screenAtom } from "@/state";

export const StartTrip = () => {
  const [, setScreen] = useRecoilState(screenAtom);
  const startTrip = () => setScreen("pickup");

  return (
    <div className="absolute bottom-0 w-3/4 left-0 right-0 justify-center mr-auto ml-auto mb-4 shadow-md p-4 bg-zinc-700 rounded-lg">
      <label className="w-full !mb-3">Ready to go?</label>
      <button
        className="bg-green-400 flex justify-center py-2 text-white w-full rounded-md"
        onClick={startTrip}
      >
        Begin Route
      </button>
    </div>
  );
};
