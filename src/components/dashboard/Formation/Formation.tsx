import {
  addFormation,
  deleteFormation,
  fetchFormations,
  updateFormation,
} from "@/services/formation";
import { FormationType } from "@/types/models";
import constructImage from "@/utils/supabase/constructImage";
import { createClient } from "@/utils/supabase/component";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import Swal from "sweetalert2";

const supabase = createClient();

const FormationPage = () => {
  const [formations, setFormations] = useState<FormationType[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFormation, setSelectedFormation] =
    useState<FormationType | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newFormationModalShow, setNewFormationModalShow] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    setLoading(true);
    const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "");
    const filePath = `${Date.now()}_${fileName}`; // Make sure the file name is unique

    try {
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      // Handle successful upload
      setImageFile(data?.path); // This will save the file path to the state
      Swal.fire({
        title: "Succès!",
        text: "L'image a été téléchargée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      // Handle upload failure
      console.error("Upload failed:", error);
      Swal.fire({
        title: "Erreur!",
        text: "Il y a eu un problème lors du téléchargement de l'image.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedFormation) {
      return;
    }
    const updatedData = {
      id: selectedFormation?.id || e.target.id.value,
      theme: e.target.theme.value,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
      location: e.target.location.value,
      organism: e.target.organism.value,
      phoneNumber: e.target.phoneNumber.value,
      email: e.target.email.value,
      profileImg: imageFile || selectedFormation?.profileImg,
    };
    try {
      setLoading(true);
      await updateFormation(updatedData);
      setLoading(false);
      Swal.fire({
        title: "Succès!",
        text: "La formation a été mise à jour avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Erreur!",
        text: "Il y a eu un problème lors de la mise à jour de la formation.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setModalShow(false);
    await fetchFormations(search).then((data) => setFormations(data?.data));
  };

  const handleAddFormationSubmit = async (e: any) => {
    e.preventDefault();
    if (!imageFile) {
      Swal.fire({
        title: "Erreur!",
        text: "Il y a eu un problème lors du téléchargement de l'image.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const newFormationData = {
      theme: e.target.theme.value,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
      location: e.target.location.value,
      organism: e.target.organism.value,
      phoneNumber: e.target.phoneNumber.value,
      email: e.target.email.value,
      profileImg: imageFile,
    };
    try {
      const { success } = await addFormation(newFormationData);
      if (!success) {
        Swal.fire({
          title: "Erreur!",
          text: "Il y a eu un problème lors de la création de la formation.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      setNewFormationModalShow(false);
      await fetchFormations(search).then((data) => setFormations(data?.data));
      Swal.fire({
        title: "Succès!",
        text: "La nouvelle formation a été créée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Il y a eu un problème lors de la création de la formation.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { success } = await deleteFormation(id);
      if (!success) {
        Swal.fire({
          title: "Erreur!",
          text: "Il y a eu un problème lors de la suppression de la formation.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      await fetchFormations(search).then((data) => setFormations(data?.data));
      Swal.fire({
        title: "Succès!",
        text: "La formation a été supprimée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Il y a eu un problème lors de la suppression de la formation.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchFormations(search).then((data) => {
      setFormations(data?.data);
    });
  }, [search]);

  const columns = [
    {
      name: "Thème",
      selector: (row: FormationType) => row.theme || "",
      sortable: true,
    },
    {
      name: "Date de début",
      selector: (row: FormationType) =>
        new Date(row.startDate).toLocaleDateString() || "",
      sortable: true,
    },
    {
      name: "Date de fin",
      selector: (row: FormationType) =>
        new Date(row.endDate).toLocaleDateString() || "",
      sortable: true,
    },
    {
      name: "Lieu",
      selector: (row: FormationType) => row.location || "",
      sortable: true,
    },
    {
      name: "Organisme",
      selector: (row: FormationType) => row.organism || "",
      sortable: true,
    },
    {
      name: "Téléphone",
      selector: (row: FormationType) => row.phoneNumber || "",
    },
    {
      name: "Email",
      selector: (row: FormationType) => row.email || "",
    },
    {
      name: "Image du profil",
      cell: (row: FormationType) => {
        return (
          <img
            src={constructImage(row.profileImg)}
            alt="profile"
            style={{ width: "50px", height: "50px" }}
          />
        );
      },
    },
    {
      name: "Actions",
      button: true,
      minWidth: "300px",
      cell: (row: FormationType) => (
        <Row className="w-100">
          <Col md="6">
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedFormation(row);
                setModalShow(true);
              }}
            >
              Modifier
            </Button>
          </Col>
          <Col md="6">
            <Button
              variant="danger"
              onClick={() => {
                handleDelete(row.id);
              }}
            >
              Supprimer
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column">
      <h1 className="text-align-center">Gestion des formations</h1>
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
              fetchFormations(search).then((data) => setFormations(data?.data))
            }
            className="w-100"
          >
            Actualiser
          </Button>
        </Col>
        <Col lg="3" md="6" className="mx-0" sm="6">
          <Button
            onClick={() => setNewFormationModalShow(true)}
            className="w-100"
          >
            Ajouter une formation
          </Button>
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={formations}
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        noDataComponent="Aucune formation trouvée"
      />
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la formation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="my-1" controlId="theme">
              <Form.Label>Thème</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedFormation?.theme}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="startDate">
              <Form.Label>Date de début</Form.Label>
              <Form.Control
                type="date"
                defaultValue={
                  selectedFormation?.startDate
                    ? new Date(selectedFormation.startDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="endDate">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control
                type="date"
                defaultValue={
                  selectedFormation?.endDate
                    ? new Date(selectedFormation.endDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="location">
              <Form.Label>Lieu</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedFormation?.location}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="organism">
              <Form.Label>Organisme</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedFormation?.organism}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="phoneNumber">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedFormation?.phoneNumber}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                defaultValue={selectedFormation?.email}
              />
            </Form.Group>
            <Form.Group className="my-1" controlId="profileImg">
              <Form.Label>Image du profil</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="my-2"
              disabled={loading}
            >
              Sauvegarder les modifications
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={newFormationModalShow}
        onHide={() => setNewFormationModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une nouvelle formation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddFormationSubmit}>
            <Form.Group className="my-1" controlId="theme">
              <Form.Label>Thème</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group className="my-1" controlId="startDate">
              <Form.Label>Date de début</Form.Label>
              <Form.Control type="date" required />
            </Form.Group>
            <Form.Group className="my-1" controlId="endDate">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control type="date" required />
            </Form.Group>
            <Form.Group className="my-1" controlId="location">
              <Form.Label>Lieu</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group className="my-1" controlId="organism">
              <Form.Label>Organisme</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group className="my-1" controlId="phoneNumber">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group className="my-1" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required />
            </Form.Group>
            <Form.Group className="my-1" controlId="profileImg">
              <Form.Label>Image du profil</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} required />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="my-2"
              disabled={loading}
            >
              Créer la formation
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormationPage;
