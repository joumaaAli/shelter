import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const regionId = req.query.regionId ? Number(req.query.regionId) : null;

    try {
      const whereClause: any = {};
      if (regionId) {
        whereClause.regionId = regionId;
      }

      const shelters = await prisma.shelter.findMany({
        where: whereClause,
        include: { region: true },
      });

      return res.status(200).json(shelters);
    } catch (error) {
      console.error("Error fetching shelters:", error);
      return res.status(500).json({ error: "Failed to fetch shelters" });
    }
  } else if (req.method === "POST") {
    const { name, regionId } = req.body;

    try {
      const shelter = await prisma.shelter.create({
        data: {
          name,
          regionId: regionId ? Number(regionId) : null,
        },
      });
      return res.status(201).json(shelter);
    } catch (error) {
      console.error("Error creating shelter:", error);
      return res.status(500).json({ error: "Failed to create shelter" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
