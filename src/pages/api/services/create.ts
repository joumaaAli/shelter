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
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User must be authenticated" });
  }

  if (req.method === "POST") {
    const { name, phoneNumber, description, regionId } = req.body;

    // Check for required fields
    if (!phoneNumber || !description || !regionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const service = await prisma.service.create({
        data: {
          name: name || null, // name is optional
          phoneNumber,
          description,
          regionId: parseInt(regionId),
          userId: session.user.id, // Associate service with the logged-in user
        },
      });
      res.status(201).json(service);
    } catch (error) {
      console.error("Failed to create service:", error);
      res.status(500).json({ error: "Failed to create service" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
