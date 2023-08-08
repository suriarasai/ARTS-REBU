import { MainScreenVisual } from "@/components/MainScreenVisual";
import { DriverIDInput } from "../components/DriverIDInput";
import { Suspense, useEffect, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useRouter } from "next/router";

import en from "@/locales/en";
import zh from "@/locales/zh";
import ja from "@/locales/ja";
import {
  Internationalization,
  LanguageSelection,
} from "../components/Internationalization";

export default function SignIn() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { locale } = router;
  const lang = locale === "en" ? en : locale === "zh" ? zh : ja;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="ml-auto mr-auto h-screen max-w-screen-md px-12 pb-16 pt-32 sm:pb-0">
        <MainScreenVisual lang={locale} />
        <DriverIDInput t={lang} />
        <Internationalization showModal={setShowModal} t={lang} />
        {showModal && <LanguageSelection showModal={setShowModal} t={lang} />}
      </main>
    </Suspense>
  );
}
