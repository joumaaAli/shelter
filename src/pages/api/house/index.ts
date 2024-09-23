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

    try {
      const houses = await prisma.house.findMany({
        where: {
          userId: session.user.id, // Fetch houses belonging to the user
          name: {
            contains: search,
          },
        },
      });
      return res.status(200).json(houses);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
