import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Parse the city safely
  const city = parseInt(req.query.id as string, 10);

  if (Number.isNaN(city)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    if (req.method === "PUT") {
      // Ensure the request body has the expected format
      const { name } = req.body;
      if (typeof name !== "string") {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }

      const updatedMateriel = await prisma.city.update({
        where: { id: city },
        data: { name },
      });
      res.status(200).json(updatedMateriel);
    } else if (req.method === "DELETE") {
      const deletedMateriel = await prisma.city.delete({
        where: { id: city },
      });
      res.status(200).json(deletedMateriel);
    } else {
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `An error occurred during the ${req.method}` });
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
}
