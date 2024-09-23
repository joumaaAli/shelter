import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import {
  fetchRecords,
  addRecord,
  updateRecord,
  deleteRecord,
} from "@/services/record";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

const RecordPage = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [newRecordModalShow, setNewRecordModalShow] = useState(false);
  const [date, setDate] = useState("");
  const [doctors, setDoctors] = useState([
    { firstName: "", lastName: "", phoneNumber: "", email: "" },
  ]);

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const fetchAllRecords = async () => {
    const { success, data } = await fetchRecords();
    if (success) setRecords(data);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    const { success } = await addRecord({ date, doctors });
    if (success) {
      Swal.fire("Record added", "", "success");
      fetchAllRecords();
      setNewRecordModalShow(false);
    } else {
      Swal.fire("Error adding record", "", "error");
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    if (!selectedRecord) return;
    const { success } = await updateRecord(selectedRecord.id, {
      date,
      doctors,
    });
    if (success) {
      Swal.fire("Record updated", "", "success");
      fetchAllRecords();
      setModalShow(false);
    } else {
      Swal.fire("Error updating record", "", "error");
    }
  };

  const handleDeleteRecord = async (id) => {
    const { success } = await deleteRecord(id);
    if (success) {
      Swal.fire("Record deleted", "", "success");
      fetchAllRecords();
    } else {
      Swal.fire("Error deleting record", "", "error");
    }
  };

  const handleDoctorChange = (index, field, value) => {
    const newDoctors = [...doctors];
    newDoctors[index][field] = value;
    setDoctors(newDoctors);
  };

  // Add a function to remove a doctor from the list
  const handleRemoveDoctor = (index) => {
    const newDoctors = doctors.filter((_, docIndex) => docIndex !== index);
    setDoctors(newDoctors);
  };

  // Function to handle "Edit" button click
  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setDate(record.date); // Set the date state
    setDoctors(record.doctors); // Set the doctors state to the doctors of the selected record
    setModalShow(true); // Show the modal
  };

  const columns = [
    {
      id: "id",
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
      sortFunction: (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      name: "Doctors",
      cell: (row) =>
        row.doctors.map((doc) => `${doc.firstName} ${doc.lastName}`).join(", "),
    },
    {
      name: "Actions",
      minWidth: "200px",
      button: true,
      cell: (row) => (
        <Row className="w-100">
          <Col md="6">
            <Button onClick={() => handleEditClick(row)}>Edit</Button>
          </Col>
          <Col md="6">
            <Button variant="danger" onClick={() => handleDeleteRecord(row.id)}>
              Delete
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column">
      <h1>Record Management</h1>
      <Button
        onClick={() => {
          setNewRecordModalShow(true);
          setSelectedRecord(null);
          setDate("");
          setDoctors([
            { firstName: "", lastName: "", phoneNumber: "", email: "" },
          ]);
        }}
      >
        Add New Record
      </Button>
      <DataTable
        columns={columns}
        data={records}
        pagination
        defaultSortField="date"
        defaultSortAsc={true} // Set to true for ascending or false for descending
      />

      {/* Add New Record Modal */}
      <Modal
        show={newRecordModalShow}
        onHide={() => setNewRecordModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddRecord}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Doctors</Form.Label>
              {doctors.map((doctor, index) => (
                <div key={index} className="mb-4">
                  <Form.Control
                    className="mb-1"
                    type="text"
                    placeholder="First Name"
                    value={doctor.firstName}
                    onChange={(e) =>
                      handleDoctorChange(index, "firstName", e.target.value)
                    }
                    required
                  />
                  <Form.Control
                    className="mb-1"
                    type="text"
                    placeholder="Last Name"
                    value={doctor.lastName}
                    onChange={(e) =>
                      handleDoctorChange(index, "lastName", e.target.value)
                    }
                    required
                  />
                  <Form.Control
                    className="mb-1"
                    type="text"
                    placeholder="Phone Number"
                    value={doctor.phoneNumber}
                    onChange={(e) =>
                      handleDoctorChange(index, "phoneNumber", e.target.value)
                    }
                    required
                  />
                  <Form.Control
                    className="mb-1"
                    type="email"
                    placeholder="Email"
                    value={doctor.email}
                    onChange={(e) =>
                      handleDoctorChange(index, "email", e.target.value)
                    }
                    required
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveDoctor(index)}
                    className="mt-1"
                  >
                    Remove Doctor
                  </Button>
                </div>
              ))}
              <Button
                onClick={() =>
                  setDoctors([
                    ...doctors,
                    {
                      firstName: "",
                      lastName: "",
                      phoneNumber: "",
                      email: "",
                    },
                  ])
                }
              >
                Add Doctor
              </Button>
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Record Modal */}
      {selectedRecord && (
        <Modal show={modalShow} onHide={() => setModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateRecord}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Doctors</Form.Label>
                {doctors.map((doctor, index) => (
                  <div key={index} className="mb-4">
                    <Form.Control
                      className="mb-1"
                      type="text"
                      placeholder="First Name"
                      value={doctor.firstName}
                      onChange={(e) =>
                        handleDoctorChange(index, "firstName", e.target.value)
                      }
                    />
                    <Form.Control
                      className="mb-1"
                      type="text"
                      placeholder="Last Name"
                      value={doctor.lastName}
                      onChange={(e) =>
                        handleDoctorChange(index, "lastName", e.target.value)
                      }
                    />
                    <Form.Control
                      className="mb-1"
                      type="text"
                      placeholder="Phone Number"
                      value={doctor.phoneNumber}
                      onChange={(e) =>
                        handleDoctorChange(index, "phoneNumber", e.target.value)
                      }
                    />
                    <Form.Control
                      className="mb-1"
                      type="email"
                      placeholder="Email"
                      value={doctor.email}
                      onChange={(e) =>
                        handleDoctorChange(index, "email", e.target.value)
                      }
                    />
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveDoctor(index)}
                      className="mt-1"
                    >
                      Remove Doctor
                    </Button>
                  </div>
                ))}
              </Form.Group>
              <Button type="submit">Save changes</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default RecordPage;
