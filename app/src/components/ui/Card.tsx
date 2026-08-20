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
        "rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-5 shadow-sm",
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
  sub,
  delta,
  deltaPositive = true,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: string;
  deltaPositive?: boolean;
}) {
  return (
    <Card>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold text-neutral-900 dark:text-white">{value}</span>
        {delta && (
          <span
            className={cn(
              "mb-0.5 text-xs font-medium",
              deltaPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {delta}
          </span>
        )}
      </div>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones = {
    neutral: "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}
