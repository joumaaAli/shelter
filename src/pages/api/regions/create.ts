import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name } = req.body;

    try {
      const region = await prisma.region.create({
        data: {
          name,
        },
      });
      return res.status(201).json(region);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create region" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    await prisma.$disconnect();
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
