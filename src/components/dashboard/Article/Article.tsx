import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import {
  fetchArticles,
  addArticle,
  updateArticle,
  deleteArticle,
} from "@/services/article";
import Swal from "sweetalert2";
import { ArticleType } from "@/types/models";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import { createClient } from "@/utils/supabase/component";
import constructImage from "@/utils/supabase/constructImage";

const supabase = createClient();

const ArticlePage = () => {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(
    null
  );
  const [modalShow, setModalShow] = useState(false);
  const [newArticleModalShow, setNewArticleModalShow] = useState(false);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllArticles = async () => {
    setLoading(true);
    const { success, data } = await fetchArticles();
    if (success) setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllArticles();
  }, []);

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
      Swal.fire("Success!", "Image uploaded successfully.", "success");
    } catch (error) {
      // Handle upload failure
      console.error("Upload failed:", error);
      Swal.fire("Error!", "Image upload failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = async (e: any) => {
    e.preventDefault();
    if (!imageFile) {
      Swal.fire("Error!", "Please upload an image.", "error");
      return;
    }
    const { success } = await addArticle({ text, photo: imageFile });
    if (success) {
      Swal.fire("Article added", "", "success");
      fetchAllArticles();
      setNewArticleModalShow(false);
    } else {
      Swal.fire("Error adding article", "", "error");
    }
  };

  const handleUpdateArticle = async (e: any) => {
    e.preventDefault();
    if (!selectedArticle) return;
    const { success } = await updateArticle(selectedArticle.id, {
      text,
      photo: imageFile || selectedArticle.photo,
    });
    if (success) {
      Swal.fire("Article updated", "", "success");
      fetchAllArticles();
      setModalShow(false);
    } else {
      Swal.fire("Error updating article", "", "error");
    }
  };

  const handleDeleteArticle = async (id: any) => {
    const { success } = await deleteArticle(id);
    if (success) {
      Swal.fire("Article deleted", "", "success");
      fetchAllArticles();
    } else {
      Swal.fire("Error deleting article", "", "error");
    }
  };

  const columns = [
    {
      name: "Text",
      selector: (row: ArticleType) => row.text,
      sortable: true,
      maxWidth: "300px",
    },
    {
      name: "Photo",
      cell: (row: ArticleType) => (
        <img
          src={constructImage(row.photo)}
          alt="article"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      name: "Actions",
      minWidth: "300px",
      button: true,
      cell: (row: ArticleType) => (
        <Row className="w-100">
          <Col md="6">
            <Button
              onClick={() => {
                setSelectedArticle(row);
                setModalShow(true);
              }}
            >
              Edit
            </Button>
          </Col>
          <Col md="6">
            <Button
              variant="danger"
              onClick={() => handleDeleteArticle(row.id)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="d-flex w-100 align-items-center flex-column">
      <h1>Article Management</h1>
      <Row className="w-100 d-flex justify-content-start align-items-center">
        <Col lg="6" md="6" sm="12">
          <Input
            type="text"
            placeholder="Search by text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100 my-2"
          />
        </Col>
        <Col lg="3" md="6" sm="6">
          <Button onClick={() => fetchAllArticles()} className="w-100">
            Refresh
          </Button>
        </Col>
        <Col lg="3" md="6" sm="6">
          <Button
            onClick={() => setNewArticleModalShow(true)}
            className="w-100"
          >
            Add New Article
          </Button>
        </Col>
      </Row>

      <DataTable
        columns={columns}
        data={articles}
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        noDataComponent="No articles found"
      />

      {/* Add New Article Modal */}
      <Modal
        show={newArticleModalShow}
        onHide={() => setNewArticleModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddArticle}>
            <Form.Group>
              <Form.Label>Text</Form.Label>
              <Form.Control
                as="textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                required
                className="mb-2"
              />
            </Form.Group>
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Article Modal */}
      {selectedArticle && (
        <Modal show={modalShow} onHide={() => setModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Article</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateArticle}>
              <Form.Group>
                <Form.Label>Text</Form.Label>
                <Form.Control
                  as="textarea"
                  defaultValue={selectedArticle.text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Photo</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              <Button type="submit" disabled={loading}>
                Save changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default ArticlePage;
