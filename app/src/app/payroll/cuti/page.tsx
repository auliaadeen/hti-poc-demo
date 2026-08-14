"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, Badge } from "@/components/ui/Card";
import { karyawanList, pengajuanCutiList } from "@/lib/payrollData";
import { FileText, Upload } from "lucide-react";

export default function CutiPage() {
  const [submitted, setSubmitted] = useState(false);

  const toneFor = (status: string) =>
    status === "Disetujui" ? "success" : status === "Ditolak" ? "danger" : "warning";

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/payroll" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">&larr; Kembali</Link>
        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-500">Cuti / Izin / Sakit</p>
        <h1 className="mt-1 text-3xl font-bold">Ajukan & pantau approval berjenjang.</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Atasan langsung → HR. Tanpa form kertas.</p>

        <Card className="mt-8">
          <p className="mb-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">Form Pengajuan</p>
          {!submitted ? (
            <div className="space-y-3">
              <select className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm">
                <option>Cuti Tahunan</option>
                <option>Izin</option>
                <option>Sakit</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm" />
                <input type="date" className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm" />
              </div>
              <textarea placeholder="Alasan singkat" className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm" rows={2} />
              <button className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                <Upload className="h-3.5 w-3.5" /> Lampirkan surat (opsional)
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setSubmitted(true)}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white hover:bg-blue-600"
              >
                Ajukan
              </motion.button>
            </div>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-400">
              Pengajuan terkirim — menunggu persetujuan atasan langsung.
            </motion.p>
          )}
        </Card>

        <h2 className="mt-10 mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">Riwayat Pengajuan</h2>
        <div className="space-y-4">
          {pengajuanCutiList.map((c) => {
            const k = karyawanList.find((x) => x.id === c.karyawanId)!;
            return (
              <Card key={c.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white">
                      <FileText className="h-4 w-4 text-neutral-500" /> {k.nama} — {c.jenis}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {c.tanggalMulai} s/d {c.tanggalSelesai} · {c.alasan}
                    </p>
                  </div>
                  <Badge tone={toneFor(c.status) as any}>{c.status}</Badge>
                </div>
                <div className="mt-3 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  {c.riwayat.map((r, i) => (
                    <p key={i} className="text-xs text-neutral-500">
                      {r.level}: <span className="text-neutral-700 dark:text-neutral-300">{r.aksi}</span> — {r.tanggal}
                    </p>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
