import Head from "next/head";

import en from '@/locales/en'
import zh from '@/locales/zh'
import jp from '@/locales/ja'

const Locale = ({ children }: { children: React.ReactNode }) => (
  <>
    <Head>
      <title>Rebu</title>
    </Head>
    
    <div>{children}</div>
  </>
);

export default Locale;
