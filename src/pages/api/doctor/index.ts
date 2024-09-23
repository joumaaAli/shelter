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
      const doctors = await prisma.doctor.findMany();
      return res.status(200).json(doctors);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }
  }

  if (req.method === "POST") {
    const { firstName, lastName, phoneNumber, email } = req.body;
    try {
      const newDoctor = await prisma.doctor.create({
        data: {
          firstName,
          lastName,
          phoneNumber,
          email,
        },
      });
      return res.status(201).json(newDoctor);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create doctor" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
