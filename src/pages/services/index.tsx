import { useEffect, useState } from "react";
import { filterServices } from "@/services/service";
import { reportService } from "@/services/report";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import { Col, Row, Spinner, Button, Modal, Form } from "react-bootstrap";
import { Region } from "@/types/models";

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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await filterServices(search, selectedRegion || undefined);
      setServices(data.data || []);
      setLoading(false);
    };

    fetchData();
  }, [search, selectedRegion]);

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
      name: "الوصف",
      selector: (row: any) => row.description || "",
      sortable: true,
    },
    {
      name: "إجراءات",
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
      <Row className="w-100 justify-content-start">
        <Col lg="4" md="4" sm="12">
          <Input
            type="text"
            placeholder="ابحث بالخدمات"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
