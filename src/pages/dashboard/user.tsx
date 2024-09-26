import House from "@/components/user-dashboard/House/House";
import ServiceUserDashboard from "@/components/user-dashboard/Service/Service";
import { requireAuthentication } from "@/layouts/layout";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import style from "./admin.module.scss";

const UserDashboardPage = () => {
  const [activePage, setActivePage] = useState(0);
  const tabs = [
    {id: 0, label: "منازل", component: <House/>},
    {id: 1, label: "خدمات", component: <ServiceUserDashboard/>},
  ];

  return (
      <Container fluid>
        <Tabs
            activeKey={activePage}
            onSelect={(k) => setActivePage(Number(k))}
            className={`mb-3 ${style["tabs-container"]}`}
            justify
        >
          {tabs.map((tab) => (
              <Tab eventKey={tab.id} title={tab.label} key={tab.id} className={style["tab"]}>
                {tab.component}
              </Tab>
          ))}
        </Tabs>
      </Container>
  );
};

export default UserDashboardPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await requireAuthentication(context);
};
