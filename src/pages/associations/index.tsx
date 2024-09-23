import React from "react";
import style from "./associations.module.scss";
import WaveHeader from "@/components/waveHeader/WaveHeader";
import { Col, Container, Row } from "react-bootstrap";

const HomePage: React.FC = () => {
  const data = [
    {
      title: "Association Guadeloupèenne de réeducation pelvi-périnéale",
      desc: "AGRPP impasse Clara Dampierre 97190 Le GOSIER",
      mail: "Agrpp971@gmail.com",
    },
    {
      title: "Association Guadeloupéenne de Gynécologie Obstétrique",
      desc: "AGGO 97190 Le GOSIER",
      mail: "random@gmail.com",
    },
    {
      title: "Association Guadeloupéenne de Gynécologie Obstétrique",
      desc: "AGGO 97190 Le GOSIER",
      mail: "random@gmail.com",
    },
    {
      title: "Association Guadeloupéenne de Gynécologie Obstétrique",
      desc: "AGGO 97190 Le GOSIER",
      mail: "random@gmail.com",
    },
    {
      title: "Association Guadeloupéenne de Gynécologie Obstétrique",
      desc: "AGGO 97190 Le GOSIER",
      mail: "random@gmail.com",
    },
    {
      title: "Association Guadeloupéenne de Gynécologie Obstétrique",
      desc: "AGGO 97190 Le GOSIER",
      mail: "random@gmail.com",
    },
    {
      title: "Association Guadeloupéenne de Gynécologie Obstétrique",
      desc: "AGGO 97190 Le GOSIER",
      mail: "random@gmail.com",
    },
    {
      title: "Association Guadeloupéenne de Gynécologie Obstétrique",
      desc: "AGGO 97190 Le GOSIER",
      mail: "random@gmail.com",
    },
    {
      title: "Association Guadeloupéenne de Gynécologie Obstétrique",
      desc: "AGGO 97190 Le GOSIER",
      mail: "random@gmail.com",
    },
  ];

  return (
    <div>
      <WaveHeader />
      <Container>
        <Row>
          {data.map((e, index) => (
            <Col lg="4" md="12" key={index} className="py-4">
              <div className={style.card}>
                <h2 className={style.cardTitle}>{e.title}</h2>
                <p className={style.cardText}>{e.desc}</p>
                {e.mail && <p className={style.cardText}>mail : {e.mail}</p>}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default function Page() {
  return <HomePage />;
}
