//services/[id].ts

import createClient from "@/utils/supabase/api";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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

  const { id } = req.query;

  const isAdmin = session?.user?.app_metadata?.role == "super-admin";

  if (req.method === "PUT") {
    const { name, phoneNumber, description, regionId, validated } = req.body;
    try {
      const updatedService = await prisma.service.findUnique({
        where: { id: Number(id) },
      });

      if (!updatedService) {
        return res.status(404).json({ error: "Service not found" });
      }

      if (!isAdmin && updatedService.userId !== session.user.id) {
        return res.status(403).json({ error: "Forbidden: Access denied" });
      }

      const updatedServiceData = await prisma.service.update({
        where: { id: Number(id) },
        data: {
          name,
          phoneNumber,
          description,
          regionId: Number(regionId),
          validated,
        },
      });
      res.status(200).json(updatedServiceData);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const service = await prisma.service.findUnique({
        where: { id: Number(id) },
      });

      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      if (!isAdmin && service.userId !== session.user.id) {
        return res.status(403).json({ error: "Forbidden: Access denied" });
      }

      await prisma.service.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
}
