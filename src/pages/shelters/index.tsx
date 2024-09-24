import { useState, useEffect } from "react";
import { fetchShelters } from "@/services/shelter";
import { fetchRegions } from "@/services/region";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import tableStyle from "@/styles/tableStyle";
import style from "@/pages/my-house/my-house.module.scss";
import { HouseType } from "@/utils/interfaces/houseType";
import { Shelter } from "@/utils/interfaces/shelter";
import { Region } from "@/utils/interfaces/region";

const SheltersFilterPage = () => {
  const [shelters, setShelters] = useState<never[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllRegions();
    fetchAllShelters();
  }, [searchTerm, selectedRegion]);

  const fetchAllShelters = async () => {
    setLoading(true); // Set loading to true before fetching data
    const response = await fetchShelters(selectedRegion || undefined);
    if (response.success) {
      const filteredShelters = response.data.filter((shelter: Shelter) => {
        return shelter.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setShelters(filteredShelters);
    } else {
      console.error("Failed to fetch shelters:", response.error);
    }
    setLoading(false); // Set loading to false after fetching
  };

  const fetchAllRegions = async () => {
    const response = await fetchRegions();
    if (response.success) {
      setRegions(response.data);
    } else {
      console.error("Failed to fetch regions:", response.error);
    }
  };

  const columns = [
    {
      name: "اسم الملجأ",
      selector: (row: HouseType) => row.name,
      sortable: true,
    },
    {
      name: "المنطقة",
      selector: (row: HouseType) => row.region?.name || "No region",
      sortable: true,
    },
  ];

  return (
    <Container fluid>
      <h1 className="my-4">الملاجئ</h1>
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <Input
            type="text"
            placeholder="ابحث باسم الملاجئ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading} // Disable input when loading
          />
        </Col>
        <Col md={4} className="mb-4">
          <Form.Control
            as="select"
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(Number(e.target.value))}
            disabled={loading} // Disable dropdown when loading
          >
            <option value="">كل المناطق</option>
            {regions.map((region: Region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col md={2}>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedRegion(null);
            }}
            variant="secondary"
            disabled={loading} // Disable button when loading
          >
            مسح البحث
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Row className="d-flex justify-content-center align-items-center my-4">
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
        </Row>
      ) : (
        <Row>
          <Col>
            <DataTable
              className={style.houseTable}
              columns={columns}
              data={shelters}
              highlightOnHover
              noDataComponent="لم يتم العثور على أية ملاجئ"
              customStyles={tableStyle}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SheltersFilterPage;
