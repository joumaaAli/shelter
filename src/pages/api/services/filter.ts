//services/filter.ts

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const search = (req.query.search as string) || "";
    const regionId = req.query.regionId ? Number(req.query.regionId) : null;
    const subcategoryId = req.query.subcategoryId;

    try {
      const whereClause: any = {};

      if (search) {
        whereClause.OR = [
          {
            name: {
              contains: search,
              mode: "insensitive", // Case-insensitive search for name
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive", // Case-insensitive search for description
            },
          },
        ];
      }

      if (regionId) {
        whereClause.regionId = regionId;
      }

      if (subcategoryId) {
        whereClause.subcategoryId = Number(subcategoryId);
      }

      whereClause.validated = true; // Only show validated services

      const services = await prisma.service.findMany({
        where: whereClause,
        include: {
          region: true,
          subcategory: {
            include: {
              category: true,
            },
          }, // Include related region data
        },
      });

      return res.status(200).json(services);
    } catch (error) {
      console.error("Error filtering services:", error);
      return res.status(500).json({ error: "Failed to filter services" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
