import { filterHouses } from "@/services/house";
import { House as HouseType } from "@/types/models";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";

const PublicHousesPage = () => {
  const [houses, setHouses] = useState<HouseType[]>([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [filterSpace, setFilterSpace] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await filterHouses(searchAddress, filterSpace || undefined);
      setHouses(data.data);
    };

    fetchData();
  }, [searchAddress, filterSpace]);

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
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column">
      <h1 className="text-align-center my-4">عرض المنازل</h1>
      <Row className="w-100 d-flex justify-content-start align-items-center">
        <Col lg="6" md="6" className="mx-0" sm="12">
          <Input
            type="text"
            placeholder="البحث بالعناوين"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col lg="6" md="6" className="mx-0 mb-2" sm="12">
          <Input
            type="number"
            placeholder="البحث بالمساحة المتاحة للأشخاص"
            value={filterSpace || ""}
            onChange={(e) => setFilterSpace(parseInt(e.target.value) || null)}
            className="w-100 my-2"
          />
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={houses}
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        noDataComponent="لم يتم العثور على أي منازل"
      />
    </div>
  );
};

export default PublicHousesPage;
