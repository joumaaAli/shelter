import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const supabase = createClient(req, res);
    const search = (req.query.search as string) || "";
    const { data: formations, error } = await supabase
      .from("Formation")
      .select("*");
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(formations);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    await prisma.$disconnect();
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
