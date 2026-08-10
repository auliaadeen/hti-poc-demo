import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  deltaPositive = true,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}) {
  return (
    <Card>
      <p className="text-sm text-neutral-400">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
        {delta && (
          <span
            className={cn(
              "mb-1 text-xs font-medium",
              deltaPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </Card>
  );
}
