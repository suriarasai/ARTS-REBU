import Image from "next/image";
import MainScreenImage from "@/public/images/favicon.png";

export const LoadingScreen = () => (
  <div className="mt-10 flex flex-col items-center justify-center">
    <Image
      src={MainScreenImage}
      width={150}
      height={150}
      alt="Main screen image"
    />
    <h1 className="mb-5">
      <b>Rebu</b>
    </h1>
    <hr className="h-0.5 w-1/12 bg-purple-700" />
    <h1 className="my-5">"Life is like a ride inside a taxi"</h1>
    <div
      className="mt-8 h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    />
  </div>
);
