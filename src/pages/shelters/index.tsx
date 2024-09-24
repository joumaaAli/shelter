import { useState, useEffect } from "react";
import { fetchShelters } from "@/services/shelter"; // Shelter service to fetch shelters
import { fetchRegions } from "@/services/region"; // Region service to fetch regions
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";

const SheltersFilterPage = () => {
  const [shelters, setShelters] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]); // Regions for filtering
  const [searchTerm, setSearchTerm] = useState(""); // Search term for name
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null); // Selected region for filtering

  // Fetch shelters and regions when the component mounts
  useEffect(() => {
    fetchAllRegions();
    fetchAllShelters();
  }, [searchTerm, selectedRegion]);

  // Fetch all shelters based on search term and region
  const fetchAllShelters = async () => {
    const response = await fetchShelters(selectedRegion || undefined);
    if (response.success) {
      // Filter shelters by name if search term is provided
      const filteredShelters = response.data.filter((shelter: any) =>
        shelter.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setShelters(filteredShelters);
    } else {
      console.error("Failed to fetch shelters:", response.error);
    }
  };

  // Fetch all regions for the region dropdown
  const fetchAllRegions = async () => {
    const response = await fetchRegions();
    if (response.success) {
      setRegions(response.data);
    } else {
      console.error("Failed to fetch regions:", response.error);
    }
  };

  // Table columns for the DataTable
  const columns = [
    {
      name: "Shelter Name",
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "Region",
      selector: (row: any) => row.region?.name || "No region", // Display region name if available
      sortable: true,
    },
  ];

  return (
    <Container fluid>
      <h1 className="my-4">Shelters</h1>
      <Row className="mb-4">
        <Col md={6}>
          <Input
            type="text"
            placeholder="Search by shelter name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            as="select"
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(Number(e.target.value))}
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
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
            Clear Filters
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <DataTable
            columns={columns}
            data={shelters}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15]}
            highlightOnHover
            noDataComponent="No shelters found"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SheltersFilterPage;
