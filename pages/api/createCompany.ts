// pages/api/createCompany.ts
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
    company_name,
    postal_code,
    address,
    phone,
    registration_number,
    bank,
    account_name,
    seal_url,
  } = body

  const { error: docError } = await supabase.from('companies').insert([{
    id,
    company_name,
    postal_code,
    address,
    phone,
    registration_number,
    bank,
    account_name,
    seal_url,
  }])

  if (docError) {
    return res.status(500).json({ error: docError.message })
  }
  
  return res.status(200).json({ message: '登録完了' })
}
