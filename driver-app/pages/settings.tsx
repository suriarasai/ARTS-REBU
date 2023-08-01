import { LoadingScreen } from "@/components/LoadingScreen";
import BottomNav from "@/components/bottomNav";
import { HREF } from "@/constants";
import { driverAtom } from "@/state";
import { Driver } from "@/types";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { FaPhone, FaSignOutAlt, FaStar, FaUserCircle } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";

import en from "@/locales/en";
import zh from "@/locales/zh";
import ja from "@/locales/ja";

export default function Settings() {
  const router = useRouter();
  const { locale } = router;
  const lang = locale === "en" ? en : locale === "zh" ? zh : ja;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="p-6 space-y-5">
        <DriverProfile t={lang} />
        <SignOutButton t={lang} />
      </main>
      <BottomNav t={lang} />
    </Suspense>
  );
}

const SignOutButton = ({ t }: any) => {
  const [, setDriver] = useRecoilState(driverAtom);
  const router = useRouter();
  const SignOut = () => {
    setDriver({} as Driver);
    localStorage.clear();
    router.push(HREF.SIGNIN);
  };

  return (
    <button
      className="text-red-100 flex items-center rounded-md border border-red-100 p-2 float-right"
      onClick={SignOut}
    >
      <FaSignOutAlt className="mr-2" />
      {t.signOut}
    </button>
  );
};

const DriverProfile = ({ t }: any) => {
  const driver = useRecoilValue<Driver>(driverAtom);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
      <div className="w-1/6">
        <FaUserCircle className="text-green-400 text-4xl" />
      </div>

      <div className="w-4/6">
        <p className="text-gray-700 text-xl font-normal">
          {driver.driverName}{" "}
          <span className="text-gray-300">{" (@" + driver.driverID + ")"}</span>
        </p>
        <p className="flex items-center">
          +65 {driver.phoneNumber}{" "}
          <FaPhone className="ml-2 text-green-400 text-sm" />
        </p>
      </div>

      <div className="w-1/6">
        <div className="h-10 w-fit px-2 rounded-sm bg-green-800 text-white flex items-center justify-center">
          <FaStar className="text-white mr-2" /> {driver.rating}
        </div>
      </div>
    </div>
  );
};
