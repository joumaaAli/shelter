import { useState, useEffect } from "react";
import {
  fetchHouses,
  addHouse,
  updateHouse,
  deleteHouse,
} from "@/services/house"; // إضافة الخدمات للتعامل مع المنازل
import { House as HouseType } from "@/types/models";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import Swal from "sweetalert2";

const HomePage = () => {
  const [homes, setHomes] = useState<HouseType[]>([]);
  const [search, setSearch] = useState("");
  const [selectedHome, setSelectedHome] = useState<HouseType | null>(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetchHouses(search).then((data: any) => {
      setHomes(data.data);
    });
  }, [search]);

  const handleAddHome = async (e: any) => {
    e.preventDefault();
    const newHome = {
      name: e.target.name.value,
      address: e.target.address.value,
      phoneNumber: e.target.phoneNumber.value,
      spaceForPeople: e.target.spaceForPeople.value,
      additionnalInformation: e.target.additionnalInformation.value,
    };
    await addHouse(newHome);
    setModalShow(false);
    await fetchHouses(search).then((data) => setHomes(data.data));
  };

  const handleDeleteHome = async (id: number) => {
    await deleteHouse(id);
    Swal.fire({
      title: "نجاح!",
      text: "تم حذف المنزل بنجاح",
      icon: "success",
      confirmButtonText: "حسناً",
    });
    await fetchHouses(search).then((data) => setHomes(data.data));
  };

  const columns = [
    {
      name: "الاسم",
      selector: (row: HouseType) => row.name || "",
      sortable: true,
    },
    {
      name: "العنوان",
      selector: (row: HouseType) => row.address || "",
      sortable: true,
    },
    {
      name: "رقم الهاتف",
      selector: (row: HouseType) => row.phoneNumber || "",
      sortable: true,
    },
    {
      name: "المساحة المتاحة للأشخاص",
      selector: (row: HouseType) => row.spaceForPeople || "",
      sortable: true,
    },
    {
      name: "الإجراءات",
      button: true,
      minWidth: "400px",
      cell: (row: HouseType) => (
        <Row className="w-100">
          <Col>
            <Button
              onClick={() => {
                setSelectedHome(row);
                setModalShow(true);
              }}
              variant="secondary"
              size="sm"
            >
              تعديل
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              onClick={() => handleDeleteHome(row.id)}
              size="sm"
            >
              حذف
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column">
      <h1 className="text-align-center my-4">المنازل</h1>
      <Row className="w-100 d-flex justify-content-start align-items-center">
        <Col lg="6" md="6" className="mx-0" sm="12">
          <Input
            type="text"
            placeholder="البحث بالاسم"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col lg="6" md="6" className="mx-0 mb-2" sm="12">
          <Button
            onClick={() => setModalShow(true)}
            className="w-100"
            variant="primary"
          >
            إضافة منزل
          </Button>
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={homes}
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        noDataComponent="لم يتم العثور على أي منازل"
      />
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedHome ? "تعديل المنزل" : "إضافة منزل"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddHome}>
            <Form.Group className="my-1" controlId="name">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.name || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="address">
              <Form.Label>العنوان</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.address || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="phoneNumber">
              <Form.Label>رقم الهاتف</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.phoneNumber || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="spaceForPeople">
              <Form.Label>المساحة المتاحة للأشخاص</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.spaceForPeople || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="additionnalInformation">
              <Form.Label>معلومات إضافية</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.additionnalInformation || ""}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="my-2">
              {selectedHome ? "حفظ التعديلات" : "إضافة منزل"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HomePage;
