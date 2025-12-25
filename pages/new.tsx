// pages/new.tsx
'use client'

import Link from "next/link"
import React, { useState, ChangeEvent, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useTheme } from '@/components/ThemeProvider'

type Item = {
  item_name: string
  quantity: number
  unit: string
  unit_price: number
  subtotal: number
}

export default function NewDocumentPage() {
  const { theme } = useTheme()
  const isFuturistic = theme === "futuristic";

  // 画面テーマの変数更新
  useEffect(() => {
    document.documentElement.classList.remove('theme-futuristic', 'theme-dragonball')
    document.documentElement.classList.add(`theme-${theme}`)
  }, [theme])

  const backgroundImage =
    theme === 'dragonball'
      ? "url('/dragonball-bg.png')"
      : "url('/default-bg.jpg')"

  const [form, setForm] = useState({
    doc_type: 0,
    doc_date: '',
    doc_number: '',
    customer_name: '',
    status: 0,
    remarks: '',
  })

  const [items, setItems] = useState<Item[]>([
    { item_name: '', quantity: 1, unit: '', unit_price: 0, subtotal: 0 },
  ])

  const [extraFields, setExtraFields] = useState({
    due_date: '',
    payment_terms: '',
    valid_until: '',
    payment_due: '',
  })

  const cleanedExtraFields = Object.fromEntries(
    Object.entries(extraFields).map(([key, value]) => [key, value === '' ? null : value])
  )

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (['due_date', 'payment_terms', 'valid_until', 'payment_due'].includes(name)) {
      setExtraFields((prev) => ({ ...prev, [name]: value }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items]
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index][field] = Number(value)
    } else {
      newItems[index][field] = value as never
    }
    newItems[index].subtotal = newItems[index].quantity * newItems[index].unit_price
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { item_name: '', quantity: 1, unit: '', unit_price: 0, subtotal: 0 }])
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const validateForm = () => {
    const errors: string[] = [];

    if (!form.doc_type) errors.push("書類区分を入力してください。");
    if (!form.doc_date) errors.push("日付を入力してください。");
    if (!form.doc_number) errors.push("書類番号を入力してください。");
    if (!form.customer_name) errors.push("顧客名を入力してください。");
    if (form.doc_type == 0) {
      if (!extraFields.due_date) errors.push("納期を入力してください。");
      if (!extraFields.payment_terms) errors.push("支払条件を入力してください。");
      if (!extraFields.valid_until) errors.push("有効期限を入力してください。");
    } else {
      if (!extraFields.payment_due) errors.push("支払期限を入力してください。");
    }
    if (!form.status) errors.push("ステータスを入力してください。");
    if (!form.remarks) errors.push("備考を入力してください。");

    items.forEach((item, idx) => {
      if (item.item_name.trim() !== '') {
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`明細 ${idx + 1}: 数量を正しく入力してください。`);
        }
        if (!item.unit.trim()) {
          errors.push(`明細 ${idx + 1}: 単位を入力してください。`);
        }
        if (!item.unit_price || item.unit_price <= 0) {
          errors.push(`明細 ${idx + 1}: 単価を正しく入力してください。`);
        }
      }
    });
    return errors;
  };

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')

    const errors = validateForm();
    if (errors.length > 0) {
      setMessage(errors.join(" "));
      setLoading(false);
      return;
    }

    const documentId = uuidv4()

    const res = await fetch('/api/createDocumentWithItems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: documentId,
        ...form,
        doc_type: Number(form.doc_type),
        status: Number(form.status),
        ...cleanedExtraFields,
        items: items.map(item => ({
          ...item,
          document_id: documentId,
        })),
      }),
    })

    const result = await res.json()

    if (res.ok) {
      setMessage('登録完了！')
      setForm({
        doc_type: 0,
        doc_date: '',
        doc_number: '',
        customer_name: '',
        status: 0,
        remarks: '',
      })
      setExtraFields({
        due_date: '',
        payment_terms: '',
        valid_until: '',
        payment_due: '',
      })
      setItems([{ item_name: '', quantity: 1, unit: '', unit_price: 0, subtotal: 0 }])
    } else {
      setMessage(`エラー: ${result.error}`)
    }

    setLoading(false)
  }

  return (
    <div
      className={`min-h-screen bg-cover bg-center text-white font-bold p-8 ${
        isFuturistic
          ? "bg-gradient-to-b from-[#0f0f1b] to-[#1c1c2b] text-white"
          : "bg-content text-white bg-center"
      }`}
      style={
        !isFuturistic
          ? { backgroundImage: `url('/dragonball-bg.png')` }
          : {}
      }
    >
      <div className={isFuturistic ? "" : "bg-black bg-opacity-70 p-10 rounded-2xl max-w-3xl mx-auto shadow-2xl border-4 border-yellow-400"}>
        <h1
          className={`text-4xl font-bold mb-6 drop-shadow ${
            isFuturistic
              ? "tracking-widest text-cyan-400"
              : "font-dragonball drop-shadow-[0_0_8px_#facc15]"
          }`}
        >
          <span className={isFuturistic ? "" : "dragon"}>DOCUMENT</span>
          <span className={isFuturistic ? "" : "ball"}> PREPARATION!!</span>
        </h1>
        <div className="space-y-4">
          <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
            書類区分
            <select name="doc_type" value={form.doc_type} onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                isFuturistic
                  ? "border-cyan-400"
                  : "border-orange-500"
              }`}
            >
              <option value={0}>見積書</option>
              <option value={1}>請求書</option>
            </select>
          </label>

          <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
            日付
            <input type="date" name="doc_date" value={form.doc_date} onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                isFuturistic
                  ? "border-cyan-400"
                  : "border-orange-500"
              }`}
            />
          </label>

          <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
            書類番号
            <input type="text" name="doc_number" value={form.doc_number} onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                isFuturistic
                  ? "border-cyan-400"
                  : "border-orange-500"
              }`}
            />
          </label>

          <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
            顧客名
            <input type="text" name="customer_name" value={form.customer_name} onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                isFuturistic
                  ? "border-cyan-400"
                  : "border-orange-500"
              }`}
            />
          </label>

          {Number(form.doc_type) === 0 && (
            <>
              <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
                納期
                <input type="date" name="due_date" value={extraFields.due_date} onChange={handleChange}
                  className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                    isFuturistic
                      ? "border-cyan-400"
                      : "border-orange-500"
                  }`}
                />
              </label>
              <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
                支払条件
                <input type="text" name="payment_terms" value={extraFields.payment_terms} onChange={handleChange}
                  className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                    isFuturistic
                      ? "border-cyan-400"
                      : "border-orange-500"
                  }`}
                />
              </label>
              <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
                有効期限
                <input type="date" name="valid_until" value={extraFields.valid_until} onChange={handleChange}
                  className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                    isFuturistic
                      ? "border-cyan-400"
                      : "border-orange-500"
                  }`}
                />
              </label>
            </>
          )}

          {Number(form.doc_type) === 1 && (
            <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
              支払期限
              <input type="date" name="payment_due" value={extraFields.payment_due} onChange={handleChange}
                  className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                    isFuturistic
                      ? "border-cyan-400"
                      : "border-orange-500"
                  }`}
                />
            </label>
          )}

          <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
            ステータス
            <select name="status" value={form.status} onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                isFuturistic
                  ? "border-cyan-400"
                  : "border-orange-500"
              }`}
            >
              <option value={0}>見積書作成中</option>
              <option value={1}>商談中</option>
              <option value={2}>施工待ち</option>
              <option value={3}>納品完了</option>
              <option value={4}>請求書作成中</option>
              <option value={5}>振込確認中</option>
              <option value={9}>完了</option>
            </select>
          </label>

          <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>
            備考
            <textarea name="remarks" value={form.remarks} onChange={handleChange} rows={3}
              className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                isFuturistic
                  ? "border-cyan-400"
                  : "border-orange-500"
              }`}
            />
          </label>
        </div>

        {/* 明細 */}
        <div className={`space-y-2 border-t pt-4 mt-6 ${isFuturistic ? "border-cyan-400" : "border-yellow-400"}`}>
          <h2 className={`text-2xl font-semibold ${isFuturistic ? "text-cyan-200" : "text-yellow-200"}`}>明細{isFuturistic ? "" : "！"}</h2>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-6 gap-2 items-center">
              <input
                type="text"
                placeholder="品名"
                value={item.item_name}
                onChange={(e) => handleItemChange(idx, 'item_name', e.target.value)}
                className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                  isFuturistic
                    ? "border-cyan-400"
                    : "border-orange-500"
                }`}
              />
              <input
                type="number"
                placeholder="数量"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                  isFuturistic
                    ? "border-cyan-400"
                    : "border-orange-500"
                }`}
              />
              <input
                type="text"
                placeholder="単位"
                value={item.unit}
                onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                  isFuturistic
                    ? "border-cyan-400"
                    : "border-orange-500"
                }`}
              />
              <input
                type="number"
                placeholder="単価"
                value={item.unit_price}
                onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                  isFuturistic
                    ? "border-cyan-400"
                    : "border-orange-500"
                }`}
              />
              <div className="text-right">{item.subtotal.toLocaleString()} 円</div>
              <button type="button" onClick={() => removeItem(idx)} className="text-red-300 text-sm underline">
                削除{isFuturistic ? "" : "！"}
              </button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="mt-2 text-sm text-blue-200 underline">
            ＋ 明細を追加する{isFuturistic ? "" : "！！"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button onClick={handleSubmit} disabled={loading} className={theme === 'dragonball' ? 'button-dragonball' : 'btn-futuristic'}>
            {loading ? (isFuturistic ? "ロード中・・・" : "ロード中だ！") : (isFuturistic ? "登録" : "登録するぞ！")}
          </button>
          {message && <p className="mt-2 text-pink-200 font-semibold">{message}</p>}
        </div>

        <div className="mt-6">
          <Link href="/" className="text-white-600 hover:underline">
            {isFuturistic ? "← TOP" : "← カメハウスに戻る"}
          </Link>
        </div>
      </div>
    </div>
  )
}
