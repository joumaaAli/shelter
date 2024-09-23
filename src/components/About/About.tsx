import AboutUsImage from "@/utils/img/about-us.jpg";
import Image from "next/image";
import { Button, Col, Container, Row } from "react-bootstrap";
import style from "./About.module.scss";

function About() {
  const infoData = [
    "لوضع اعلان اضغط هنا",
    "للاطلاع على الاعلانات الموجودة اضغط هنا",
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
        <div className="container my-4 d-flex align-items-center justify-content-center"></div>
        <Row className="mx-2">
          {infoData.map((info, index) => (
            <Col key={index} lg={6} md={6} className="my-3">
              <a key={index} className={style.aboutUsCard}>
                <p className="small text-center">{info}</p>
              </a>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default About;
