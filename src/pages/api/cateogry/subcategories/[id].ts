//services/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
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

  if (error || !session) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User must be authenticated" });
  }

  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const whereClause: any = {};

      if (id) {
        whereClause.categoryId = Number(id);
      }
      const subCategories = await prisma.subcategory.findMany({
        where: whereClause,
      });

      return res.status(200).json(subCategories);
    } catch (error) {
      console.error("Error fetching subCategories:", error);
      return res.status(500).json({ error: "Failed to fetch subCategories" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    await prisma.$disconnect();
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
