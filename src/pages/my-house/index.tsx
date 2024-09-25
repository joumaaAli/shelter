import { useState, useEffect } from "react";
import {
  fetchHouses,
  addHouse,
  updateHouse,
  deleteHouse,
} from "@/services/house";
import { fetchRegions } from "@/services/region";
import { House as HouseType } from "@/types/models";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import Swal from "sweetalert2";
import style from "./my-house.module.scss";
import tableStyle from "@/styles/tableStyle";
import { GetServerSideProps } from "next";
import { requireAuthentication } from "@/layouts/layout";
import { Region } from "@/utils/interfaces/region";

const MyHousesPage = () => {
  const [houses, setHouses] = useState<HouseType[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<HouseType | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [formLoading, setFormLoading] = useState(false); // Loading state for form submission

  const fetchUserHousesData = async () => {
    setLoading(true); // Start loading
    const response = await fetchHouses(
      search,
      regionFilter ? parseInt(regionFilter) : undefined
    );
    if (response.success) {
      setHouses(response.data);
    } else {
      console.error("Failed to fetch houses:", response.error);
    }
    setLoading(false); // Stop loading
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
    setFormLoading(true); // Start form loading
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
        title: "نجاح!",
        text: selectedHouse ? "تم تعديل المنزل بنجاح" : "تم إضافة المنزل بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
      });
    } else {
      Swal.fire({
        title: "خطأ!",
        text: selectedHouse ? "فشل في تعديل المنزل" : "فشل في إضافة المنزل",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }

    setModalShow(false);
    setSelectedHouse(null);
    await fetchUserHousesData();
    setFormLoading(false);
  };

  const handleDeleteHouse = async (id: number) => {
    const response = await deleteHouse(id);
    if (response.success) {
      Swal.fire({
        title: "نجاح!",
        text: "تم حذف المنزل بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
      });
      await fetchUserHousesData();
    } else {
      Swal.fire({
        title: "خطأ!",
        text: "فشل في حذف المنزل",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
  };

  const handleToggleTaken = async (house: HouseType) => {
    const updatedHouse = { ...house, taken: !house.taken };
    const response = await updateHouse(updatedHouse);

    if (response.success) {
      Swal.fire({
        title: "نجاح!",
        text: `تم ${updatedHouse.taken ? "حجز" : "إلغاء حجز"} المنزل`,
        icon: "success",
        confirmButtonText: "حسناً",
      });
      await fetchUserHousesData();
    } else {
      Swal.fire({
        title: "خطأ!",
        text: "فشل في تحديث حالة المنزل",
        icon: "error",
        confirmButtonText: "حسناً",
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
      selector: (row: any) => row?.name || "",
      sortable: true,
    },
    {
      name: "معلومات إضافية",
      selector: (row: any) => row.additionalInformation || "",
      sortable: true,
    },
    {
      name: "عدد الأشخاص",
      selector: (row: any) => row.spaceForPeople || "",
      sortable: true,
    },
    {
      name: "تم الحجز",
      selector: (row: any) => (row.taken ? "نعم" : "لا"),
      sortable: true,
    },
    {
      name: "رقم الهاتف",
      selector: (row: any) => {
        if (row?.phoneNumber) {
          const cleanedPhoneNumber = row.phoneNumber.replace(/\s+/g, "");
          const lebanonPhoneNumber = `+961${
            cleanedPhoneNumber.startsWith("0")
              ? cleanedPhoneNumber.slice(1)
              : cleanedPhoneNumber
          }`;

          return (
            <a
              href={`https://wa.me/${lebanonPhoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                direction: "ltr",
                unicodeBidi: "embed",
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
      name: "الإجراءات",
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
              حذف
            </Button>
            <Button
              variant={row.taken ? "success" : "warning"}
              onClick={() => handleToggleTaken(row)}
              size="sm"
            >
              {row.taken ? "تم الحجز" : "متاح"}
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column p-4">
      <h1 className="w-100 text-align-center my-4">منازلي</h1>
      <p>
        يمكنك إضافة منزل عبر الضغط على زر "أضف منزل". في حال أردت تعديل معلوماتك
        إضغط على زر "تعديل". في حال الإلغاء إضغط على زر "حذف". عند إضافتك
        المنزل، في حال لم يتم حجزه بعد، سيظهر على أنّه متاح. عند حجزه، يمكنك
        تغيير حاله عبر الضغط على زر متاح و سيتغيّر إلى تم الحجز. في حال أردت
        التعديل مرة أخرى، كرّر نفس الخطوات وستتغيّر حالةالمنزل.
      </p>
      <Row className={style.customRow}>
        <Col sm={6} xs={12} className={"p-0"}>
          <Input
            type="text"
            placeholder="ابحث بالعنوان"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col sm={4} xs={6} className={style.customColumn}>
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
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      ) : (
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
      )}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedHouse ? "تعديل المنزل" : "إضافة منزل"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddOrUpdateHouse}>
            <Form.Group className="my-1" controlId="name">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.name || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="address">
              <Form.Label>العنوان</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.address || ""}
                required
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="phoneNumber">
              <Form.Label>رقم الهاتف</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.phoneNumber || ""}
                required
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="spaceForPeople">
              <Form.Label>عدد الأشخاص</Form.Label>
              <Form.Control
                type="number"
                defaultValue={selectedHouse?.spaceForPeople || ""}
                min="1"
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="additionalInformation">
              <Form.Label>معلومات إضافية</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedHouse?.additionnalInformation || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="taken">
              <Form.Check
                type="checkbox"
                label="متاح"
                defaultChecked={selectedHouse?.taken || false}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="region">
              <Form.Label>كل المناطق</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedHouse?.regionId || ""}
                required
              >
                <option value="">كل المناطق</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="my-2"
              disabled={formLoading} // Disable button during form loading
            >
              {formLoading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : selectedHouse ? (
                "حفظ التعديلات"
              ) : (
                "إضافة منزل"
              )}
            </Button>
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
