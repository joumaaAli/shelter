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
import style from "./Form.module.scss";
import { useRouter } from "next/router";
import { path } from "@/utils/routes";
import { handleRegister } from "@/services/userServices";
import Swal from "sweetalert2"; // Import SweetAlert2
import Link from "next/link";

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
        // Trigger SweetAlert2 upon successful registration
        Swal.fire({
          title: "تم التسجيل بنجاح!",
          text: `اسم المستخدم الخاص بك هو ${rawId}. الرجاء تذكره لاستخدامه في تسجيل الدخول لاحقاً.`,
          icon: "success",
          confirmButtonText: "موافق",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          // Redirect after user acknowledges the alert
          router.push(path.auth.login);
        });
      }
    },
  });

  return (
    <Container fluid className={style.main}>
      <Row
        className="justify-content-center align-items-center"
        style={{ height: "100vh", display: "flex", flex: 1 }}
      >
        <Col xs={12} className={`${style.column} text-center`}>
          <Card className={style["login-card"]}>
            <h1>التسجيل</h1>
            <p>
              السجل الخاص فيك : <strong>{rawId}</strong>
            </p>
            <p>
              يمكنك من خلال هذه المنصة ادراج بيوت متاحة بنفسك، كما يمكنك تعديل
              هذه المعلومات فيما بعد( تعديل رقم الهاتف، وضع معلومات اضافية،
              الغاء الاعلان في حال امتلئ المنزل). لذالك، تقوم المنصة باعطائك
              الرقم التالي عشوائيا (على شكل user1234) ، لانشاء حساب تتمكن من
              خلاله التحكم بالمعلومات التي تقوم بادراجها. عليك فقط ان تختار كلمة
              مرور والاحتفاظ بها وباسم المستخدم لتتمكن من التحكم لاحقا
              بالاعلانات التي تضعها.
            </p>
            <Link href={path.auth.login}>
              <p>لديك حساب ؟</p>
            </Link>
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
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
