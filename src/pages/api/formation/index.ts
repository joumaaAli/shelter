// pages/api/formations.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res); // Initialize Supabase client

  // Check if the user is authenticated
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
      theme,
      startDate,
      endDate,
      location,
      organism,
      phoneNumber,
      email,
      profileImg,
    } = req.body;

    try {
      // Create the formation entry in the database
      const formation = await prisma.formation.create({
        data: {
          theme,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location,
          organism,
          phoneNumber,
          email,
          profileImg,
        },
      });
      return res.status(201).json(formation);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while creating the formation." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
