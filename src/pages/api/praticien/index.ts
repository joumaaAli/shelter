import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const data = req.body;
      const newPraticien = await prisma.praticien.upsert({
        where: {
          email: data.email, // Unique identifier
        },
        update: {
          ...data,
        },
        create: {
          ...data,
        },
      });
      res.status(200).json(newPraticien);
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
