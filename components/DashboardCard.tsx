// components/DashboardCard.tsx

type Props = {
  title: string;
  count: number | string;
  unit?: string;
  theme: "futuristic" | "dragonball";
  className?: string;
};

export default function DashboardCard({ title, count, unit = "", theme, className = "" }: Props) {
  return (
    <div
      className={`rounded-xl p-4 border shadow transition ${
        theme === "futuristic"
          ? "bg-[#121224] border-cyan-400 shadow-cyan-400/40"
          : "bg-black bg-opacity-70 p-10 rounded-2xl max-w-3xl shadow-2xl border-4 border-yellow-400"
      }`}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-3xl">{count} {unit}</p>
    </div>
  );
}
