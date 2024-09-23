import { path } from "@/utils/routes";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <main>
      <div>
        <h1>Hello From Ainije</h1>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: path.home,
      permanent: false,
    },
    props: {
      session: await getSession(context),
    },
  };
};
