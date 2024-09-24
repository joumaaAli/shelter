import { useState, useEffect } from "react";
import {
  fetchHouses,
  addHouse,
  updateHouse,
  deleteHouse,
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
import tableStyle from "@/styles/tableStyle";

const MyHousesPage = () => {
  const [houses, setHouses] = useState<HouseType[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string | null>(null); // Region filter state
  const [selectedHouse, setSelectedHouse] = useState<HouseType | null>(null);
  const [modalShow, setModalShow] = useState(false);

  const fetchUserHousesData = async () => {
    const response = await fetchHouses(
      search,
      regionFilter ? parseInt(regionFilter) : undefined
    );
    if (response.success) {
      setHouses(response.data);
    } else {
      console.error("Failed to fetch houses:", response.error);
    }
  };

  useEffect(() => {
    fetchUserHousesData();
    const fetchRegionsData = async () => {
      const response = await fetchRegions();
      if (response.success) {
        setRegions(response.data);
      } else {
        console.error("Failed to fetch regions:", response.error);
      }
    };
    fetchRegionsData();
  }, [search, regionFilter]);

  const handleAddOrUpdateHouse = async (e: any) => {
    e.preventDefault();
    const houseData: any = {
      name: e.target.name.value,
      address: e.target.address.value,
      phoneNumber: e.target.phoneNumber.value,
      spaceForPeople: parseInt(e.target.spaceForPeople.value),
      additionalInformation: e.target.additionalInformation.value,
      taken: e.target.taken.checked,
      regionId: e.target.region.value ? parseInt(e.target.region.value) : null,
    };

    if (selectedHouse) {
      houseData.id = selectedHouse.id;
    }

    const response = selectedHouse
      ? await updateHouse(houseData as HouseType)
      : await addHouse(houseData);

    if (response.success) {
      Swal.fire({
        title: "Success!",
        text: selectedHouse
          ? "House updated successfully"
          : "House added successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: selectedHouse ? "Failed to update house" : "Failed to add house",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    setModalShow(false);
    setSelectedHouse(null);
    await fetchUserHousesData();
  };

  const handleDeleteHouse = async (id: number) => {
    const response = await deleteHouse(id);
    if (response.success) {
      Swal.fire({
        title: "Success!",
        text: "House deleted successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      await fetchUserHousesData();
    } else {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete house",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleToggleTaken = async (house: HouseType) => {
    const updatedHouse = { ...house, taken: !house.taken };
    const response = await updateHouse(updatedHouse);

    if (response.success) {
      Swal.fire({
        title: "Success!",
        text: `House marked as ${updatedHouse.taken ? "taken" : "available"}`,
        icon: "success",
        confirmButtonText: "OK",
      });
      await fetchUserHousesData();
    } else {
      Swal.fire({
        title: "Error!",
        text: "Failed to update house status",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const columns = [
    {
      name: "العنوان",
      selector: (row: any) => row.address || "",
      sortable: true,
    },
    {
      name: "المنطقة",
      selector: (row: any) => row.region?.name || "",
      sortable: true,
    },
    {
      name: "عدد الأشخاص",
      selector: (row: any) => row.spaceForPeople || "",
      sortable: true,
    },
    {
      name: "مأخوذ",
      selector: (row: any) => (row.taken ? "نعم" : "كلا"),
      sortable: true,
    },
    {
      name: "رقم الهاتف",
      selector: (row: any) => row.phoneNumber || "",
      sortable: true,
    },
    {
      name: "",
      button: true,
      minWidth: "400px",
      cell: (row: HouseType) => (
        <Row className="w-100">
          <Col className={style.tableRow}>
            <Button
              onClick={() => {
                setSelectedHouse(row);
                setModalShow(true);
              }}
              variant="secondary"
              size="sm"
            >
              تعديل
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteHouse(row.id)}
              size="sm"
            >
              إلغاء
            </Button>
            <Button
              variant={row.taken ? "warning" : "success"}
              onClick={() => handleToggleTaken(row)}
              size="sm"
            >
              {row.taken ? "متاح" : "تم الحجز"}
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column p-4">
      <h1 className="w-100 text-align-center my-4">منازلي</h1>
      <Row className={style.customRow}>
        <Col sm={6} xs={6} className={"p-0"}>
          <Input
            type="text"
            placeholder="ابحث بالعنوان"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col sm={4} xs={6} className={"p-0"}>
          <Form.Control
            as="select"
            value={regionFilter || ""}
            onChange={(e) => setRegionFilter(e.target.value || null)}
            className="w-100 my-2"
          >
            <option value="">كل المناطق</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col sm={2} xs={6} className={style.customButton}>
          <Button
            onClick={() => {
              setSelectedHouse(null);
              setModalShow(true);
            }}
            variant="secondary"
          >
            أضف منزل
          </Button>
        </Col>
      </Row>
      <DataTable
        className={style.houseTable}
        columns={columns}
        data={houses}
        highlightOnHover
        pointerOnHover
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        noDataComponent="لم يتم العثور على أي منازل"
        customStyles={tableStyle}
      />
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedHouse ? "Edit House" : "Add House"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddOrUpdateHouse}>
            {/* Your form fields */}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyHousesPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await requireAuthentication(context);
};
