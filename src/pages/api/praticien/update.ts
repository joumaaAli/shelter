import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Status } from "@/types/models";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { orderNumber, firstName, lastName, email, status } = req.body;

  try {
    if (req.method === "PUT") {
      if (!orderNumber) {
        res.status(400).json({ error: "orderNumber is required" });
        return;
      }
      // Update praticien details
      const updatedPraticien = await prisma.praticien.update({
        where: { orderNumber },
        data: {
          firstName,
          lastName,
          email,
          status,
        },
      });

      res.status(200).json(updatedPraticien);
    } else {
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  } finally {
    await prisma.$disconnect();
  }
}
