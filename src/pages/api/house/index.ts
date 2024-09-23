// pages/api/homes/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const supabase = createClient(req, res);
    const search = (req.query.search as string) || "";

    const { data: session, error } = await supabase.auth.getSession();

    if (error || !session) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User must be authenticated" });
    }

    try {
      const house = await prisma.house.findMany({
        where: {
          name: {
            contains: search,
          },
        },
      });
      return res.status(200).json(house);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
