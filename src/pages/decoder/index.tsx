import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

interface VinData {
  Variable: string;
  Value: string;
}

const VinDecoder = () => {
  const [vin, setVin] = useState("");
  const [carInfo, setCarInfo] = useState<VinData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Define relevant fields
  const relevantFields = [
    "Make",
    "Model",
    "Model Year",
    "Body Class",
    "Manufacturer Name",
    "Fuel Type - Primary",
    "Transmission Style",
  ];

  const handleDecodeVin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vin) {
      setError("Please enter a VIN");
      return;
    }

    setLoading(true);
    setError("");
    setCarInfo([]);

    try {
      const response = await fetch(`/api/decode-vin?vin=${vin}`);
      const data = await response.json();

      // Filter only relevant fields
      const filteredData = data.Results.filter((item: VinData) =>
        relevantFields.includes(item.Variable)
      );

      if (filteredData.length > 0) {
        setCarInfo(filteredData);
      } else {
        setError("No relevant information found for the provided VIN.");
      }
    } catch (err) {
      setError("Failed to fetch car information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center my-4">
        <Col md={6}>
          <h2>VIN Decoder</h2>
          <Form onSubmit={handleDecodeVin}>
            <Form.Group controlId="vin">
              <Form.Label>Enter VIN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter vehicle VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              disabled={loading}
            >
              {loading ? "Decoding..." : "Decode VIN"}
            </Button>
          </Form>

          {error && <p className="text-danger mt-3">{error}</p>}

          {carInfo.length > 0 && (
            <div className="mt-4">
              <h4>Car Information</h4>
              <ul>
                {carInfo.map((item, index) => (
                  <li key={index}>
                    {item.Variable}: {item.Value || "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VinDecoder;

//content in german
// remove members from the
