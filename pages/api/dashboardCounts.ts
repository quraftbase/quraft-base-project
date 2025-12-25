// pages/api/dashboardCounts.ts

import { supabase } from "@/lib/supabaseClient";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('documents')
    .select('doc_number, status, updated_at');

  if (error) return res.status(500).json({ error: error.message });

  // 最新のupdated_atを持つレコードだけをdoc_numberごとに保持
  const latestDocsMap = new Map<string, any>();

  data?.forEach((doc: any) => {
    const existing = latestDocsMap.get(doc.doc_number);
    if (!existing || new Date(doc.updated_at) > new Date(existing.updated_at)) {
      latestDocsMap.set(doc.doc_number, doc);
    }
  });

  // ステータスごとにカウント
  const statusCounts: { [key: string]: number } = {};

  for (const doc of latestDocsMap.values()) {
    const status = doc.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  }

  res.status(200).json(statusCounts);
}
