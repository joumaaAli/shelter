import "../styles/globals.scss";
import { AppProps } from "next/app";
import { getLayout } from "@/layouts/layout";
import { useRouter } from "next/router";
import Head from "next/head";

type MyAppProps = AppProps & {};

function MyApp({ Component, pageProps }: MyAppProps) {
  const router = useRouter();
  const Layout = getLayout(router.pathname);

  return (
    <>
      <Head>
        <title>Mosanada</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      {Layout(<Component {...pageProps} />)}
    </>
  );
}
export default MyApp;
