// components/Form/Auth/RegisterForm.js

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
import { handleRegister } from "@/services/userServices";

const validationSchema = yup.object({
  password: yup.string().required("مطلوب"),
});

const RegisterForm = ({ id, rawId }) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { error } = await handleRegister(id, values.password);
      if (error) {
        alert(error);
      } else {
        router.push(path.auth.login);
      }
    },
  });

  return (
    <Card className={style["register-card"]} dir="rtl">
      <h1>التسجيل</h1>
      <p>
        السجل الخاص فيك : <strong>{rawId}</strong>
      </p>
      <Form onSubmit={formik.handleSubmit} className="p-4">
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
            التسجيل
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default RegisterForm;
