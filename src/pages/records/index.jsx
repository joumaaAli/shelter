import React, { useEffect, useState } from "react";
import { fetchRecords } from "@/services/record";
import DataTable from "react-data-table-component";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./records.module.scss"; // Import the SCSS module

const RecordWithDoctorsPage = () => {
  const [records, setRecords] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const fetchAllRecords = async () => {
    const { success, data } = await fetchRecords();
    if (success) {
      setRecords(data);
      generateDynamicColumns(data);
    }
  };

  // Generate columns dynamically based on the number of doctors
  const generateDynamicColumns = (data) => {
    let maxDoctors = 0;

    // Find the maximum number of doctors in any record
    data.forEach((record) => {
      if (record.doctors.length > maxDoctors) {
        maxDoctors = record.doctors.length;
      }
    });

    // Initialize basic columns
    const columnsArray = [
      {
        name: "Record Date",
        selector: (row) => new Date(row.date).toLocaleDateString(),
        sortable: true,
      },
    ];

    // Dynamically add columns for each doctor's details
    for (let i = 0; i < maxDoctors; i++) {
      columnsArray.push(
        {
          name: `Doctor ${i + 1} Name`,
          cell: (row) => (
            <EllipsisTooltip value={row.doctors[i]?.firstName || "-"} />
          ),
        },
        {
          name: `Doctor ${i + 1} Lastname`,
          cell: (row) => (
            <EllipsisTooltip value={row.doctors[i]?.lastName || "-"} />
          ),
        },
        {
          name: `Doctor ${i + 1} Phone`,
          cell: (row) => (
            <EllipsisTooltip value={row.doctors[i]?.phoneNumber || "-"} />
          ),
        },
        {
          name: `Doctor ${i + 1} Email`,
          cell: (row) => (
            <EllipsisTooltip value={row.doctors[i]?.email || "-"} />
          ),
        }
      );
    }

    setColumns(columnsArray);
  };

  // Custom tooltip renderer for ellipsis text
  const EllipsisTooltip = ({ value }) => {
    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${value}`}>{value}</Tooltip>}
      >
        <span className={styles["ellipsis-text"]}>{value}</span>
      </OverlayTrigger>
    );
  };

  return (
    <div className="d-flex w-100 align-items-center flex-column">
      <h1>Records with Doctors</h1>
      <Button onClick={fetchAllRecords}>Refresh Records</Button>
      <DataTable columns={columns} data={records} pagination />
    </div>
  );
};

export default RecordWithDoctorsPage;
