import { useState, useEffect } from "react";
import { fetchShelters } from "@/services/shelter";
import { fetchRegions } from "@/services/region";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import tableStyle from "@/styles/tableStyle";
import style from "@/pages/my-house/my-house.module.scss";
import { HouseType } from "@/utils/interfaces/houseType";
import { Shelter } from "@/utils/interfaces/shelter";
import { Region } from "@/utils/interfaces/region";

const SheltersFilterPage = () => {
  const [shelters, setShelters] = useState<never[]>([]);
  const [regions, setRegions] = useState<never[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  useEffect(() => {
    fetchAllRegions();
    fetchAllShelters();
  }, [searchTerm, selectedRegion]);

  const fetchAllShelters = async () => {
    const response = await fetchShelters(selectedRegion || undefined);
    if (response.success) {
      const filteredShelters = response.data.filter((shelter: Shelter) => {
        return shelter.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setShelters(filteredShelters);
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
          />
        </Col>
        <Col md={4} className="mb-4">
          <Form.Control
            as="select"
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(Number(e.target.value))}
          >
            <option value="">المناطق</option>
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
          >
            مسح البحث
          </Button>
        </Col>
      </Row>

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
    </Container>
  );
};

export default SheltersFilterPage;
