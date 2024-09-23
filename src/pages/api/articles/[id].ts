import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Log the ID for debugging
  console.log("Article ID:", id);

  if (req.method === "GET") {
    try {
      // Ensure the ID is a number
      const articleId = Number(id);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }

      // Fetch the article
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });
      console.log("Article:", article);

      if (!article) {
        console.log("Article not found for ID:", articleId);
        return res.status(404).json({ error: "Article not found" });
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      return res.status(500).json({ error: "Failed to fetch article" });
    }
  }

  const supabase = createClient(req, res);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User must be authenticated" });
  }

  if (req.method === "PUT") {
    const { text, photo } = req.body;

    try {
      const updatedArticle = await prisma.article.update({
        where: { id: Number(id) },
        data: {
          text,
          photo,
        },
      });
      return res.status(200).json(updatedArticle);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update article" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.article.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete article" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
