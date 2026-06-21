// components/ui/stat-card.tsx
import { cn } from "@/lib/utils/helpers";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  change?: number;       // % change (positive = up, negative = down)
  changeLabel?: string;  // "vs previous 30 days"
  subLabel?: string;     // "2 in pre-launch"
  icon?: React.ElementType;
  iconColor?: string;
  className?: string;
};

export function StatCard({
  label, value, change, changeLabel = "vs previous 30 days",
  subLabel, icon: Icon, iconColor = "text-blue-500", className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3", className)}>
      {Icon && (
        <div className={cn("mt-1 p-2 bg-gray-50 rounded-lg", iconColor)}>
          <Icon size={16} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <TrendingUp size={12} className="text-green-500 shrink-0" />
            ) : (
              <TrendingDown size={12} className="text-red-500 shrink-0" />
            )}
            <span className={cn("text-xs font-medium", isPositive ? "text-green-600" : "text-red-600")}>
              {isPositive ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-gray-400">{changeLabel}</span>
          </div>
        )}
        {subLabel && <p className="text-xs text-blue-600 mt-1">{subLabel}</p>}
      </div>
    </div>
  );
}