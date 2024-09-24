import { Col, Container, Row } from "react-bootstrap";
import style from "./About.module.scss";
import Link from "next/link";
import { path } from "@/utils/routes";

function About() {
  const infoData = [
    {
      title: "لإدراج منزل اضغط هنا",
      link: path.myhouse,
    },
    { title: "للاطلاع على المنازل الموجودة اضغط هنا", link: path.houses },
  ];

  return (
    <div className="about-page">
      <Container className="mb-4">
        <div className={`${style["about-section-1"]}`}>
          <div className="container h-200 d-flex align-items-center justify-content-center flex-column py-2">
            <p className={style["about-page-desc-1"]}>
              تهدف هذه المنصة للبحث ولادراج البيوت المتوفرة في خدمة اهلنا
              النازحين. يمكنك البحث في لائحة البيوت الموجودة او في لائحة الملاحئ
              المعتمدة، كما يمكنك ادراج بيت متوفر بنفسك.
            </p>
          </div>
        </div>
      </Container>

      <div className={style.ourServices}>
        <Row className="mx-2">
          {infoData.map((info, index) => (
            <Col lg={6} md={6} className="my-3">
              <Link
                key={index}
                href={info.link}
                className="text-decoration-none"
              >
                <div className={style.aboutUsCard}>
                  <p className="small text-center">{info?.title}</p>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default About;
