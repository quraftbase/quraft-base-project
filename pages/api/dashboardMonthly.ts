// pages/api/dashboardMonthly.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.rpc('get_merged_documents');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const currentYear = new Date().getFullYear();

  // 1月〜12月 初期化
  const monthlyMap: { [month: string]: { estimateTotal: number; invoiceTotal: number } } = {};
  for (let i = 0; i < 12; i++) {
    const month = format(new Date(currentYear, i, 1), 'yyyy-MM');
    monthlyMap[month] = { estimateTotal: 0, invoiceTotal: 0 };
  }

  for (const row of data) {
    if (row.estimate_date) {
      const estDate = new Date(row.estimate_date);
      if (estDate.getFullYear() === currentYear) {
        const month = format(estDate, 'yyyy-MM');
        if (monthlyMap[month]) {
          monthlyMap[month].estimateTotal += Number(row.estimate_amount || 0);
        }
      }
    }

    if (row.invoice_date) {
      const invDate = new Date(row.invoice_date);
      if (invDate.getFullYear() === currentYear) {
        const month = format(invDate, 'yyyy-MM');
        if (monthlyMap[month]) {
          monthlyMap[month].invoiceTotal += Number(row.invoice_amount || 0);
        }
      }
    }
  }

  // 整形
  const result = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, totals]) => ({
      month,
      estimateTotal: totals.estimateTotal,
      invoiceTotal: totals.invoiceTotal,
    }));

  res.status(200).json(result);
}
