import { Col, Row } from "react-bootstrap";
import style from "./About.module.scss";
import Link from "next/link";

function About() {
  const infoData = [
    {
      title: "لوضع اعلان اضغط هنا",
      link: "/add",
    },
    { title: "للاطلاع على الاعلانات الموجودة اضغط هنا", link: "/" },
  ];

  return (
    <div className="about-page">
      <div className={`${style["about-section-1"]}`}>
        <div className="container h-200 d-flex align-items-center justify-content-center flex-column py-2">
          <p className={style["about-page-desc-1"]}>
            تهدف هذه المنصة الى توحيد جميع اعلانات البيوت التي تعرض لاستقبال
            اهلنا النازحين
          </p>
        </div>
      </div>

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
