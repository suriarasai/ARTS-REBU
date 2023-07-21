import { MainScreenVisual } from "@/components/MainScreenVisual";
import { DriverIDInput } from "../components/DriverIDInput";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function SignIn() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="ml-auto mr-auto h-screen max-w-screen-md px-12 pb-16 pt-40 sm:pb-0">
        <MainScreenVisual />
        <DriverIDInput />
      </main>
    </Suspense>
  );
}
