import { filterHouses } from "@/services/house";
import { House as HouseType } from "@/types/models";
import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import style from "./houses.module.scss";
import { Region } from "@/utils/interfaces/region";
import tableStyle from "@/styles/tableStyle";

const PublicHousesPage = () => {
  const [houses, setHouses] = useState<HouseType[]>([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [filterSpace, setFilterSpace] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      const data = await filterHouses(
        searchAddress,
        filterSpace || undefined,
        selectedRegion || undefined
      );
      setHouses(data.data);
      setLoading(false); // Set loading to false after fetching
    };

    fetchData();
  }, [searchAddress, filterSpace, selectedRegion]);

  useEffect(() => {
    async function fetchRegions() {
      const response = await fetch("/api/regions");
      const regionData = await response.json();
      setRegions(regionData);
    }

    fetchRegions();
  }, []);

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
      name: "المساحة المتاحة للأشخاص",
      selector: (row: HouseType) => row.spaceForPeople || "",
      sortable: true,
    },
    {
      name: "المنطقة",
      selector: (row: HouseType) => row.region?.name || "",
      sortable: true,
    },
    {
      name: "معلومات إضافية",
      selector: (row: HouseType) => row.additionnalInformation || "",
      sortable: true,
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column p-4">
      <h1 className="w-100 text-align-center my-4">المنازل</h1>
      <Row className="w-100 d-flex justify-content-start align-items-center">
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="text"
            placeholder="البحث بالعناوين"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="w-100 my-2"
            disabled={loading}
          />
        </Col>
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="number"
            placeholder="البحث بالمساحة المتاحة للأشخاص"
            value={filterSpace || ""}
            onChange={(e) => setFilterSpace(parseInt(e.target.value) || null)}
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
            <option value="">كل المناطق</option>
            {regions.map((region: Region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Input>
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
    </div>
  );
};

export default PublicHousesPage;
