import Link from "next/link";
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Card, Badge } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { systemStatusList, type SystemStatus } from "@/lib/systemStatus";

const toneFor: Record<SystemStatus, "success" | "danger" | "warning"> = {
  Terhubung: "success",
  Terputus: "danger",
  "Belum Terintegrasi": "warning",
};

const iconFor: Record<SystemStatus, typeof CheckCircle2> = {
  Terhubung: CheckCircle2,
  Terputus: XCircle,
  "Belum Terintegrasi": HelpCircle,
};

export default function StatusPage() {
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
          Integration Status Board
        </p>
        <h1 className="mt-1 text-3xl font-bold">
          Status koneksi sistem-sistem HTI.
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Middleware monitoring — satu layar untuk memantau semua sistem terpisah HTI.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Status di bawah ini simulasi untuk demo — integrasi API real belum
            tersedia. Begitu koneksi nyata ke tiap sistem tersambung, kartu ini
            akan menampilkan status &amp; angka aktual.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemStatusList.map((s) => {
            const Icon = iconFor[s.status];
            return (
              <Card key={s.nama}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {s.nama}
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500">{s.deskripsi}</p>
                  </div>
                  <Icon
                    className={
                      s.status === "Terhubung"
                        ? "h-5 w-5 shrink-0 text-emerald-500"
                        : s.status === "Terputus"
                        ? "h-5 w-5 shrink-0 text-red-500"
                        : "h-5 w-5 shrink-0 text-amber-500"
                    }
                  />
                </div>

                <div className="mt-4">
                  <Badge tone={toneFor[s.status]}>{s.status}</Badge>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-neutral-200 pt-3 text-xs dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Terakhir sinkron</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{s.lastSync}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Data tersinkron hari ini</span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {s.dataTersinkronHariIni.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
