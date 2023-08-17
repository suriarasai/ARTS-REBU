import { HREF } from "@/constants";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("Home");

  const handleClick = (page: string, route: string) => {
    setActivePage(page);
    router.push((HREF as any)[route]);
  };

  return (
    <div className="absolute top-0 left-0 z-50 shadow-lg w-full h-12 bg-neutral-100 flex items-center px-5">
      <p className="font-semibold">{activePage}</p>
      <div className="!ml-auto flex space-x-3">
        <button onClick={() => handleClick("Home", "HOME")}>Home</button>
        <button onClick={() => handleClick("Stream Logs", "STREAMLOGS")}>
          Stream Logs
        </button>
        <button onClick={() => handleClick("Routes", "ROUTES")}>Routes</button>
        <button onClick={() => handleClick("Fare", "FARE")}>
          Fare Calculator
        </button>
        <button onClick={() => handleClick("Simple App", "MATCHING")}>
          Matching
        </button>
        <button onClick={() => handleClick("Simulation", "SIMULATION")}>
          Simulation
        </button>
      </div>
    </div>
  );
}
