// pages/api/dashboardKpi.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
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
