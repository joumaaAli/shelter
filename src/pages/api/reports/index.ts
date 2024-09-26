import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User must be authenticated" });
  }

  if (req.method === "POST") {
    // Create a new report
    const { houseId, message, serviceId } = req.body;

    if (!houseId && !serviceId) {
      return res.status(400).json({ error: "Missing houseId or serviceId" });
    }

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    try {
      const newReport = await prisma.report.create({
        data: {
          houseId,
          message,
          serviceId,
        },
      });
      return res.status(201).json(newReport);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create report" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "GET") {
    // Fetch all reports
    try {
      const reports = await prisma.report.findMany({
        include: {
          house: true, // Fetch the related house
        },
      });
      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch reports" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    await prisma.$disconnect();
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
