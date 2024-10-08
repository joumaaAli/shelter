import { fetchRegions } from "@/services/region";
import {
  addService,
  deleteService,
  fetchServices,
  updateService,
} from "@/services/service";
import { fetchCategories } from "@/services/cateogires";
import { Region, SubCategoryMap } from "@/types/models";
import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import style from "../house.module.scss";
import tableStyle from "@/styles/tableStyle";
import { Tabs, Tab } from "react-bootstrap";

const ServiceUserDashboard = () => {
  const [services, setServices] = useState<any[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(
    null
  );
  // const [activeTab, setActiveTab] = useState<"medicine" | "donation">(
  //   "medicine"
  // );
  // ADD THE SERVICE TO FETCH CATEGORIES
  // SERVICES NOT BEING DISPLAYED IN THE SERVICES PAGE

  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchServices(search, selectedRegion || undefined);
      setServices(data.data || []);
      setLoading(false);
    };

    loadServices();
  }, [search, selectedRegion]);

  const handleAddOrEditService = async (e: any) => {
    e.preventDefault();
    setFormLoading(true);

    // TO CHANGE
    const serviceData = {
      name: e.target.name.value || null,
      phoneNumber: e.target.phoneNumber.value,
      regionId: parseInt(e.target.region.value),
      description: e.target.description.value,
      validated: selectedService ? selectedService.validated : false,
      subcategoryId: e.target.subcategory.value,
      id: null,
    };

    if (selectedService) {
      serviceData.id = selectedService.id;
      await updateService(serviceData);
    } else {
      await addService(serviceData);
    }

    handleClose();
    await fetchServices(search, selectedRegion || undefined).then((data) =>
      setServices(data.data || [])
    );
    setFormLoading(false);
  };

  const handleDeleteService = async (id: number) => {
    await deleteService(id);
    await fetchServices(search, selectedRegion || undefined).then((data) =>
      setServices(data.data || [])
    );
  };

  const columns = [
    {
      name: "الاسم",
      selector: (row: any) => row.name || "غير متوفر",
      sortable: true,
    },
    {
      name: "رقم الهاتف",
      selector: (row: any) => row.phoneNumber || "",
      sortable: true,
    },
    {
      name: "المنطقة",
      selector: (row: any) => row.region?.name || "",
      sortable: true,
    },
    {
      name: "الوصف",
      selector: (row: any) => row.description || "",
      sortable: true,
    },
    {
      name: "الفئة",
      selector: (row: any) => row.subcategory?.name || "",
      sortable: true,
    },

    {
      name: "التحقق",
      selector: (row: any) => (row.validated ? "تم التحقق" : "لم يتم التحقق"),
      sortable: true,
    },

    {
      name: "إجراءات",
      minWidth: "260px",
      cell: (row: any) => (
        <Row>
          <Col>
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedService(row);
                handleShow();
              }}
            >
              تعديل
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              onClick={() => handleDeleteService(row.id)}
            >
              حذف
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    const loadRegions = async () => {
      const data = await fetchRegions();
      setRegions(data.data || []);
    };

    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data.data || []);
      setSelectedCategory(data.data[0]);
    };

    loadRegions();
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setSubcategories(selectedCategory.subcategories);
    }
  }, [selectedCategory]);

  // @ts-ignore
  return (
    <div className="d-flex flex-column p-4">
      <h1 className="w-100 text-align-center my-4">خدماتي</h1>
      <Row className={style.customRow}>
        <Col sm={6} xs={12} className={"p-0"}>
          <Input
            type="text"
            placeholder="ابحث في الخدمات"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col sm={4} xs={6} className={style.customColumn}>
          <Form.Control
            as="select"
            value={selectedRegion || ""}
            onChange={(e) =>
              setSelectedRegion(parseInt(e.target.value) || null)
            }
            className="w-100 my-2"
          >
            <option value="">ابحث بالمناطق</option>
            {regions?.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col sm={2} xs={6} className={style.customButton}>
          <Button
            onClick={() => {
              setSelectedService(null);
              handleShow();
            }}
            variant={"secondary"}
          >
            إضافة خدمة
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <DataTable
          className={style.houseTable}
          columns={columns}
          data={services}
          highlightOnHover
          pointerOnHover
          paginationPerPage={20}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          noDataComponent="لم يتم العثور على أيَة خدمات"
          customStyles={tableStyle}
        />
      )}

      <Modal show={modalShow} onHide={() => handleClose()}>
        <Modal.Header className={style.modalHeader}>
          <Modal.Title>
            {selectedService ? "تعديل الخدمة" : "إضافة خدمة"}
          </Modal.Title>
          <CloseButton
            onClick={handleClose}
            aria-label="Hide"
            className={style.closeButton}
          />
        </Modal.Header>
        <Modal.Body>
          {/* Tabs for switching between Medicine and Donations */}
          <Tabs
            activeKey={selectedCategory?.id}
            onSelect={(k) =>
              setSelectedCategory(categories.find((c) => c.id == k))
            }
            className="mb-3"
          >
            {categories.map((category) => (
              <Tab
                eventKey={category.id}
                title={category.name}
                key={category.id}
              ></Tab>
            ))}
          </Tabs>

          {/* Shared form for both Medicine and Donations */}
          <Form onSubmit={handleAddOrEditService}>
            <Form.Group className="my-1" controlId="name">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedService?.name || ""}
                required
              />
            </Form.Group>

            <Form.Group className="my-1" controlId="phoneNumber">
              <Form.Label>رقم الهاتف</Form.Label>
              <Form.Control
                type="number"
                defaultValue={selectedService?.phoneNumber || ""}
                required
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>الوصف</Form.Label>
              <Form.Control
                className="my-1"
                type="text"
                defaultValue={selectedService?.description || ""}
                required
              />
            </Form.Group>

            <Form.Group controlId="region">
              <Form.Label>المنطقة</Form.Label>
              <Form.Control
                className="my-1"
                as="select"
                defaultValue={selectedService?.regionId || ""}
                required
              >
                <option value="">اختر منطقة</option>
                {regions?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Subcategory changes based on activeTab */}
            <Form.Group controlId="subcategory">
              <Form.Label>الفئة</Form.Label>
              <Form.Control className="my-1" as="select" required>
                {subcategories?.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={formLoading}
              className="my-2 mt-3"
            >
              {formLoading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : selectedService ? (
                "حفظ التعديلات"
              ) : (
                "إضافة الخدمة"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ServiceUserDashboard;
