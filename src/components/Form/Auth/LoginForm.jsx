import { handleLogin } from "@/services/userServices";
import { useFormik } from "formik";
import {
  Button,
  Card,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import * as yup from "yup";
import style from "./Form.module.scss";
import { useRouter } from "next/router";
import { path } from "@/utils/routes";

const validationSchema = yup.object({
  email: yup.string().email("Email invalide").required("Requis"),
  password: yup.string().required("Requis"),
});

const LoginForm = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { error } = await handleLogin(values.email, values.password);
      if (error) {
        alert(error);
      } else {
        router.push(path.admin);
      }
    },
  });

  return (
    <Card className={style["login-card"]}>
      <h1>Connexion</h1>
      <p>Cette page est uniquement accessible aux utilisateurs authentifiés.</p>
      <Form onSubmit={formik.handleSubmit} className="p-4">
        <FormGroup className="mb-3">
          <FormLabel>Email</FormLabel>
          <FormControl
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.email}
          />
          <FormControl.Feedback type="invalid">
            {formik.errors.email}
          </FormControl.Feedback>
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Mot de passe</FormLabel>
          <FormControl
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.password}
          />
          <FormControl.Feedback type="invalid">
            {formik.errors.password}
          </FormControl.Feedback>
        </FormGroup>
        <div className="w-100 d-flex justify-content-between">
          <Button
            type="submit"
            variant="primary"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Connexion
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default LoginForm;
