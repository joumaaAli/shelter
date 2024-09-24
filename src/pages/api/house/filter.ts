import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const search = (req.query.search as string) || "";
    const spaceForPeople = req.query.spaceForPeople
      ? parseInt(req.query.spaceForPeople as string, 10)
      : null;
    const regionId = req.query.regionId ? Number(req.query.regionId) : null;

    try {
      const whereClause: any = {
        taken: false, // Only show houses that are not taken
      };

      if (search) {
        whereClause.address = {
          contains: search,
        };
      }

      if (spaceForPeople) {
        whereClause.spaceForPeople = {
          gte: spaceForPeople,
        };
      }

      if (regionId) {
        whereClause.regionId = regionId;
      }

      const houses = await prisma.house.findMany({
        where: whereClause,
        include: {
          region: true,
        },
      });

      return res.status(200).json(houses);
    } catch (error) {
      console.error("Error fetching houses:", error);
      return res.status(500).json({ error: "Failed to fetch houses" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
