import { fetchShelters, addShelter, deleteShelter } from "@/services/shelter";
import { fetchRegions } from "@/services/region"; // You need to implement this service
import { useState, useEffect } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

const SheltersPage = () => {
  const [shelters, setShelters] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]); // To store regions
  const [modalShow, setModalShow] = useState(false);
  const [newShelterName, setNewShelterName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null); // For selected region

  const fetchAllShelters = async () => {
    const response = await fetchShelters();
    if (response.success) {
      setShelters(response.data);
    } else {
      console.error("Failed to fetch shelters:", response.error);
    }
  };

  const fetchAllRegions = async () => {
    const response = await fetchRegions();
    if (response.success) {
      setRegions(response.data);
    } else {
      console.error("Failed to fetch regions:", response.error);
    }
  };

  useEffect(() => {
    fetchAllShelters();
    fetchAllRegions(); // Fetch regions on mount
  }, []);

  const handleAddShelter = async (e: any) => {
    e.preventDefault();
    const response = await addShelter(newShelterName, selectedRegion);
    if (response.success) {
      Swal.fire({
        title: "Success!",
        text: "Shelter added successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      setModalShow(false);
      fetchAllShelters();
    } else {
      console.error("Failed to add shelter:", response.error);
    }
  };

  const handleDeleteShelter = async (id: number) => {
    const response = await deleteShelter(id);
    if (response.success) {
      Swal.fire({
        title: "Success!",
        text: "Shelter deleted successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      fetchAllShelters();
    } else {
      console.error("Failed to delete shelter:", response.error);
    }
  };

  const columns = [
    {
      name: "Shelter Name",
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "Region",
      selector: (row: any) => row.region?.name || "No region", // Display region
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: (row: any) => (
        <Button variant="danger" onClick={() => handleDeleteShelter(row.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Container fluid>
      <Row className="my-4">
        <Col>
          <Button onClick={() => setModalShow(true)}>Add Shelter</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable columns={columns} data={shelters} />
        </Col>
      </Row>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Shelter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddShelter}>
            <Form.Group controlId="shelterName">
              <Form.Label>Shelter Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter shelter name"
                value={newShelterName}
                onChange={(e) => setNewShelterName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="regionSelect">
              <Form.Label>Select Region</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedRegion(Number(e.target.value))}
              >
                <option value="">Select a region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Shelter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SheltersPage;
