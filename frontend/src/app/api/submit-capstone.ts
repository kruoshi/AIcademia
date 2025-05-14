import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const payload = req.body;
  const { error } = await supabaseAdmin.from("capstones").insert(payload);

  if (error) {
    console.error("Insert error:", error);
    return res.status(500).json({ success: false, error });
  }

  return res.status(200).json({ success: true });
}
