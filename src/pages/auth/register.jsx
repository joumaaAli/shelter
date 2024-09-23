// pages/register.js

import RegisterForm from "@/components/Form/Auth/RegisterForm";
import { requireNoAuthentication } from "@/layouts/layout";
import { Container } from "react-bootstrap";

const RegisterPage = ({ id, rawId }) => {
  return (
    <Container>
      <RegisterForm id={id} rawId={rawId} />
    </Container>
  );
};

export default RegisterPage;

export const getServerSideProps = async (context) => {
  const result = await requireNoAuthentication(context);
  if (result.redirect) {
    return result;
  }

  // Generate a unique ID for the user
  const rawId = "user" + Math.floor(Math.random() * 1000000);
  const id = `${rawId}@example.com`; // Ensure it's a valid email

  return {
    props: {
      id,
      rawId,
    },
  };
};
