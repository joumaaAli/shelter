import { useEffect, useState } from "react";
import { filterServices } from "@/services/service";
import { reportService } from "@/services/report";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import { Col, Row, Spinner, Button, Modal, Form } from "react-bootstrap";
import { Region } from "@/types/models";
import { fetchSubcategories } from "@/services/cateogires";

const PublicServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await filterServices(
        search,
        selectedRegion || undefined,
        selectedSubcategory || undefined
      );
      setServices(data.data || []);
      setLoading(false);
    };

    fetchData();
  }, [search, selectedRegion, selectedSubcategory]);

  useEffect(() => {
    async function fetchRegions() {
      const response = await fetch("/api/regions");
      const regionData = await response.json();
      setRegions(regionData);
    }

    async function loadSubcategories() {
      const response = await fetchSubcategories(1);
      setSubcategories(response.data);
    }
    loadSubcategories();
    fetchRegions();
  }, []);

  const handleReportService = async () => {
    if (!selectedServiceId || !reportMessage) return;
    await reportService({
      serviceId: selectedServiceId,
      message: reportMessage,
    });
    setShowModal(false);
    setReportMessage("");
  };

  const columns = [
    { name: "الاسم", selector: (row: any) => row.name || "", sortable: true },
    {
      name: "رقم الهاتف",
      selector: (row: any) => row.phoneNumber || "",
      sortable: true,
    },
    {
      name: "المنطقة",
      selector: (row: any) => row.region?.name || "",
      sortable: true,
    },
    {
      name: "الفئة",
      selector: (row: any) => row.subcategory?.name || "",
      sortable: true,
    },
    {
      name: "التحقق",
      selector: (row: any) => (row.validated ? "تم التحقق" : "لم يتم التحقق"),
      sortable: true,
    },
    {
      name: "الوصف",
      selector: (row: any) => row.description || "",
      sortable: true,
    },
    {
      name: "إجراءات",
      minWidth: "200px",
      cell: (row: any) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            setSelectedServiceId(row.id);
            setShowModal(true);
          }}
        >
          الإبلاغ عن الخدمة
        </Button>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 flex-column p-4">
      <h1 className="w-100 text-align-center my-4">الخدمات</h1>
      <Row className="w-100 justify-content-start mb-3">
        <Col lg="4" md="4" sm="12">
          <Input
            type="text"
            placeholder="ابحث بالخدمات"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col lg="4" md="4" sm="12">
          <Input
            type="select"
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(Number(e.target.value))}
          >
            <option value="">المنطقة</option>
            {regions?.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Input>
        </Col>
        <Col lg="4" md="4" sm="12">
          <Input
            type="select"
            value={selectedSubcategory || ""}
            onChange={(e) => setSelectedSubcategory(Number(e.target.value))}
          >
            <option value="">الفئة</option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </Input>
        </Col>
      </Row>
      {loading ? (
        <Spinner animation="border" role="status" className="my-4">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      ) : (
        <DataTable columns={columns} data={services} pagination />
      )}

      {/* Modal for Reporting */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>الإبلاغ عن الخدمة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="reportMessage">
            <Form.Label>الرسالة</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleReportService}>
            إرسال
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PublicServicesPage;
