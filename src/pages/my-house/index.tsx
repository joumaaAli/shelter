import { useState, useEffect } from "react";
import {
  fetchHouses,
  addHouse,
  updateHouse,
  deleteHouse,
  // Fetch regions service
} from "@/services/house";
import { fetchRegions } from "@/services/region";
import { House as HouseType } from "@/types/models";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import Swal from "sweetalert2";
import { requireAuthentication } from "@/layouts/layout";
import { GetServerSideProps } from "next";
import style from "./my-house.module.scss";

const MyHousesPage = () => {
  const [houses, setHouses] = useState<HouseType[]>([]);
  const [regions, setRegions] = useState<any[]>([]); // State for regions
  const [search, setSearch] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<HouseType | null>(null);
  const [modalShow, setModalShow] = useState(false);

  const fetchUserHouses = async () => {
    const response = await fetchHouses(search);
    if (response.success) {
      setHouses(response.data);
    } else {
      console.error("Failed to fetch houses:", response.error);
    }
  };

  useEffect(() => {
    fetchUserHouses();
    const fetchRegionsData = async () => {
      const response = await fetchRegions();
      if (response.success) {
        setRegions(response.data);
      } else {
        console.error("Failed to fetch regions:", response.error);
      }
    };
    fetchRegionsData();
  }, [search]);

  const handleAddOrUpdateHouse = async (e: any) => {
    e.preventDefault();
    const houseData = {
      name: e.target.name.value,
      address: e.target.address.value,
      phoneNumber: e.target.phoneNumber.value,
      spaceForPeople: e.target.spaceForPeople.value,
      additionnalInformation: e.target.additionnalInformation.value,
      taken: e.target.taken.checked,
      regionId: e.target.region.value, // Capture selected region ID
      id: selectedHouse?.id,
      region: regions.find(
        (region) => region.id === Number(e.target.region.value)
      ),
    };

    if (selectedHouse) {
      await updateHouse(houseData as HouseType);
      Swal.fire({
        title: "Success!",
        text: "House updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      await addHouse(houseData);
      Swal.fire({
        title: "Success!",
        text: "House added successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    }

    setModalShow(false);
    setSelectedHouse(null);
    await fetchUserHouses();
  };

  const handleDeleteHouse = async (id: number) => {
    await deleteHouse(id);
    Swal.fire({
      title: "Success!",
      text: "House deleted successfully",
      icon: "success",
      confirmButtonText: "OK",
    });
    await fetchUserHouses();
  };

  const columns = [
    {
      name: "Name",
      selector: (row: HouseType) => row.name || "",
      sortable: true,
    },
    {
      name: "Address",
      selector: (row: HouseType) => row.address || "",
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row: HouseType) => row.phoneNumber || "",
      sortable: true,
    },
    {
      name: "Space For People",
      selector: (row: HouseType) => row.spaceForPeople || "",
      sortable: true,
    },
    {
      name: "Taken",
      selector: (row: HouseType) => (row.taken ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      minWidth: "400px",
      cell: (row: HouseType) => (
        <Row className="w-100">
          <Col>
            <Button
              onClick={() => {
                setSelectedHouse(row);
                setModalShow(true);
              }}
              variant="secondary"
              size="sm"
            >
              Edit
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              onClick={() => handleDeleteHouse(row.id)}
              size="sm"
            >
              Delete
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Container className={style.wrapper}>
      <h1 className="text-align-center my-4">My Houses</h1>
      <Row className="w-100 d-flex justify-content-start align-items-center">
        <Col lg="6" md="6" className="mx-0" sm="12">
          <Input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col lg="6" md="6" className="mx-0 mb-2" sm="12">
          <Button
            onClick={() => {
              setSelectedHouse(null);
              setModalShow(true);
            }}
            className="w-100"
            variant="primary"
          >
            Add House
          </Button>
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={houses}
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        noDataComponent="No houses found"
      />
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedHouse ? "Edit House" : "Add House"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddOrUpdateHouse}>
            <Form.Group className="my-1" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.name || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.address || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.phoneNumber || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="spaceForPeople">
              <Form.Label>Space For People</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.spaceForPeople || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="additionnalInformation">
              <Form.Label>Additional Information</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.additionnalInformation || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="taken">
              <Form.Check
                type="checkbox"
                label="Taken"
                defaultChecked={selectedHouse?.taken || false}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="region">
              <Form.Label>Select Region</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedHouse?.region?.id || ""}
              >
                <option value="">Select a region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="my-2">
              {selectedHouse ? "Save Changes" : "Add House"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyHousesPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await requireAuthentication(context);
};
