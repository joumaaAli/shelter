import { filterHouses } from "@/services/house";
import { reportHouse } from "@/services/report";
import { House } from "@/types/models";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import style from "./houses.module.scss";
import { Region } from "@/types/models";
import tableStyle from "@/styles/tableStyle";
import {CloseButton, OverlayTrigger, Tooltip} from "react-bootstrap";
import { Col, Row, Spinner, Button, Modal, Form } from "react-bootstrap";
import styles from "@/components/Navbar/Navbar.module.scss";

const PublicHousesPage = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [filterSpace, setFilterSpace] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchAddress);
  const [debouncedFilterSpace, setDebouncedFilterSpace] = useState<
    number | null
  >(filterSpace);
  const [free, setFree] = useState<boolean>(true);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchAddress(debouncedSearch);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterSpace(debouncedFilterSpace);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedFilterSpace]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await filterHouses(
        searchAddress,
        filterSpace || undefined,
        selectedRegion || undefined,
        free
      );
      const validatedHouses = data?.data?.filter(
        (house: House) => house?.validated
      );
      setHouses(validatedHouses);
      setLoading(false);
    };

    fetchData();
  }, [searchAddress, filterSpace, selectedRegion, free]);

  useEffect(() => {
    async function fetchRegions() {
      const response = await fetch("/api/regions");
      const regionData = await response.json();
      setRegions(regionData);
    }

    fetchRegions();
  }, []);

  const handleReportHouse = async () => {
    if (!selectedHouseId || !reportMessage) return;
    await reportHouse({
      houseId: selectedHouseId,
      message: reportMessage,
    });
    handleClose();
    setReportMessage("");
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
          const cleanedPhoneNumber = row.phoneNumber.replace(/\s+/g, ""); // Remove spaces
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
      name: "بالمجان",
      selector: (row: any) => (row.free ? "نعم" : "لا"),
      sortable: true,
    },
    {
      name: "السعر",
      selector: (row: any) => (row.price ? `${row.price} $` : "X"),
      sortable: true,
    },
    {
      name: "معلومات إضافية",
      selector: (row: any) => {
        const info = row.additionnalInformation || "";
        return (
          <>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${row.id}`}>
                  {info || "لا توجد معلومات إضافية"}
                </Tooltip>
              }
            >
              <span style={{ cursor: info ? "pointer" : "default" }}>
                {info.length > 20 ? `${info.slice(0, 20)}...` : info}
              </span>
            </OverlayTrigger>
          </>
        );
      },
      sortable: true,
    },
    {
      name: "المنطقة",
      selector: (row: any) => row.region?.name || "",
      sortable: true,
    },
    {
      name: "المساحة المتاحة للأشخاص",
      selector: (row: any) => row.spaceForPeople || "",
      sortable: true,
    },

    {
      name: "الإجراءات",
      minWidth: "150px",
      cell: (row: any) => (
            <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setSelectedHouseId(row.id);
                  handleShow();
                }}
            >
              الإبلاغ عن المنزل
            </Button>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column p-4">
      <h1 className="w-100 text-align-center my-4">المنازل</h1>
      <Row className="w-100 d-flex justify-content-start align-items-center">
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="text"
            placeholder="ابحث بالعناوين"
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            className="w-100 my-2 pr-0"
            disabled={loading}
          />
        </Col>
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="number"
            placeholder="ابحث بالمساحة المتاحة للأشخاص"
            value={debouncedFilterSpace || ""}
            onChange={(e) =>
              setDebouncedFilterSpace(parseInt(e.target.value) || null)
            }
            className="w-100 my-2"
            disabled={loading}
          />
        </Col>
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="select"
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(Number(e.target.value) || null)}
            disabled={loading}
          >
            <option value="">ابحث بالمنطقة</option>
            {regions?.map((region: Region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Input>
        </Col>
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="checkbox"
            checked={free}
            onChange={(e) => setFree(e.target.checked)}
            disabled={loading}
          />
          <label className="mx-2">ابحث عن منازل مجانية</label>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center w-100 my-4">
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
        </div>
      ) : (
        <DataTable
          className={style.houseTable}
          columns={columns}
          data={houses}
          highlightOnHover
          pointerOnHover
          paginationPerPage={20}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          noDataComponent="لم يتم العثور على أيَة منازل"
          customStyles={tableStyle}
        />
      )}
      <Modal show={showModal} onHide={() => handleClose()} className={style.modal}>
        <Modal.Header className={style.modalHeader}>
          <Modal.Title>الإبلاغ عن المنزل</Modal.Title>
          <CloseButton onClick={handleClose} aria-label="Hide" className={styles.closeButton} />
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="reportMessage">
            <Form.Label>الرسالة</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className={style.modalFooter}>
          <Button variant="secondary" onClick={handleReportHouse}>
            إرسال
          </Button>
          <Button variant="danger" onClick={() => handleClose()}>
            إلغاء
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PublicHousesPage;
