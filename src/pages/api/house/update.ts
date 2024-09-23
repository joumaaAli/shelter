import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Initialize Supabase client
  const supabase = createClient(req, res);

  // Check if the user is authenticated
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // If there's an error or no session, return unauthorized
  if (error || !session) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User must be authenticated" });
  }

  // Handle PUT request (update formation)
  if (req.method === "PUT") {
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
      const updatedFormation = await prisma.formation.update({
        where: { id: Number(id) },
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

      return res.status(200).json({ data: updatedFormation });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update formation" });
    }
  }

  // Handle DELETE request (delete formation)
  else if (req.method === "DELETE") {
    try {
      await prisma.formation.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ data: "Formation deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete formation" });
    }
  }

  // Handle invalid methods
  else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
