import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, Badge } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { kpiIndicators } from "@/lib/kpiData";

export default function KpiPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            &larr; Kembali
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-red-500">
          KPI Dashboard — Proposal Bab 10
        </p>
        <h1 className="mt-1 text-3xl font-bold">
          Target vs capaian implementasi.
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Data di bawah ini contoh (mock) untuk demo PoC — sengaja tidak semua
          indikator hijau, biar cerminkan progres implementasi yang sesungguhnya.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {kpiIndicators.map((k) => (
            <Card key={k.id}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">{k.label}</h2>
                {k.met ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                <span>{k.targetLabel}</span>
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{k.currentLabel}</span>
              </div>

              <div className="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div
                  className={`h-2 rounded-full ${k.met ? "bg-emerald-500" : "bg-red-500"}`}
                  style={{ width: `${k.progressPercent}%` }}
                />
              </div>

              <div className="mt-3">
                <Badge tone={k.met ? "success" : "danger"}>
                  {k.met ? "Tercapai" : "Belum Tercapai"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
