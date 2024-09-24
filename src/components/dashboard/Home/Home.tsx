import { useState, useEffect } from "react";
import {
  fetchHouses,
  addHouse,
  updateHouse,
  deleteHouse,
} from "@/services/house";
import { fetchRegions } from "@/services/region";
import { House as HouseType } from "@/types/models";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import Swal from "sweetalert2";

const HomePage = () => {
  const [homes, setHomes] = useState<HouseType[]>([]);
  const [regions, setRegions] = useState<any[]>([]); // State for regions
  const [search, setSearch] = useState("");
  const [selectedHome, setSelectedHome] = useState<HouseType | null>(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetchHouses(search).then((data: any) => {
      setHomes(data.data);
    });

    async function fetchRegionsData() {
      const response = await fetchRegions();
      setRegions(response.data);
    }

    fetchRegionsData();
  }, [search]);

  const handleAddOrEditHome = async (e: any) => {
    e.preventDefault();
    const homeData: any = {
      name: e.target.name.value,
      address: e.target.address.value,
      phoneNumber: e.target.phoneNumber.value,
      spaceForPeople: e.target.spaceForPeople.value,
      additionalInformation: e.target.additionalInformation.value,
      taken: e.target.taken.checked, // Updated line
      regionId: e.target.region.value, // Capture selected region ID
      region: null,
    };

    if (selectedHome) {
      // Only include 'id' when editing an existing house
      homeData.id = selectedHome.id;
    }

    if (selectedHome) {
      // Editing an existing house
      await updateHouse(homeData);
      Swal.fire({
        title: "تم التحديث!",
        text: "تم تعديل المنزل بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
      });
    } else {
      // Adding a new house
      await addHouse(homeData);
      Swal.fire({
        title: "تمت الإضافة!",
        text: "تم إضافة المنزل بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
      });
    }

    setModalShow(false);
    setSelectedHome(null); // Clear selection after submission
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
      selector: (row: any) => row.name || "",
      sortable: true,
    },
    {
      name: "العنوان",
      selector: (row: any) => row.address || "",
      sortable: true,
    },
    {
      name: "رقم الهاتف",
      selector: (row: any) => {
        if (row?.phoneNumber) {
          // Remove spaces and add +961 prefix
          const cleanedPhoneNumber = row.phoneNumber.replace(/\s+/g, ""); // Remove any spaces
          const lebanonPhoneNumber = `+961${
            cleanedPhoneNumber.startsWith("0")
              ? cleanedPhoneNumber.slice(1)
              : cleanedPhoneNumber
          }`; // Add +961 prefix, removing the leading zero if it exists

          return (
            <a
              href={`https://wa.me/${lebanonPhoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                direction: "ltr", // Ensure the phone number is displayed LTR
                unicodeBidi: "embed", // Embed LTR context to avoid mixing with RTL
                textAlign: "left",
                margin: 0,
                color: "#007bff",
                textDecoration: "none",
              }}
            >
              {row.phoneNumber}
            </a>
          );
        } else {
          return "";
        }
      },
      sortable: true,
    },
    {
      name: "المساحة المتاحة للأشخاص",
      selector: (row: any) => row.spaceForPeople || "",
      sortable: true,
    },
    {
      name: "تم الحجز",
      selector: (row: any) => (row.taken ? "نعم" : "لا"),
      sortable: true,
    },
    {
      name: "المنطقة",
      selector: (row: any) => row.region?.name || "",
      sortable: true,
    },
    {
      name: "الإجراءات",
      button: true,
      minWidth: "400px",
      cell: (row: any) => (
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
        paginationPerPage={10}
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
          <Form onSubmit={handleAddOrEditHome}>
            <Form.Group className="my-1" controlId="name">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.name || ""}
                required
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="address">
              <Form.Label>العنوان</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.address || ""}
                required
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="phoneNumber">
              <Form.Label>رقم الهاتف</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.phoneNumber || ""}
                required
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="spaceForPeople">
              <Form.Label>المساحة المتاحة للأشخاص</Form.Label>
              <Form.Control
                type="number"
                defaultValue={selectedHome?.spaceForPeople || ""}
                min="1"
                required
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="additionalInformation">
              <Form.Label>معلومات إضافية</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHome?.additionnalInformation || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="region">
              <Form.Label>اختر المنطقة</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedHome?.regionId || ""}
                required
              >
                <option value="">اختر المنطقة</option>
                {regions?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="my-1" controlId="taken">
              <Form.Check
                type="checkbox"
                label="تم الحجز"
                defaultChecked={selectedHome?.taken || false}
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
