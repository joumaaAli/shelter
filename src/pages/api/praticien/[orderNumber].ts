import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const orderNumber = req.query.orderNumber as string;

  if (Number.isNaN(orderNumber)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    if (req.method === "GET") {
      const praticien = await prisma.praticien.findUnique({
        where: { orderNumber },
      });

      if (praticien) {
        res.status(200).json(praticien);
      } else {
        res.status(404).json({ message: "Praticien not found" });
      }
    } else if (req.method === "PUT") {
      const { status } = req.body;
      const updatedPraticien = await prisma.praticien.update({
        where: { orderNumber },
        data: { status },
      });
      res.status(200).json(updatedPraticien);
    } else if (req.method === "DELETE") {
      const deletedPraticien = await prisma.praticien.delete({
        where: { orderNumber },
      });
      res.status(200).json(deletedPraticien);
    } else {
      res.setHeader("Allow", ["GET", "PUT ", "DELETE"]);
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
