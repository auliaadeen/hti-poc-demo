"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { AccountBadge } from "@/components/AccountBadge";
import { useAuth } from "@/lib/AuthContext";
import { karyawanList, hitungPayroll, formatRupiah, maskNama, maskRupiah, unduhSlipGajiPDF, HasilPayroll } from "@/lib/payrollData";
import { Play, CheckCircle2, Download, Loader2, Eye, EyeOff } from "lucide-react";
import { useMiniSlack } from "@/lib/MiniSlackContext";

const PERIODE = "Agustus 2026";

export default function PayrollRunPage() {
  const [stage, setStage] = useState<"idle" | "processing" | "review" | "final">("idle");
  const [hasil, setHasil] = useState<HasilPayroll[]>([]);
  const [tampilkanLengkap, setTampilkanLengkap] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { role } = useAuth();
  const { post } = useMiniSlack();
  const isAdmin = role === "Admin";
  const showFull = tampilkanLengkap && isAdmin;

  function finalisasiPayroll() {
    setStage("final");
    post("payroll", `💰 Payroll periode ${PERIODE} difinalisasi — ${hasil.length} slip diterbitkan`, "payroll.finalized");
  }

  async function unduhSlip(h: HasilPayroll) {
    const k = karyawanList.find((x) => x.id === h.karyawanId);
    if (!k) return;
    setDownloadingId(h.karyawanId);
    try {
      await unduhSlipGajiPDF(h, k, PERIODE, showFull);
    } finally {
      setDownloadingId(null);
    }
  }

  function jalankanPayroll() {
    setStage("processing");
    setTimeout(() => {
      const jamLemburMock: Record<string, number> = { EMP003: 3 };
      const result = karyawanList.map((k) => hitungPayroll(k, jamLemburMock[k.id] ?? 0));
      setHasil(result);
      setStage("review");
    }, 1400);
  }

  const totalBersih = hasil.reduce((a, b) => a + b.gajiBersih, 0);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/payroll" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">&larr; Kembali</Link>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-500">Payroll Engine</p>
            <h1 className="mt-1 text-3xl font-bold">Hitung gaji sekali klik.</h1>
          </div>
          <div className="mt-3 flex shrink-0 items-center gap-2">
            <AccountBadge />
            {isAdmin && (
              <button
                onClick={() => setTampilkanLengkap((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                {tampilkanLengkap ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                Tampilkan Data Lengkap
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Gaji pokok + lembur + BPJS + PPh 21 dihitung otomatis. Ditinjau dulu sebelum difinalisasi.
        </p>

        {stage === "idle" && (
          <Card className="mt-8 flex flex-col items-center py-12 text-center">
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">Periode: Agustus 2026 · {karyawanList.length} karyawan</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={jalankanPayroll}
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-medium text-neutral-900 dark:text-white hover:bg-blue-600"
            >
              <Play className="h-4 w-4" /> Jalankan Payroll
            </motion.button>
          </Card>
        )}

        {stage === "processing" && (
          <Card className="mt-8 flex flex-col items-center py-12 text-center">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Menghitung gaji, lembur, BPJS, dan PPh 21...</p>
          </Card>
        )}

        <AnimatePresence>
          {(stage === "review" || stage === "final") && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {stage === "review" ? "Tinjau Sebelum Finalisasi" : "Payroll Difinalisasi"}
                  </p>
                  {stage === "final" && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Slip gaji tersedia
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                        <th className="pb-2 pr-4 font-medium">Karyawan</th>
                        <th className="pb-2 pr-4 font-medium">Bruto</th>
                        <th className="pb-2 pr-4 font-medium">BPJS</th>
                        <th className="pb-2 pr-4 font-medium">PPh 21</th>
                        <th className="pb-2 pr-4 font-medium">Gaji Bersih</th>
                        {stage === "final" && <th className="pb-2 font-medium">Slip</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {hasil.map((h) => (
                        <tr key={h.karyawanId} className="border-b border-neutral-100 dark:border-neutral-900">
                          <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">
                            {showFull ? h.nama : maskNama(h.nama)}
                          </td>
                          <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">
                            {showFull ? formatRupiah(h.penghasilanBruto) : maskRupiah(formatRupiah(h.penghasilanBruto))}
                          </td>
                          <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                            {showFull ? formatRupiah(h.totalPotonganBPJS) : maskRupiah(formatRupiah(h.totalPotonganBPJS))}
                          </td>
                          <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                            {showFull ? formatRupiah(h.pph21) : maskRupiah(formatRupiah(h.pph21))}
                          </td>
                          <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-white">
                            {showFull ? formatRupiah(h.gajiBersih) : maskRupiah(formatRupiah(h.gajiBersih))}
                          </td>
                          {stage === "final" && (
                            <td className="py-2">
                              <button
                                onClick={() => unduhSlip(h)}
                                disabled={downloadingId === h.karyawanId}
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                              >
                                {downloadingId === h.karyawanId ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Download className="h-3.5 w-3.5" />
                                )}
                                PDF
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="pt-3 text-right text-sm text-neutral-600 dark:text-neutral-400">Total dibayarkan</td>
                        <td className="pt-3 text-sm font-semibold text-neutral-900 dark:text-white">
                          {showFull ? formatRupiah(totalBersih) : maskRupiah(formatRupiah(totalBersih))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {stage === "review" && isAdmin && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={finalisasiPayroll}
                    className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white hover:bg-emerald-600"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Finalisasi Payroll
                  </motion.button>
                )}
                {stage === "review" && !isAdmin && (
                  <p className="mt-5 text-xs text-neutral-500">
                    Hanya peran Admin yang bisa memfinalisasi payroll.
                  </p>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-xs text-neutral-600">
          Perhitungan PPh 21 (skema TER) dan BPJS pada demo ini disederhanakan untuk ilustrasi —
          verifikasi ulang ke aturan resmi terbaru sebelum dipakai payroll riil.
        </p>
      </div>
    </main>
  );
}
