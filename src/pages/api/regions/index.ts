import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const regions = await prisma.region.findMany();
      return res.status(200).json(regions);
    } catch (error) {
      return res.status(500).json({ error });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    await prisma.$disconnect();
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
