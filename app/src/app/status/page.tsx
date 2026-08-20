"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, RefreshCw } from "lucide-react";
import { Card, Badge } from "@/components/ui/Card";
import { systemStatusList, type SystemStatus, type SystemStatusEntry } from "@/lib/systemStatus";
import { cn } from "@/lib/utils";

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

const BULAN_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatSyncTime(d: Date): string {
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${BULAN_ID[d.getMonth()]} ${d.getFullYear()}, ${jam}:${menit}`;
}

export default function StatusPage() {
  const [statusList, setStatusList] = useState<SystemStatusEntry[]>(systemStatusList);
  const [syncing, setSyncing] = useState<Set<string>>(new Set());

  async function handleSync(nama: string) {
    setSyncing((prev) => new Set(prev).add(nama));
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatusList((prev) =>
      prev.map((s) => {
        if (s.nama !== nama) return s;
        const tambahan = s.dataTersinkronHariIni === 0 ? 12 : Math.floor(Math.random() * 8) + 3;
        return {
          ...s,
          status: "Terhubung",
          lastSync: formatSyncTime(new Date()),
          dataTersinkronHariIni: s.dataTersinkronHariIni + tambahan,
        };
      })
    );
    setSyncing((prev) => {
      const next = new Set(prev);
      next.delete(nama);
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
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
            tersedia. Tombol Sync mensimulasikan refresh koneksi manual; begitu
            koneksi nyata ke tiap sistem tersambung, kartu ini akan menampilkan
            status &amp; angka aktual.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statusList.map((s) => {
            const Icon = iconFor[s.status];
            const isSyncing = syncing.has(s.nama);
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

                <div className="mt-4 flex items-center justify-between">
                  <Badge tone={toneFor[s.status]}>{s.status}</Badge>
                  <button
                    type="button"
                    onClick={() => handleSync(s.nama)}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-500 hover:text-neutral-900 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white"
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
                    {isSyncing ? "Sync..." : "Sync"}
                  </button>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-neutral-200 pt-3 text-xs dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Terakhir sinkron</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{s.lastSync}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Data tersinkron hari ini</span>
                    <span className="text-neutral-700 dark:text-neutral-300 tabular-nums">
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
