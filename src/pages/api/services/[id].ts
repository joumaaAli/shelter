import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { name, phoneNumber, description, regionId, validated } = req.body;
    try {
      const updatedService = await prisma.service.update({
        where: { id: Number(id) },
        data: {
          name,
          phoneNumber,
          description,
          regionId: Number(regionId),
          validated,
        },
      });
      res.status(200).json(updatedService);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.service.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
}
