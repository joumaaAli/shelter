import { SessionProvider } from "next-auth/react";
import "../styles/globals.scss";
import { AppProps } from "next/app";
import { Session } from "next-auth";
import { getLayout } from "@/layouts/layout";
import { useRouter } from "next/router";
import Head from "next/head";

type MyAppProps = AppProps & {
  pageProps: {
    session?: Session;
  };
};

function MyApp({ Component, pageProps }: MyAppProps) {
  const router = useRouter();
  const Layout = getLayout(router.pathname);

  return (
    <>
      <Head>
        <title>Mosanada</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <SessionProvider session={pageProps.session}>
        {Layout(<Component {...pageProps} />)}
      </SessionProvider>
    </>
  );
}
export default MyApp;
