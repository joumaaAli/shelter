import AboutUsImage from "@/utils/img/about-us.jpg";
import Image from "next/image";
import { Button, Col, Container, Row } from "react-bootstrap";
import style from "./About.module.scss";

function About() {
  const infoData = [
    "Preparation and implementation of the regional health project.",
    "Analysis of health needs and healthcare services to develop the regional healthcare organization plan.",
    "Organization of professional practice, including continuity and new modes of healthcare practice.",
    "Actions in the fields of healthcare, prevention, health monitoring, crisis management, health promotion, and therapeutic education.",
    "Implementation of multi-year objectives and means contracts with health networks, health centers, medical homes, and health hubs.",
    "Deployment and use of shared communication and information systems.",
    "Implementation of continuous professional development.",
    "We can analyze aggregated national and regional data from the national inter-regime health insurance information system related to our missions.",
  ];

  return (
    <div className="about-page">
      <div className={`${style["about-section-1"]}`}>
        <div className="container h-100 d-flex align-items-center justify-content-center flex-column py-2">
          <h1 className={style["about-page-title-1"]}>Who are we ?</h1>
          <p className={style["about-page-desc-1"]}>
            Les unions régionales des professionnels de santé rassemblent les
            représentants des professionnels de santé libéraux. Elles ont été
            créées par le décret du 02.06.2010 art 4031 notre mission est de
            contribuer à l&apos;organisation de l&apos;offre de santé régionale.
          </p>
        </div>
      </div>
      <Row className={`${style["about-section-2"]}`}>
        <Col md={2} />
        <Col md={8}>
          <Container
            className="car-card my-4 p-3"
            style={{
              borderRadius: "15px",
              backgroundColor: "#f5f5f5",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row className="align-items-center">
              <Col md={1} />
              <Col md={6} className="text-section">
                <h1 className="display-5" style={{ fontWeight: "bold" }}>
                  Find Your Car
                </h1>
                <p style={{ fontSize: "16px", color: "#333" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p style={{ fontSize: "14px", color: "#333" }}>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum.
                </p>
                <div className="d-flex gap-2 mt-3">
                  <Button variant="primary">Find your car now</Button>
                  <Button variant="secondary">Learn more</Button>
                </div>
              </Col>
              <Col md={4}>
                <Image
                  src={AboutUsImage}
                  alt="Car"
                  className={style.aboutUsImage}
                />
              </Col>
              <Col md={1} />
            </Row>
          </Container>
        </Col>
        <Col md={2} />
      </Row>
      <div className={style.ourServices}>
        <div className="container my-4 d-flex align-items-center justify-content-center">
          <h1>Our Services :</h1>
        </div>
        <Row className="mx-2">
          {infoData.map((info, index) => (
            <Col key={index} lg={3} md={6} className="my-3">
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
