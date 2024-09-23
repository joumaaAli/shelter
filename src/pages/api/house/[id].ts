// pages/api/homes/[id].ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

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

  if (req.method === "PUT") {
    const {
      name,
      address,
      phoneNumber,
      spaceForPeople,
      additionnalInformation,
    } = req.body;

    try {
      const updatedHome = await prisma.house.update({
        where: { id: Number(id) },
        data: {
          name,
          address,
          phoneNumber,
          spaceForPeople,
          additionnalInformation,
        },
      });
      return res.status(200).json({ data: updatedHome });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update home" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.house.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ data: "Home deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete home" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
