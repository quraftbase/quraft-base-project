// pages/list.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { statuses } from "@/constants/statuses";
import { generatePdf } from "@/lib/pdfGenerator";
import { useTheme } from "@/components/ThemeProvider";

type DocumentData = {
  document_id: string;
  doc_number: string;
  customer_name: string;
  estimate_date: string | null;
  estimate_amount: number | null;
  invoice_date: string | null;
  invoice_amount: number | null;
  status: number;
  memo: string;
};

export default function ListPage() {
  const { theme, toggleTheme } = useTheme();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"date_desc" | "date_asc" | "number_asc" | "number_desc">("date_desc");

  const fetchDocuments = async () => {
    const res = await fetch("/api/list");
    if (!res.ok) {
      console.error("データ取得失敗");
      return;
    }

    let filtered = (await res.json()) as DocumentData[];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((doc) =>
        doc.customer_name.toLowerCase().includes(term) ||
        doc.doc_number.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "date_asc":
          return new Date(a.estimate_date ?? "").getTime() - new Date(b.estimate_date ?? "").getTime();
        case "date_desc":
          return new Date(b.estimate_date ?? "").getTime() - new Date(a.estimate_date ?? "").getTime();
        case "number_asc":
          return a.doc_number.localeCompare(b.doc_number, "ja", { numeric: true });
        case "number_desc":
          return b.doc_number.localeCompare(a.doc_number, "ja", { numeric: true });
        default:
          return 0;
      }
    });

    setDocuments(filtered);
  };

  const isFuturistic = theme === "futuristic";

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, sortOption]);

  const getStatusLabel = (value: number) =>
    statuses.find((s) => s.value === value)?.label ?? "不明";

  return (
    <div
      className={`min-h-screen p-8 space-y-6 transition-all duration-300 ${
        isFuturistic
          ? "bg-gradient-to-b from-[#0f0f1b] to-[#1c1c2b] text-white"
          : "bg-content text-white bg-center"
      }`}
      style={
        !isFuturistic
          ? { backgroundImage: `url('/dragonball-bg3.png')` }
          : {}
      }
    >
        <h1
          className={`text-4xl font-bold mb-6 drop-shadow ${
            isFuturistic
              ? "tracking-widest text-cyan-400"
              : "font-dragonball drop-shadow-[0_0_8px_#facc15]"
          }`}
        >
          <span className={isFuturistic ? "" : "dragon"}>DOCUMENT</span>
          <span className={isFuturistic ? "" : "ball"}> LIST!!</span>
        </h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="顧客名・書類番号で検索！"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white placeholder-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white sm:w-64 ${
            isFuturistic
              ? "border-cyan-400"
              : "border-orange-500"
          }`}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}
          className={`w-full p-3 rounded-xl border-2 bg-black bg-opacity-60 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500 hover:text-black hover:bg-white sm:w-64 ${
            isFuturistic
              ? "border-cyan-400"
              : "border-orange-500"
          }`}
        >
          <option value="date_desc">見積日（新→古）</option>
          <option value="date_asc">見積日（古→新）</option>
          <option value="number_asc">書類番号（昇順）</option>
          <option value="number_desc">書類番号（降順）</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full border ${isFuturistic ? "" : "border-black bg-white shadow-lg"}`}>
          <thead className={`${isFuturistic ? "bg-gray-800 text-cyan-400" : "bg-purple-100 text-purple-800"}`}>
            <tr>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>書類番号</th>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>顧客名</th>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>見積日</th>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>見積金額</th>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>請求日</th>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>請求金額</th>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>ステータス</th>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>備考</th>
              <th className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>PDF</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.document_id} className={`${isFuturistic ? "hover:bg-gray-400" : "text-gray-500 hover:bg-purple-50"}`}>
                <td className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>{doc.doc_number}</td>
                <td className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>{doc.customer_name}</td>
                <td className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>{doc.estimate_date ?? ""}</td>
                <td className={`border px-4 py-2 text-right ${isFuturistic ? "border-cyan-400" : ""}`}>{doc.estimate_amount?.toLocaleString() ?? ""}</td>
                <td className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>{doc.invoice_date ?? ""}</td>
                <td className={`border px-4 py-2 text-right ${isFuturistic ? "border-cyan-400" : ""}`}>{doc.invoice_amount?.toLocaleString() ?? ""}</td>
                <td className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>{getStatusLabel(doc.status)}</td>
                <td className={`border px-4 py-2 ${isFuturistic ? "border-cyan-400" : ""}`}>{doc.memo}</td>
                <td className={`border px-4 py-2 space-x-2 ${isFuturistic ? "border-cyan-400" : ""}`}>
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => generatePdf(doc.document_id, "estimate")}
                  >
                    見積PDF
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => generatePdf(doc.document_id, "invoice")}
                  >
                    請求PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents.length === 0 && (
          <p className="mt-4 text-center text-white font-bold">{isFuturistic ? "該当データなし" : "該当するデータがないぞ！"}</p>
        )}
      </div>
      <div className="mt-6">
        <Link href="/" className="text-white hover:underline">
          {isFuturistic ? "← TOP" : "← カメハウスに戻る"}
        </Link>
      </div>
    </div>
  );
}
