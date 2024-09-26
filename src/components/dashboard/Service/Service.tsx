import { fetchCategories } from "@/services/cateogires";
import { fetchRegions } from "@/services/region";
import {
  addService,
  deleteService,
  fetchServices,
  updateService,
} from "@/services/service";
import { Region } from "@/types/models";
import { Category, SubCategory } from "@/types/models";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";

const ServiceAdminDashboard = () => {
  const [services, setServices] = useState<any[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchServices(search, selectedRegion || undefined);
      setServices(data.data || []);
      setLoading(false);
    };

    const loadRegions = async () => {
      const data = await fetchRegions();
      setRegions(data.data || []);
    };

    loadServices();
    loadRegions();
  }, [search, selectedRegion]);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await fetchCategories();
      setCategories(data || []);
    };

    loadCategories();
  }, []);

  const handleCategoryChange = (e: any) => {
    const categoryId = parseInt(e.target.value);
    setSelectedCategory(categoryId);
    const selectedCategory = categories.find(
      (cat: any) => cat.id == categoryId
    );
    setSubcategories(selectedCategory?.subcategories || []);
  };

  const handleAddOrEditService = async (e: any) => {
    e.preventDefault();
    setFormLoading(true);

    const serviceData = {
      name: e.target.name.value || null,
      phoneNumber: e.target.phoneNumber.value,
      regionId: parseInt(e.target.region.value),
      description: e.target.description.value,
      validated: selectedService ? selectedService.validated : false,
      userId: selectedService?.userId || null, // Optional userId in case it's assigned to a user
      id: selectedService ? selectedService.id : undefined,
      subcategoryId: parseInt(e.target.subcategory.value),
    };

    if (selectedService) {
      serviceData.id = selectedService.id;
      await updateService(serviceData);
    } else {
      await addService(serviceData);
    }

    setModalShow(false);
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

  const handleToggleValidation = async (service: any) => {
    const updatedService = { ...service, validated: !service.validated };
    await updateService(updatedService);
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
      name: "إجراءات",
      minWidth: "400px",
      cell: (row: any) => (
        <Row>
          <Col>
            <Button
              onClick={() => {
                setSelectedService(row);
                setModalShow(true);
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
          <Col>
            <Button
              variant={row.validated ? "success" : "warning"}
              onClick={() => handleToggleValidation(row)}
            >
              {row.validated ? "إلغاء التحقق" : "تحقق"}
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="d-flex flex-column p-4">
      <h1>لوحة التحكم للخدمات</h1>
      <Row className="mb-4">
        <Col md="6">
          <Input
            type="text"
            placeholder="ابحث في الخدمات"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md="6">
          <Form.Control
            as="select"
            value={selectedRegion || ""}
            onChange={(e) =>
              setSelectedRegion(parseInt(e.target.value) || null)
            }
          >
            <option value="">اختر منطقة</option>
            {regions!.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>
      <Button
        onClick={() => {
          setSelectedService(null);
          setModalShow(true);
        }}
      >
        إضافة خدمة
      </Button>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <DataTable columns={columns} data={services} pagination />
      )}

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedService ? "تعديل الخدمة" : "إضافة خدمة"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddOrEditService}>
            <Form.Group controlId="name">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedService?.name || ""}
              />
            </Form.Group>
            <Form.Group controlId="phoneNumber">
              <Form.Label>رقم الهاتف</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedService?.phoneNumber || ""}
                required
              />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>الفئة</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory || ""}
                onChange={(e) =>
                  setSelectedCategory(parseInt(e.target.value) || null)
                }
              >
                <option value="">اختر فئة</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="subcategory">
              <Form.Label>الفئة الفرعية</Form.Label>
              <Form.Control
                as="select"
                value={selectedSubcategory || ""}
                onChange={(e) =>
                  setSelectedSubcategory(parseInt(e.target.value) || null)
                }
              >
                <option value="">اختر فئة فرعية</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>الوصف</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedService?.description || ""}
                required
              />
            </Form.Group>
            <Form.Group controlId="region">
              <Form.Label>المنطقة</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedService?.regionId || ""}
                required
              >
                <option value="">اختر منطقة</option>
                {regions!.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" disabled={formLoading}>
              {formLoading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "حفظ"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ServiceAdminDashboard;
