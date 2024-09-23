import { fetchCities } from "@/services/city";
import { fetchMateriels } from "@/services/materiel";
import { searchPraticiens } from "@/services/praticien";
import { fetchSpecialities } from "@/services/specialty";
import { Praticien } from "@/types/models";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Card, CardTitle, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import {
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import CustomAsyncSelect from "../../AsyncSelect/AsyncSelect";
import styles from "./Form.module.scss";

type Field = {
  name: keyof Praticien;
  label: string;
  options: {
    type: string;
    required: boolean;
  };
};

const SearchForm = () => {
  const [praticiens, setPraticiens] = useState<Praticien[]>([]);
  const [modal, setShowModal] = useState(false);
  const formik = useFormik<Praticien>({
    initialValues: {
      specialties: [],
      materiels: [],
      cityId: 0,
      orderNumber: "",
      cabinetNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      RPPSNumber: "",
      status: "PENDING",
      city: null,
    },
    onSubmit: (values) => {},
  });

  const fields: Field[] = [
    {
      name: "firstName",
      label: "Prénom",
      options: {
        type: "text",
        required: true,
      },
    },

    {
      name: "lastName",
      label: "Nom",
      options: {
        type: "text",
        required: true,
      },
    },
  ];

  const columns = [
    {
      name: "Prénom",
      selector: (row: Praticien) => row.firstName || "",
      sortable: true,
    },
    {
      name: "Nom",
      selector: (row: Praticien) => row.lastName || "",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: Praticien) => row.email || "",
      sortable: true,
    },
    {
      name: "Ville",
      selector: (row: Praticien) => row.city?.name || "",
      sortable: true,
    },
    {
      name: "Spécialités",
      selector: (row: Praticien) =>
        row.specialties
          ?.map((s) => s.name)
          .sort((a, b) => a.localeCompare(b))
          .join(", ") || "",
      sortable: true,
    },
    {
      name: "Matériels",
      selector: (row: Praticien) =>
        row.materiels
          ?.map((m) => m.name)
          .sort((a, b) => a.localeCompare(b))
          .join(", ") || "",
      sortable: true,
    },
  ];

  return (
    <Row className="w-100 h-100 d-flex justify-content-center">
      <Card className={styles.card}>
        <CardTitle>
          <h1>Rechercher</h1>
        </CardTitle>
        <form onSubmit={formik.handleSubmit}>
          <Row>
            {fields.map((field, index) => (
              <Col md="6" className="my-2" key={index}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder={field.label}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name] as any}
                  required={field.options.required}
                  invalid={
                    formik.touched[field.name] && !!formik.errors[field.name]
                  }
                />
                <FormFeedback>
                  {formik.errors[field.name] as string}
                </FormFeedback>
              </Col>
            ))}
          </Row>
          <Row>
            <Col md="6" className="my-2">
              <Label htmlFor="specialties">Spécialité</Label>
              <CustomAsyncSelect
                loadOptions={fetchSpecialities}
                defaultOptions
                onChange={(option: any) =>
                  formik.setFieldValue(
                    "specialties",
                    option.map((choice: any) => choice.label)
                  )
                }
                isMulti
                value={
                  formik.values.specialties &&
                  formik.values.specialties.map((choice: any) => ({
                    value: choice,
                    label: choice,
                  }))
                }
              />
            </Col>
            <Col md="6" className="my-2">
              <Label htmlFor="materiels">Matériels</Label>
              <CustomAsyncSelect
                loadOptions={fetchMateriels}
                defaultOptions
                onChange={(option: any) =>
                  formik.setFieldValue(
                    "materiels",
                    option.map((choice: any) => choice.label)
                  )
                }
                isMulti
                value={
                  formik.values.materiels &&
                  formik.values.materiels.map((choice: any) => ({
                    value: choice,
                    label: choice,
                  }))
                }
              />
            </Col>
            <Col md="6" className="my-2">
              <Label htmlFor="city">Ville</Label>
              <CustomAsyncSelect
                loadOptions={fetchCities}
                defaultOptions
                onChange={(option: any) =>
                  formik.setFieldValue("city", option.label)
                }
                value={
                  formik.values.city && {
                    value: formik.values.city,
                    label: formik.values.city,
                  }
                }
              />
            </Col>
          </Row>
          <Row className="my-2">
            <Col>
              <Button
                type="submit"
                color="primary"
                onClick={() => {
                  setShowModal(!modal);
                  searchPraticiens(formik).then((res) => {
                    setPraticiens(res.data);
                  });
                }}
                disabled={modal}
              >
                Rechercher
              </Button>
            </Col>
            <Col />
            <Col>
              <Button
                type="reset"
                color="secondary"
                onClick={() => {
                  formik.resetForm();
                }}
              >
                Réinitialiser
              </Button>
            </Col>
          </Row>
        </form>
      </Card>
      <Modal
        size="lg"
        isOpen={modal}
        toggle={() => {
          setShowModal(!modal);
        }}
      >
        <ModalHeader
          toggle={() => {
            setShowModal(!modal);
          }}
        >
          Résultats
        </ModalHeader>
        <ModalBody>
          <DataTable
            columns={columns}
            data={praticiens}
            highlightOnHover
            pointerOnHover
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            className="w-100"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              setShowModal(!modal);
            }}
          >
            Fermer
          </Button>
        </ModalFooter>
      </Modal>
    </Row>
  );
};

export default SearchForm;
