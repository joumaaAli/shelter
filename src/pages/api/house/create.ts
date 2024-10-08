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
      regionId,
      free,
      price,
    } = req.body;

    const isAdmin = session?.user?.app_metadata?.role == "super-admin";
    try {
      const house = await prisma.house.create({
        data: {
          name,
          address,
          phoneNumber,
          spaceForPeople: parseInt(spaceForPeople),
          additionnalInformation,
          regionId: parseInt(regionId),
          userId: isAdmin ? null : session.user.id,
          free,
          price: parseInt(price),
        },
      });
      return res.status(201).json(house);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    await prisma.$disconnect();
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
