// pages/index.tsx
import { useEffect, useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import { statuses } from "@/constants/statuses";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [counts, setCounts] = useState<{ [key: number]: number }>({});
  const [kpi, setKpi] = useState({
    estimateAmount: 0,
    estimateCount: 0,
    invoiceAmount: 0,
    invoiceCount: 0,
    invoiceRecode: 0,
    invoiceRecodeCount: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);

  const isFuturistic = theme === "futuristic";

  useEffect(() => {
    fetch("/api/dashboardCounts")
      .then((res) => res.json())
      .then((data) => setCounts(data));

    fetch("/api/dashboardKpi")
      .then((res) => res.json())
      .then((data) => setKpi(data));

    fetch("/api/dashboardMonthly")
      .then((res) => res.json())
      .then((data) => setMonthlyData(data));
  }, []);

  return (
    <div
      className={`min-h-screen p-8 space-y-6 transition-all duration-300 ${
        isFuturistic
          ? "bg-gradient-to-b from-[#0f0f1b] to-[#1c1c2b] text-white"
          : "bg-content text-white bg-center"
      }`}
      style={
        !isFuturistic
          ? { backgroundImage: `url('/dragonball-bg4.png')` }
          : {}
      }
    >
      <div className="flex justify-between items-center">
        <h1
          className={`text-4xl font-bold mb-6 drop-shadow ${
            isFuturistic
              ? "tracking-widest text-cyan-400"
              : "font-dragonball drop-shadow-[0_0_8px_#facc15]"
          }`}
        >
          <span className={isFuturistic ? "" : "dragon"}>QRAFT</span>
          <span className={isFuturistic ? "" : "ball"}> BASE!!</span>
        </h1>

        {/* グローバルテーマの更新 */}
        <select
          value={theme}
          onChange={(e) => {
            const selected = e.target.value as "futuristic" | "dragonball";
            localStorage.setItem("theme", selected); // optional redundancy
            toggleTheme(); // ここで切り替え
          }}
          className={`p-2 rounded border ${
            isFuturistic
              ? "bg-gray-800 text-white border-cyan-400"
              : "bg-yellow-300 text-black border-yellow-600"
          }`}
        >
          <option value="futuristic">デフォルト</option>
          <option value="dragonball">アニメ</option>
        </select>
      </div>

      {/* ボタン群 */}
      <div className="space-x-4">
        <Link href="/new">
          <button className={isFuturistic ? 'btn-futuristic' : 'button-dragonball'}>新規作成</button>
        </Link>
        <Link href="/list">
          <button className={isFuturistic ? 'btn-futuristic' : 'button-dragonball'}>状況</button>
        </Link>
        <Link href="/company">
          <button className={isFuturistic ? 'btn-futuristic' : 'button-dragonball'}>会社情報</button>
        </Link>
      </div>

      {/* ステータス別カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((s) => (
          <DashboardCard
            key={s.value}
            title={s.label}
            count={counts[s.value] || 0}
            theme={theme}
          />
        ))}
      </div>

      {/* KPIカード 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-cyan-400 text-sm">見積件数</h3>
          <p className="text-2xl">{kpi.estimateCount}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-cyan-400 text-sm">請求件数</h3>
          <p className="text-2xl">{kpi.invoiceCount}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-cyan-400 text-sm">請求実績件数</h3>
          <p className="text-2xl">{kpi.invoiceRecodeCount}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-cyan-400 text-sm">見積総額</h3>
          <p className="text-2xl">{kpi.estimateAmount}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-cyan-400 text-sm">請求総額</h3>
          <p className="text-2xl">{kpi.invoiceAmount}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-cyan-400 text-sm">請求実績総額</h3>
          <p className="text-2xl">{kpi.invoiceRecode}</p>
        </div>
      </div>
      */}

      {/* KPIカード（件数） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="見積件数" count={kpi.estimateCount} unit="" theme={theme} />
        <DashboardCard title="請求件数" count={kpi.invoiceCount} unit="" theme={theme} />
        <DashboardCard title="請求実績件数" count={kpi.invoiceRecodeCount} unit="" theme={theme} />
      </div>

      {/* KPIカード（金額） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="見積総額" count={kpi.estimateAmount} unit="" theme={theme} />
        <DashboardCard title="請求総額" count={kpi.invoiceAmount} unit="" theme={theme} />
        <DashboardCard title="請求実績総額" count={kpi.invoiceRecode} unit="" theme={theme} />
      </div>

      {/* グラフ */}
      <div className={isFuturistic ? "bg-gray-900 p-6 rounded-xl shadow" : "bg-black bg-opacity-70 p-6 rounded-xl shadow border-4 border-yellow-400"}>
        <h2 className={isFuturistic ? "text-xl font-semibold text-cyan-300 mb-4" : "text-xl font-semibold text-yellow-300 mb-4"}>月別推移</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis
              stroke="#ccc"
              width={80}
              tickFormatter={(value) => `${(value / 10000).toLocaleString()}万`}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} 円`}
            />
            <Legend />
            <Bar dataKey="estimateTotal" fill="#00bcd4" name="見積総額" />
            <Bar dataKey="invoiceTotal" fill="#4caf50" name="請求総額" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
