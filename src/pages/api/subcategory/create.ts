import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, categoryId } = req.body;

    if (!name || !categoryId) {
      return res
        .status(400)
        .json({ error: "Name and Category ID are required" });
    }

    try {
      const subcategory = await prisma.subcategory.create({
        data: {
          name,
          categoryId,
        },
      });
      return res.status(201).json(subcategory);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create subcategory" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
