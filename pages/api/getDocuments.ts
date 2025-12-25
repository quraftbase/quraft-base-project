// 使ってない

// pages/api/getDocuments.ts
import { supabase } from "@/lib/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.rpc("get_merged_documents");

  if (error) {
    console.error("Supabase RPC Error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
}
