import React, { useEffect, useState } from "react";
import { ArticleType } from "@/types/models";
import { Col, Row, Spinner } from "react-bootstrap";
import ArticleCard from "@/components/dashboard/Article/ArticleCard";
import { fetchArticles } from "@/services/article";

const ArticlePage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetchArticles();
        const data = response?.data;
        setArticles(data);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="title py-4">Actualité</h1>
      {loading ? (
        // Spinner centered in the middle of the page
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row>
          {articles.map((article) => (
            <Col
              key={article.id}
              md={6}
              lg={4}
              className="mb-4 d-flex justify-content-center"
              sm={12}
              xs={12}
            >
              <ArticleCard
                id={article.id}
                text={article.text}
                photo={article.photo}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ArticlePage;
