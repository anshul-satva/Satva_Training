import { TrendingUp, TrendingDown } from "lucide-react";

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  color = "brand",
}) {
  const positive = change >= 0;
  const colorMap = {
    brand:
      "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
  };

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-center gap-1.5"></div>
    </div>
  );
}
