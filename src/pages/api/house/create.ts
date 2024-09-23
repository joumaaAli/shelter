// pages/api/homes/create.ts

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
    const {
      name,
      address,
      phoneNumber,
      spaceForPeople,
      additionnalInformation,
    } = req.body;

    try {
      console.log(session.user.id);
      const house = await prisma.house.create({
        data: {
          name,
          address,
          phoneNumber,
          spaceForPeople,
          additionnalInformation,
          userId: session.user.id, // Associate house with the user
        },
      });
      return res.status(201).json(house);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
