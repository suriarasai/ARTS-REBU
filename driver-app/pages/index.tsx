import { MainScreenVisual } from "@/components/MainScreenVisual";
import { DriverIDInput } from "../components/DriverIDInput";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FaGlobe } from "react-icons/fa";

export default function SignIn() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="ml-auto mr-auto h-screen max-w-screen-md px-12 pb-16 pt-40 sm:pb-0">
        <MainScreenVisual />
        <DriverIDInput />
        <Internationalization />
      </main>
    </Suspense>
  );
}

const Internationalization = () => {
  return (
    <button className="absolute bottom-0 right-0 m-6 h-8 w-8 flex items-center justify-center rounded-sm shadow-md bg-green-300">
      <FaGlobe className="text-xl" />
    </button>
  );
};
