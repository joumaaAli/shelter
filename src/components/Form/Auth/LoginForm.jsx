import { handleLogin } from "@/services/userServices";
import { useFormik } from "formik";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import * as yup from "yup";
import style from "./Form.module.scss"; // Make sure this is where your CSS is
import { useRouter } from "next/router";
import { path } from "@/utils/routes";

// Validation schema
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
      const { error, result: userRole } = await handleLogin(
        values.email,
        values.password
      );
      if (error) {
        alert(error);
      } else {
        // Redirect based on user role
        if (userRole) {
          router.push(path.admin); // Redirect to admin dashboard
        } else {
          router.push(path.myhouse); // Redirect to myhouse for regular users
        }
      }
    },
  });

  return (
    <Container fluid className={style.main}>
      <Row
        className="justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Col xs={12} className="text-center">
          <Card className={style["login-card"]}>
            <h1>تسجيل الدخول</h1>
            <p>هذه الصفحة متاحة فقط للمستخدمين المسجلين</p>
            <Form onSubmit={formik.handleSubmit} className="p-4">
              <FormGroup className="mb-3">
                <FormLabel>البريد الالكتروني</FormLabel>
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
                <FormLabel>كلمة المرور</FormLabel>
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
                  الاتصال
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
