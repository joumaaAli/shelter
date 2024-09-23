import LoginForm from "@/components/Form/Auth/LoginForm";
import { requireNoAuthentication } from "@/layouts/layout";

const LoginPage = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;

export const getServerSideProps = async (context) => {
  return await requireNoAuthentication(context);
};
