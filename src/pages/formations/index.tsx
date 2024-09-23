import React, { useEffect, useState } from "react";
import { FormationType } from "@/types/models";
import { Col, Row, Spinner } from "react-bootstrap";
import FormationCard from "@/components/Formation/FormationCard";
import moment from "moment";
import { fetchFormations } from "@/services/formation";

const Formation: React.FC = () => {
  const [formations, setFormations] = useState<FormationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFormations = async () => {
      try {
        const response = await fetchFormations();
        const data = response?.data.map((formation: FormationType) => ({
          ...formation,
          startDate: moment(formation.startDate),
          endDate: moment(formation.endDate),
        }));
        setFormations(data);
      } catch (error) {
        console.error("Error loading formations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFormations();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="title py-4">Formations</h1>
      {loading ? (
        // Spinner centered in the middle of the page
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row>
          {formations.map((formation) => (
            <Col
              key={formation.id}
              md={6}
              lg={4}
              className="mb-4 d-flex justify-content-center"
              sm={12}
              xs={12}
            >
              <FormationCard
                id={formation.id}
                theme={formation.theme}
                startDate={formation.startDate}
                endDate={formation.endDate}
                location={formation.location}
                organism={formation.organism}
                phoneNumber={formation.phoneNumber}
                email={formation.email}
                profileImg={formation.profileImg}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Formation;
