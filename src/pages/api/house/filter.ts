// pages/api/houses/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res);

  // Get session to ensure user authentication
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
    const search = (req.query.search as string) || "";
    const spaceForPeople = req.query.spaceForPeople
      ? parseInt(req.query.spaceForPeople as string, 10)
      : null;

    try {
      // Build query for filtering houses
      let query = supabase
        .from("houses")
        .select("*")
        .eq("userId", session.user.id); // Fetch only houses belonging to the user

      // Apply search filter if provided
      if (search) {
        query = query.ilike("address", `%${search}%`); // Case-insensitive search for the address
      }

      // Apply spaceForPeople filter if provided
      if (spaceForPeople) {
        query = query.gte("spaceForPeople", spaceForPeople);
      }

      const { data: houses, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      return res.status(200).json(houses);
    } catch (error) {
      console.error("Error fetching houses:", error);
      return res.status(500).json({ error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
