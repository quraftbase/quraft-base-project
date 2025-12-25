// pages/api/createDocumentWithItems.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const body = req.body

  const {
    id,
    doc_type,
    doc_date,
    doc_number,
    customer_name,
    status,
    remarks,
    due_date,
    payment_terms,
    valid_until,
    payment_due,
    items,
  } = body

  const { error: docError } = await supabase.from('documents').insert([{
    id,
    doc_type,
    doc_date,
    doc_number,
    customer_name,
    status,
    remarks,
    due_date,
    payment_terms,
    valid_until,
    payment_due,
  }])

  if (docError) {
    return res.status(500).json({ error: docError.message })
  }

  const itemData = items.map((item: any) => ({
    document_id: id,
    item_name: item.item_name,
    quantity: item.quantity,
    unit: item.unit,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
  }))

  const { error: itemError } = await supabase.from('items').insert(itemData)

  if (itemError) {
    return res.status(500).json({ error: itemError.message })
  }

  return res.status(200).json({ message: '登録完了' })
}
