import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
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

  if (req.method === "DELETE") {
    // Delete a report by ID
    try {
      const deletedReport = await prisma.report.delete({
        where: {
          id: Number(id),
        },
      });
      return res.status(200).json(deletedReport);
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete report" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    await prisma.$disconnect();
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
