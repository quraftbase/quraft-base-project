// pages/api/dashboardKpi.ts

import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.rpc('get_merged_documentskpi');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const result = data?.[0] || {};

  res.status(200).json({
    estimateAmount: result.estimate_amount,
    estimateCount: result.estimate_count,
    invoiceAmount: result.invoice_amount,
    invoiceCount: result.invoice_count,
    invoiceRecode: result.invoice_recode,  
    invoiceRecodeCount: result.invoice_recode_count,
  });
}
