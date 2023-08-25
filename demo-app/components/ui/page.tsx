import Head from "next/head";
import NavBar from "./navBar";

const Page = ({ children }: { children: React.ReactNode }) => (
  <>
    <Head>
      <title>Rebu</title>
    </Head>

    <NavBar />
    <div className="flex w-screen h-[calc(100%-3rem)]">{children}</div>
  </>
);

export default Page;
