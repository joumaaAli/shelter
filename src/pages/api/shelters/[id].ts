import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(id) },
      });
      if (shelter) {
        return res.status(200).json(shelter);
      } else {
        return res.status(404).json({ error: "Shelter not found" });
      }
    } catch (error) {
      console.error("Error fetching shelter:", error);
      return res.status(500).json({ error: "Failed to fetch shelter" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.shelter.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ message: "Shelter deleted" });
    } catch (error) {
      console.error("Error deleting shelter:", error);
      return res.status(500).json({ error: "Failed to delete shelter" });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
