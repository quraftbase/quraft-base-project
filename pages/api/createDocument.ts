// pages/api/createDocument.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const document = req.body

  const { data, error } = await supabase
    .from('documents')
    .insert([document])

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json(data)
}
