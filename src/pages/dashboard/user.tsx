import House from "@/components/user-dashboard/House/House";
import { requireAuthentication } from "@/layouts/layout";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./admin.module.scss";

const UserDashboardPage = () => {
  const [activePage, setActivePage] = useState(0);
  const tabs = [{ id: 0, label: "منازل" }];
  // Function to render the selected component

  const renderComponent = () => {
    switch (activePage) {
      case 0:
        return <House />;

      default:
        return <House />;
    }
  };
  return (
    <Container fluid>
      <Row>
        <Col lg={2} md={4} sm={12}>
          <div className={styles["tabs"]}>
            {tabs.map((tab) => (
              <div
                key={tab?.id}
                onClick={() => setActivePage(tab?.id)}
                className={`${styles["tab-item"]} ${
                  activePage === tab?.id ? styles["active"] : ""
                }`}
              >
                <h1 className={styles["tab-item-text"]}>{tab.label}</h1>
              </div>
            ))}
          </div>
        </Col>
        <Col lg={10} md={8} sm={12}>
          <div className="p-4">{renderComponent()}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboardPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await requireAuthentication(context);
};
