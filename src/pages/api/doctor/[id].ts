import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import createClient from "@/utils/supabase/api";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
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
      const doctor = await prisma.doctor.findUnique({
        where: { id: Number(id) },
      });
      return res.status(200).json(doctor);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch doctor" });
    }
  }

  if (req.method === "PUT") {
    const { firstName, lastName, phoneNumber, email } = req.body;
    try {
      const updatedDoctor = await prisma.doctor.update({
        where: { id: Number(id) },
        data: { firstName, lastName, phoneNumber, email },
      });
      return res.status(200).json(updatedDoctor);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update doctor" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.doctor.delete({ where: { id: Number(id) } });
      return res.status(200).json({ message: "Doctor deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete doctor" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
