import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const supabase = createClient(req, res);

  // Check user authentication
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User must be authenticated" });
  }

  if (req.method === "GET") {
    try {
      const record = await prisma.record.findUnique({
        where: { id: Number(id) },
        include: { doctors: true },
      });
      return res.status(200).json(record);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch record" });
    }
  }

  if (req.method === "PUT") {
    const { date, doctors } = req.body;
    try {
      const updatedRecord = await prisma.record.update({
        where: { id: Number(id) },
        data: {
          date: new Date(date),
          doctors: {
            deleteMany: {}, // Clear old doctors
            create: doctors, // Create new doctors
          },
        },
      });
      return res.status(200).json(updatedRecord);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update record" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.record.delete({ where: { id: Number(id) } });
      return res.status(200).json({ message: "Record deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete record" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
