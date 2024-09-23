import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      const records = await prisma.record.findMany({
        include: { doctors: true },
      });
      return res.status(200).json(records);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch records" });
    }
  }

  if (req.method === "POST") {
    const { date, doctors } = req.body;
    try {
      const newRecord = await prisma.record.create({
        data: {
          date: new Date(date),
          doctors: {
            create: doctors,
          },
        },
      });
      return res.status(201).json(newRecord);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create record" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
