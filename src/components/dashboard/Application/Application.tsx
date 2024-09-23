import {
  fetchPraticiens,
  updatePraticien,
  updatePraticienStatus,
} from "@/services/praticien";
import { Praticien as PraticienType, Status } from "@/types/models";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import Swal from "sweetalert2";

const Application = () => {
  const [praticiens, setPraticiens] = useState<PraticienType[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status>(Status.PENDING);
  const [selectedPraticien, setSelectedPraticien] =
    useState<PraticienType | null>(null);
  const [modalShow, setModalShow] = useState(false);

  const handleStatusUpdate = async (orderNumber: string, newStatus: Status) => {
    try {
      await updatePraticienStatus(orderNumber, newStatus);
      await fetchPraticiens(search).then((data) => setPraticiens(data.data));
      Swal.fire({
        title: "Succès!",
        text: `Le praticien a bien été ${
          newStatus === Status.ACTIVE ? "enregistré" : "supprimé"
        }`,
        icon: newStatus === Status.ACTIVE ? "success" : "warning",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Il y a eu un problème lors de la mise à jour du statut.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    const updatedData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      RPPSNumber: e.target.RPPSNumber.value,
      mobileNumber: e.target.mobileNumber.value,
      cabinetNumber: e.target.cabinetNumber.value,
      orderNumber: e.target.orderNumber.value,
    };
    await updatePraticien(updatedData);
    setModalShow(false);
    await fetchPraticiens(search).then((data) => setPraticiens(data.data));
  };

  useEffect(() => {
    fetchPraticiens(search, selectedStatus).then((data) => {
      setPraticiens(data.data);
    });
  }, [search, selectedStatus]);

  const columns = [
    {
      name: "Nom",
      selector: (row: PraticienType) => row.firstName || "",
      sortable: true,
    },
    {
      name: "Prénom",
      selector: (row: PraticienType) => row.lastName || "",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: PraticienType) => row.email || "",
      sortable: true,
    },
    {
      name: "Ville",
      selector: (row: PraticienType) => row.city?.name || "",
      sortable: true,
    },
    {
      name: "Spécialités",
      selector: (row: PraticienType) =>
        row?.specialties?.map((s) => s.name).join(", ") || "",
      sortable: true,
    },
    {
      name: "Matériels",
      selector: (row: PraticienType) =>
        row?.materiels?.map((m) => m.name).join(", ") || "",
      sortable: true,
    },

    {
      name: "Numéro RPPS",
      selector: (row: PraticienType) => row.RPPSNumber || "",
    },
    {
      name: "Actions",
      button: true,
      minWidth: "400px",
      cell: (row: PraticienType) => (
        <Row className="w-100">
          {row.status === Status.PENDING && (
            <>
              <Col md="4">
                <Button
                  onClick={() =>
                    handleStatusUpdate(row.orderNumber, Status.ACTIVE)
                  }
                >
                  Accept
                </Button>
              </Col>
              <Col md="4">
                <Button
                  onClick={() =>
                    handleStatusUpdate(row.orderNumber, Status.INACTIVE)
                  }
                  variant="danger"
                >
                  Rejeter
                </Button>
              </Col>
            </>
          )}
          {row.status === Status.ACTIVE && (
            <Col md="4">
              <Button
                onClick={() =>
                  handleStatusUpdate(row.orderNumber, Status.INACTIVE)
                }
                variant="danger"
              >
                Rejeter
              </Button>
            </Col>
          )}
          {row.status === Status.INACTIVE && (
            <Col md="4">
              <Button
                onClick={() =>
                  handleStatusUpdate(row.orderNumber, Status.ACTIVE)
                }
              >
                Accepter
              </Button>
            </Col>
          )}
          <Col md={row.status === Status.PENDING ? "4" : "8"} className="mx-0">
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedPraticien(row);
                setModalShow(true);
              }}
            >
              Edit
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column">
      <h1 className="text-align-center">Application</h1>
      <Row className="w-100 d-flex justify-content-start align-items-center">
        <Col lg="6" md="6" className="mx-0" sm="12">
          <Input
            type="text"
            placeholder="Rechercher par thème"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col lg="3" md="6" className="mx-0" sm="6">
          <Button
            onClick={() =>
              fetchPraticiens(search, selectedStatus || "").then((data) =>
                setPraticiens(data.data)
              )
            }
            className="w-100"
          >
            Actualiser
          </Button>
        </Col>
        <Col lg="3" md="6" className="mx-0" sm="6">
          <Form.Control
            as="select"
            onChange={(e) => setSelectedStatus(e.target.value as Status)}
            className="w-100 my-2"
          >
            <option value={Status.PENDING}>En attente</option>
            <option value={Status.ACTIVE}>Accepté</option>
            <option value={Status.INACTIVE}>Rejeté</option>
          </Form.Control>
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={praticiens}
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        noDataComponent="Aucun praticien trouvé"
      />
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier Praticien</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="my-1" controlId="firstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedPraticien?.firstName}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="lastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedPraticien?.lastName}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                defaultValue={selectedPraticien?.email}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="RPPSNumber">
              <Form.Label>Numéro RPPS</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedPraticien?.RPPSNumber || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="mobileNumber">
              <Form.Label>Numéro de téléphone</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedPraticien?.mobileNumber || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="cabinetNumber">
              <Form.Label>Numéro de cabinet</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedPraticien?.cabinetNumber || ""}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="orderNumber">
              <Form.Label>Numéro d&apos;ordre</Form.Label>
              <Form.Control
                type="text"
                defaultValue={
                  selectedPraticien?.orderNumber || "Numéro d'ordre introuvable"
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="my-2">
              Sauvegarder les modifications
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Application;
