import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Status } from "@/types/models";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  let { status } = req.query;

  // Validate and set default status
  if (!status || !Object.values(Status).includes(status as Status)) {
    status = Status.PENDING;
  }
  const nameParts = typeof name === "string" ? name.split(" ") : [];

  try {
    if (req.method === "GET") {
      const whereClause: any = {
        status: status as string, // Filter by status
        OR: [
          { firstName: { contains: name, mode: "insensitive" } },
          { lastName: { contains: name, mode: "insensitive" } },
          { email: { contains: name, mode: "insensitive" } },
        ],
      };

      // Add more specific condition if name has two parts
      if (nameParts.length > 1) {
        whereClause.OR.push({
          AND: [
            { firstName: { contains: nameParts[0], mode: "insensitive" } },
            { lastName: { contains: nameParts[1], mode: "insensitive" } },
          ],
        });
      }

      const praticiens = await prisma.praticien.findMany({
        where: whereClause,
        include: {
          specialties: true,
          materiels: true,
          city: true,
        },
      });

      res.status(200).json(praticiens);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  } finally {
    await prisma.$disconnect();
  }
}
