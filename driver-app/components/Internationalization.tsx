import { useState } from "react";
import { FaGlobe, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";

export function Internationalization({ showModal }: any) {
  return (
    <button
      className="absolute bottom-0 right-0 m-6 h-8 w-8 flex items-center justify-center rounded-sm shadow-md bg-green-300"
      onClick={() => showModal(true)}
    >
      <FaGlobe className="text-xl" />
    </button>
  );
}
export function LanguageSelection({ showModal, t }: any) {
  const [locale, setLocale] = useState<string>("");
  const router = useRouter();

  const handleSubmit = () => {
    showModal(false);
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <div className="">
      <div className="absolute p-5 left-0 right-0 mr-auto ml-auto top-1/4 bg-slate-100 rounded-lg shadow-lg border border-zinc-300 text-black flex flex-col w-1/2 h-fit">
        <FaTimes className="text-xl" onClick={() => showModal(false)} />
        <h1 className="!text-zinc-700 mt-3">{t.languagePreference}</h1>
        <div className="space-y-2">
          <div
            className={`${
              locale === "en" ? "bg-green-300" : ""
            } rounded-lg p-2`}
            onClick={() => setLocale("en")}
          >
            English (en)
          </div>
          <div
            className={`${
              locale === "zh" ? "bg-green-300" : ""
            } rounded-lg p-2`}
            onClick={() => setLocale("zh")}
          >
            中文 (zh)
          </div>
          <div
            className={`${
              locale === "jp" ? "bg-green-300" : ""
            } rounded-lg p-2`}
            onClick={() => setLocale("jp")}
          >
            日本语 (jp)
          </div>
        </div>
        <button
          className={`mt-3 text-zinc-100 rounded-lg py-2 ${
            locale !== "" ? "bg-green-700" : "bg-zinc-400"
          }`}
          onClick={handleSubmit}
        >
          {t.confirm}
        </button>
      </div>
    </div>
  );
}
