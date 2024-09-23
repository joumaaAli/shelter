import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchArticleById } from "@/services/article";
import { ArticleType } from "@/types/models";
import { Spinner } from "react-bootstrap";
import constructImage from "@/utils/supabase/constructImage";

const ArticleDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return; // Wait for the id to be available

      try {
        const response = await fetchArticleById(Number(id));
        setArticle(response);
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }
  return (
    <div className="container py-4">
      <img
        src={constructImage(article.photo)}
        alt="Article image"
        className="img-fluid mb-4"
      />
      <p>{article.text}</p>
    </div>
  );
};

export default ArticleDetailPage;
