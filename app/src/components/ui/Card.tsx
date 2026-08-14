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
      <p className="text-sm text-neutral-400">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
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
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-neutral-800 text-neutral-300",
    success: "bg-emerald-950 text-emerald-400",
    warning: "bg-amber-950 text-amber-400",
    danger: "bg-red-950 text-red-400",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}
