import { path } from "@/utils/routes";
import { GetServerSideProps } from "next";

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
  };
};
