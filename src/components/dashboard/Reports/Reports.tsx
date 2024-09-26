import { fetchReports } from "@/services/report"; // API to fetch reports
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";

const ReportsAdminDashboard = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchReports();
      setReports(data?.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row: any) => row.houseId || row.serviceId || "",
      sortable: true,
    },
    {
      name: "الرسالة",
      selector: (row: any) => row.message || "",
      sortable: true,
    },
    {
      name: "النوع",
      selector: (row: any) => (row.houseId ? "منزل" : "خدمة") || "",
      sortable: true,
    },
    {
      name: "تاريخ الإبلاغ",
      selector: (row: any) => row.createdAt || "",
      sortable: true,
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column p-4">
      <h1 className="text-align-center my-4">الإبلاغات</h1>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      ) : (
        <DataTable columns={columns} data={reports} />
      )}
    </div>
  );
};

export default ReportsAdminDashboard;
