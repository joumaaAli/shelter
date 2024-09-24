import style from "@/pages/shelters/shelters.module.scss";
import { fetchRegions } from "@/services/region";
import { fetchShelters } from "@/services/shelter";
import tableStyle from "@/styles/tableStyle";
import { HouseType } from "@/utils/interfaces/houseType";
import { Region } from "@/utils/interfaces/region";
import { Shelter } from "@/utils/interfaces/shelter";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";

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
    <div className="d-flex w-100 align-items-center flex-column p-4">
      <h1 className="w-100 text-align-center my-4">الملاجئ</h1>
      <Row className={style.customRow}>
        <Col sm={6} xs={6} className={"p-0"}>
          <Input
            type="text"
            placeholder="ابحث باسم الملاجئ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col sm={4} xs={6}>
          <Form.Control
            as="select"
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(Number(e.target.value))}
            className="w-100 my-2 ml-0"
          >
            <option value="">المناطق</option>
            {regions.map((region: Region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col sm={2} xs={6} className={style.customButton}>
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
      <DataTable
        className={style.houseTable}
        columns={columns}
        data={shelters}
        highlightOnHover
        noDataComponent="لم يتم العثور على أية ملاجئ"
        customStyles={tableStyle}
      />
    </div>
  );
};

export default SheltersFilterPage;
