import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";
import { PrismaClient } from "@prisma/client";

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

  if (req.method === "GET") {
    const search = (req.query.search as string) || "";
    const regionId = req.query.regionId ? Number(req.query.regionId) : null;
    const isAdmin = session?.user?.app_metadata?.role == "super-admin";
    try {
      const whereClause: any = {};

      if (search) {
        whereClause.address = {
          contains: search,
        };
      }

      if (!isAdmin) {
        whereClause.userId = session.user.id;
      }

      if (regionId) {
        whereClause.regionId = regionId;
      }

      const services = await prisma.service.findMany({
        where: whereClause,
        include: {
          region: true,
        },
      });

      return res.status(200).json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      return res.status(500).json({ error: "Failed to fetch services" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    await prisma.$disconnect();
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
