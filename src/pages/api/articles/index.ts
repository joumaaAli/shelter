// pages/api/articles.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (req.method === "GET") {
    // Fetch all articles
    const { search } = req.query;
    const articles = await prisma.article.findMany({
      where: {
        text: {
          contains: search as string,
          mode: "insensitive",
        },
      },
    });
    return res.status(200).json(articles);
  }

  if (req.method === "POST") {
    if (!session) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User must be authenticated" });
    }

    const { text, photo } = req.body;

    try {
      const article = await prisma.article.create({
        data: {
          text,
          photo,
        },
      });
      return res.status(201).json(article);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create article" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
