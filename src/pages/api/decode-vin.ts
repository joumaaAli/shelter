import { NextApiRequest, NextApiResponse } from "next";

// VIN decoder API endpoint (NHTSA)
const VIN_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { vin } = req.query;

  // Ensure a VIN is provided
  if (!vin || typeof vin !== "string") {
    return res.status(400).json({ error: "VIN is required" });
  }

  try {
    // Fetch data from NHTSA VIN Decoder API
    const response = await fetch(`${VIN_API_URL}${vin}?format=json`);
    const data = await response.json();

    // Return the decoded VIN data
    res.status(200).json(data);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "Failed to decode VIN" });
  }
}
