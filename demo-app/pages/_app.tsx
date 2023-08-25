// Main app component that defines the theme and context for the pages

import type { AppProps } from "next/app";
import Meta from "@/components/meta";
import "@/styles/globals.css";
import { RecoilRoot } from "recoil";
import Page from "@/components/ui/page";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <Meta />
      <Page>
        <Component {...pageProps} />
      </Page>
    </RecoilRoot>
  );
};

export default App;
