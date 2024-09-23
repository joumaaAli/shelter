import { Status } from "@/types/models";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, city, status } = req.query;
  const materiels = Array.isArray(req.query.materiels)
    ? req.query.materiels
    : req.query.materiels
    ? [req.query.materiels]
    : [];
  const specialties = Array.isArray(req.query.specialties)
    ? req.query.specialties
    : req.query.specialties
    ? [req.query.specialties]
    : [];

  try {
    if (req.method === "GET") {
      const statusEnum = status
        ? Status[status as keyof typeof Status]
        : undefined;

      const praticiens = await prisma.praticien.findMany({
        where: {
          status: {
            equals: statusEnum, // Ensure the status is ACTIVE
          },
          OR: [
            firstName
              ? {
                  firstName: {
                    contains: firstName as string,
                    mode: "insensitive",
                  },
                }
              : {},
            lastName
              ? {
                  lastName: {
                    contains: lastName as string,
                    mode: "insensitive",
                  },
                }
              : {},
            city
              ? {
                  city: {
                    name: {
                      contains: city as string,
                      mode: "insensitive",
                    },
                  },
                }
              : {},
            materiels.length
              ? {
                  materiels: {
                    some: {
                      OR: materiels.map((materiel) => ({
                        name: {
                          contains: materiel,
                          mode: "insensitive",
                        },
                      })),
                    },
                  },
                }
              : {},
            specialties.length
              ? {
                  specialties: {
                    some: {
                      OR: specialties.map((specialty) => ({
                        name: {
                          contains: specialty,
                          mode: "insensitive",
                        },
                      })),
                    },
                  },
                }
              : {},
          ],
        },
        include: {
          city: true,
          specialties: true,
          materiels: true,
        },
      });

      res.status(200).json(praticiens);
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
