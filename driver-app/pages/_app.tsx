// Main app component that defines the theme and context for the pages

import type { AppProps } from "next/app";
import Meta from "./meta";
import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  /*
		Component	: the page/component to be rendered
		pageProps	: the props of each page/component
	*/

  return (
    <>
      <Meta />
      <Component {...pageProps} />
    </>
  );
};

export default App;
