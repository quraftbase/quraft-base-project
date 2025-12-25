// pages/api/documents/[id].ts
import { supabase } from "@/lib/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const documentId = Array.isArray(id) ? id[0] : id;

  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    return res.status(404).json({ error: "Document not found" });
  }

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("document_id", documentId);

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .single();

  return res.status(200).json({ document, items, company });
}
