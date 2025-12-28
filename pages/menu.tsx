// pages/menu.tsx
// 使ってない
'use client'

import Link from 'next/link'
import { Card, CardTitle, CardContent } from '@/components/ui/card'

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-purple-950 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10 font-jojo">ジョジョ風 見積・請求システム</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link href="/dashboard">
          <Card className="hover:scale-105 transition-transform bg-gradient-to-r from-purple-700 to-indigo-900 border-yellow-400 border-2 shadow-xl cursor-pointer">
            <CardContent>
              <CardTitle className="text-xl text-center py-6 font-jojo">ダッシュボードへ</CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href="/new">
          <Card className="hover:scale-105 transition-transform bg-gradient-to-r from-indigo-700 to-purple-800 border-yellow-400 border-2 shadow-xl cursor-pointer">
            <CardContent>
              <CardTitle className="text-xl text-center py-6 font-jojo">新しい書類を作成する</CardTitle>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
