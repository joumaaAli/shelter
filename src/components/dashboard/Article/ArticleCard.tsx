import React from "react";
import { Card } from "react-bootstrap";
import { ArticleType } from "@/types/models";
import { useRouter } from "next/router";
import constructImage from "@/utils/supabase/constructImage";
import style from "./Article.module.scss";
const ArticleCard: React.FC<ArticleType> = ({ id, text, photo }) => {
  const router = useRouter();

  // Handle navigation to the article details page
  const handleCardClick = () => {
    router.push(`/actualites/${id}`);
  };

  return (
    <Card
      className={style["article-card"]}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <Card.Img variant="top" src={constructImage(photo)} alt="Article image" />
      <Card.Body>
        <Card.Text className={style["article-text"]}>{text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ArticleCard;
