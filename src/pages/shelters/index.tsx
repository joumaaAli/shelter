import { useState, useEffect } from "react";
import { fetchShelters } from "@/services/shelter";
import { fetchRegions } from "@/services/region";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import DataTable, {TableColumn} from "react-data-table-component";
import { Input } from "reactstrap";
import tableStyle from "@/styles/tableStyle";
import style from "@/pages/shelters/shelters.module.scss";
import { Shelter } from "@/utils/interfaces/shelter";
import { Region } from "@/types/models";

const SheltersFilterPage = () => {
  const [shelters, setShelters] = useState<never[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(debouncedSearch);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearch]);

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
    setLoading(false);
  };

  const fetchAllRegions = async () => {
    const response = await fetchRegions();
    if (response.success) {
      setRegions(response.data);
    } else {
      console.error("Failed to fetch regions:", response.error);
    }
  };

  const columns: TableColumn<Shelter>[] = [
    {
      name: "اسم الملجأ",
      selector: (row: Shelter) => row.name,
      sortable: true,
    },
    {
      name: "المنطقة",
      selector: (row: Shelter) => row.region?.name || "No region",
      sortable: true,
    },
  ];

  return (
      <div className="d-flex w-100 align-items-center flex-column p-4">
        <h1 className="w-100 text-align-center my-4">الملاجئ</h1>
        <Row className={style.customRow}>
          <Col sm={6} xs={12} className={"p-0"}>
            <Input
                type="text"
                placeholder="ابحث باسم الملاجئ"
                value={debouncedSearch}
                onChange={(e) => setDebouncedSearch(e.target.value)}
                disabled={loading}
                className="w-100 my-2"
            />
          </Col>
          <Col sm={4} xs={6} className={style.customColumn}>
            <Form.Control
                as="select"
                value={selectedRegion || ""}
                onChange={(e) => setSelectedRegion(Number(e.target.value))}
                disabled={loading}
                className="w-100 my-2"
            >
              <option value="">كل المناطق</option>
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
        <DataTable
          className={style.houseTable}
          columns={columns}
          data={shelters}
          highlightOnHover
          noDataComponent="لم يتم العثور على أية ملاجئ"
          customStyles={tableStyle}
        />
      )}
    </div>
  );
};

export default SheltersFilterPage;
