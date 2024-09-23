import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.name as string;
  const nameParts = name.split(" "); // Split the name into parts

  try {
    if (req.method === "GET") {
      const praticien = await prisma.praticien.findMany({
        where: {
          OR: [
            {
              firstName: {
                contains: name,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: name,
                mode: "insensitive",
              },
            },

            {
              AND: [
                {
                  firstName: {
                    contains: nameParts[0],
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: nameParts[1],
                    mode: "insensitive",
                  },
                },
              ],
            },
            {
              email: {
                contains: name,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          specialties: true,
          materiels: true,
          city: true,
        },
      });

      if (praticien) {
        res.status(200).json(praticien);
      } else {
        res.status(404).json({ message: "Praticien not found" });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `An error occurred during the ${req.method}` });
  } finally {
    await prisma.$disconnect();
  }
}
