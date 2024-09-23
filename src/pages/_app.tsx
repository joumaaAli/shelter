import { SessionProvider } from "next-auth/react";
import "../styles/globals.scss";
import { AppProps } from "next/app";
import { Session } from "next-auth";
import { getLayout } from "@/layouts/layout";
import { useRouter } from "next/router";

type MyAppProps = AppProps & {
  pageProps: {
    session?: Session;
  };
};

function MyApp({ Component, pageProps }: MyAppProps) {
  const router = useRouter();
  const Layout = getLayout(router.pathname);

  return (
    <SessionProvider session={pageProps.session}>
      {Layout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}
export default MyApp;
