"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type MonthlyData = {
  month: string;
  estimateTotal: number;
  invoiceTotal: number;
};

export default function MonthlyBarChart({
  data,
}: {
  data: MonthlyData[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
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
  );
}
