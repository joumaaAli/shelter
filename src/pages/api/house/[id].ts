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

  const houseId = Number(id);

  // Check if the house belongs to the user
  const house = await prisma.house.findUnique({
    where: { id: houseId },
  });

  const admin = session?.user?.app_metadata?.role == "super-admin";

  if (!house || house.userId !== session.user.id) {
    if (!admin) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
  }

  if (req.method === "PUT") {
    const {
      name,
      address,
      phoneNumber,
      spaceForPeople,
      additionnalInformation,
      taken,
      regionId,
    } = req.body;
    try {
      const updatedHouse = await prisma.house.update({
        where: { id: houseId },
        data: {
          name,
          address,
          phoneNumber,
          spaceForPeople: parseInt(spaceForPeople),
          additionnalInformation,
          taken,
          regionId: parseInt(regionId),
        },
      });
      return res.status(200).json({ data: updatedHouse });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.house.delete({
        where: { id: houseId },
      });
      return res.status(200).json({ data: "Home deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete home" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    await prisma.$disconnect();
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
