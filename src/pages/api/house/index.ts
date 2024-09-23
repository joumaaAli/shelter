// pages/api/homes/index.ts

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

    // Assume that the role is stored in user metadata, typically under `session.user.user_metadata.role`
    const isAdmin = session?.user?.email?.includes("admin");

    try {
      const whereClause: any = {
        name: {
          contains: search,
        },
      };

      // If the user is not an admin, only show their own houses
      if (!isAdmin) {
        whereClause.userId = session.user.id;
      }

      // Fetch houses based on the role (admin sees all, others see only their houses)
      const houses = await prisma.house.findMany({
        where: whereClause,
      });

      return res.status(200).json(houses);
    } catch (error) {
      console.error("Error fetching houses:", error);
      return res.status(500).json({ error: "Failed to fetch houses" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
