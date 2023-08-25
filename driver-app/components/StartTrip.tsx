import { useRecoilState, useRecoilValue } from "recoil";
import { routesAtom, screenAtom } from "@/state";
import { LoadingScreen } from "./LoadingScreen";

export const StartTrip = ({ t }: any) => {
  const [, setScreen] = useRecoilState(screenAtom);
  const startTrip = () => setScreen("pickup");
  const routes = useRecoilValue(routesAtom);

  if (!routes.pickup || !routes.dropoff) return <LoadingScreen />;

  return (
    <div className="absolute bottom-0 w-3/4 left-0 right-0 justify-center mr-auto ml-auto mb-4 shadow-md p-4 bg-zinc-700 rounded-lg">
      <label className="w-full !mb-3">{t.readyToGo}</label>
      <button
        className="bg-green-400 flex justify-center py-2 text-white w-full rounded-md"
        onClick={startTrip}
      >
        {t.beginRoute}
      </button>
    </div>
  );
};
