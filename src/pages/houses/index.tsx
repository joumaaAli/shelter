import { filterHouses } from "@/services/house";
import { House as HouseType } from "@/types/models";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, {TableStyles} from "react-data-table-component";
import { Input } from "reactstrap";
import style from "./houses.module.scss";
import {Region} from "@/utils/interfaces/region";

const PublicHousesPage = () => {
  const [houses, setHouses] = useState<HouseType[]>([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [filterSpace, setFilterSpace] = useState<number | null>(null);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  const tableCustomStyles: TableStyles = {
    headRow: {
      style: {
        border: 'none',
        color:'#223336',
        backgroundColor: '#f8f9fa',
      },
    },
    rows: {
      style: {
        border: 'none !important',
        backgroundColor: 'transparent',
        '&:nth-child(even)': {
          backgroundColor: '#f1f3f5',
        },
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
        fontSize: '14px',
        color: '#343a40',
      },
    },
    noData: {
      style: {
        color: '#6c757d',
        fontSize: '16px',
        textAlign: 'center',
        padding: '20px 0',
      },
    },
    pagination: {
      style: {
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.07)',
        backgroundColor: '#fff',
        borderTop: 'none',
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center', // Center pagination controls
        alignItems: 'center',
      },
      pageButtonsStyle: {
        width: '40px',
        height: '40px',
        borderRadius: '6px',
        padding: '5px',
        margin: '0 5px',
        cursor: 'pointer',
        backgroundColor: '#599a68',
        color: '#fff',
        transition: 'background-color 0.3s ease',

        '&:hover:not(:disabled)': {
          backgroundColor: '#3b6645',
        },

        '&:disabled': {
          backgroundColor: '#e0e0e0',
          cursor: 'not-allowed',
        },
      },
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await filterHouses(
        searchAddress,
        filterSpace || undefined,
        selectedRegion || undefined
      );
      setHouses(data.data);
    };

    fetchData();
  }, [searchAddress, filterSpace, selectedRegion]);

  useEffect(() => {
    // Fetch regions to populate the dropdown
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
      selector: (row: HouseType) => row.name || "",
      sortable: true,
    },
    {
      name: "العنوان",
      selector: (row: HouseType) => row.address || "",
      sortable: true,
    },
    {
      name: "رقم الهاتف",
      selector: (row: HouseType) => row.phoneNumber || "",
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
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column p-4">
      <h1 className="w-100 text-align-center my-4">عرض المنازل</h1>
      <Row className="w-100 d-flex justify-content-start align-items-center">
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="text"
            placeholder="البحث بالعناوين"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="number"
            placeholder="البحث بالمساحة المتاحة للأشخاص"
            value={filterSpace || ""}
            onChange={(e) => setFilterSpace(parseInt(e.target.value) || null)}
            className="w-100 my-2"
          />
        </Col>
        <Col lg="4" md="4" className="mx-0 mb-2" sm="12">
          <Input
            type="select"
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(Number(e.target.value) || null)}
          >
            <option value="">اختر المنطقة</option>
            {regions.map((region: Region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Input>
        </Col>
      </Row>
      <DataTable
          className={style.houseTable}
          columns={columns}
          data={houses}
          highlightOnHover
          pointerOnHover
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          noDataComponent="لم يتم العثور على أي منازل"
          customStyles={tableCustomStyles}
      />
    </div>
  );
};

export default PublicHousesPage;
