// pages/company.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid'
import { useTheme } from '@/components/ThemeProvider'

export default function CompanyPage() {
  const router = useRouter();
  const { theme } = useTheme()
  const isFuturistic = theme === "futuristic";

  const [formData, setFormData] = useState({
    company_name: "",
    postal_code: "",
    address: "",
    phone: "",
    registration_number: "",
    bank: "",
    account_name: "",
    seal_url: "",
  });

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.company_name) errors.push("会社名を入力してください。");
    if (!formData.postal_code) errors.push("郵便番号を入力してください。");
    if (!formData.address) errors.push("住所を入力してください。");
    if (!formData.phone) errors.push("電話番号を入力してください。");
    if (!formData.registration_number) errors.push("登録番号を入力してください。");
    if (!formData.bank) errors.push("振込先を入力してください。");
    if (!formData.account_name) errors.push("振込先口座名義を入力してください。");
    if (!formData.seal_url) errors.push("印影（画像URL）を入力してください。");
    return errors;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage("");

    const errors = validateForm();
    if (errors.length > 0) {
      setMessage(errors.join(" "));
      setLoading(false);
      return;
    }

    const id = uuidv4();

    const res = await fetch('/api/createCompany', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        ...formData,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      setMessage('登録完了！');
      setFormData({
        company_name: "",
        postal_code: "",
        address: "",
        phone: "",
        registration_number: "",
        bank: "",
        account_name: "",
        seal_url: "",
      });
    } else {
      setMessage(`エラー: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen bg-cover bg-center text-white font-bold p-8 ${
        isFuturistic
          ? "bg-gradient-to-b from-[#0f0f1b] to-[#1c1c2b] text-white"
          : "bg-content text-white bg-center"
      }`}
      style={
        !isFuturistic
          ? { backgroundImage: `url('/dragonball-bg2.png')` }
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
          <span className={isFuturistic ? "" : "dragon"}>COMPANY INFORMATION</span>
          <span className={isFuturistic ? "" : "ball"}> REGISTRATION!!</span>
        </h1>
      
        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            ["company_name", "会社名"],
            ["postal_code", "郵便番号"],
            ["address", "住所"],
            ["phone", "電話番号"],
            ["registration_number", "登録番号"],
            ["bank", "振込先"],
            ["account_name", "振込先口座名義"],
            ["seal_url", "印影（画像URL）"],
          ].map(([company_name, label]) => (
            <div key={company_name}>
              <label className={`block text-lg mb-2 ${isFuturistic ? "text-cyan-400" : "text-orange-300"}`}>{label}</label>
              <input
                type="text"
                name={company_name}
                value={formData[company_name as keyof typeof formData]}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white ${
                  isFuturistic
                    ? "border-cyan-400"
                    : "border-orange-500"
                }`}
                // placeholder={`例）${label}`}
              />
            </div>
          ))}

          <div className="mt-6 text-center">
            <button onClick={handleSubmit} disabled={loading} className={theme === 'dragonball' ? 'button-dragonball' : 'btn-futuristic'}>
              {loading ? (isFuturistic ? "ロード中・・・" : "ロード中だ！") : (isFuturistic ? "登録" : "登録するぞ！")}
            </button>
            {message && <p className="mt-2 text-pink-200 font-semibold">{message}</p>}
          </div>
        </form>
        <div className="mt-6">
          <Link href="/" className="text-white-600 hover:underline">
            {isFuturistic ? "← TOP" : "← カメハウスに戻る"}
          </Link>
        </div>
      </div>
    </div>
  );
}
