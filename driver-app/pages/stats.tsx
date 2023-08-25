import BottomNav from "@/components/bottomNav";
import { useRouter } from "next/router";

import en from "@/locales/en";
import zh from "@/locales/zh";
import ja from "@/locales/ja";

export default function Stats({}) {
  const router = useRouter();
  const { locale } = router;
  const lang = locale === "en" ? en : locale === "zh" ? zh : ja;

  return (
    <>
      <div className="p-4">
        <h1>{lang.stats}</h1>
      </div>
      <BottomNav t={lang} />
    </>
  );
}
