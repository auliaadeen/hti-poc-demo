"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Card, Badge } from "@/components/ui/Card";
import { AccountBadge } from "@/components/AccountBadge";
import { useAuth } from "@/lib/AuthContext";
import {
  payrollHistory,
  totalRekap,
  unduhRekapCSV,
  formatRupiah,
  maskNama,
  maskRupiah,
} from "@/lib/payrollData";

export default function RekapPayrollPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tampilkanLengkap, setTampilkanLengkap] = useState(false);
  const { role } = useAuth();
  const isAdmin = role === "Admin";
  const showFull = tampilkanLengkap && isAdmin;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/payroll" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">&larr; Kembali</Link>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-500">Rekap Payroll</p>
            <h1 className="mt-1 text-3xl font-bold">Laporan per periode.</h1>
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
          Riwayat payroll yang sudah difinalisasi, per periode — bisa diekspor ke CSV.
        </p>

        <div className="mt-8 space-y-3">
          {payrollHistory.map((r) => {
            const total = totalRekap(r.hasil);
            const isOpen = expanded === r.periode;
            return (
              <motion.div key={r.periode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => setExpanded(isOpen ? null : r.periode)}
                      className="flex items-center gap-2 text-left"
                    >
                      <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{r.periode}</p>
                        <p className="text-xs text-neutral-500">{r.hasil.length} karyawan</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-4">
                      <Badge tone="success">{r.status}</Badge>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500">Total dibayarkan</p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {showFull ? formatRupiah(total.bersih) : maskRupiah(formatRupiah(total.bersih))}
                        </p>
                      </div>
                      <button
                        onClick={() => unduhRekapCSV(r.periode, r.hasil)}
                        className="flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      >
                        <Download className="h-3.5 w-3.5" /> CSV
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 overflow-x-auto border-t border-neutral-200 dark:border-neutral-800 pt-4">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                            <th className="pb-2 pr-4 font-medium">Karyawan</th>
                            <th className="pb-2 pr-4 font-medium">Bruto</th>
                            <th className="pb-2 pr-4 font-medium">Potongan</th>
                            <th className="pb-2 font-medium">Gaji Bersih</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.hasil.map((h) => (
                            <tr key={h.karyawanId} className="border-b border-neutral-100 dark:border-neutral-900">
                              <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">
                                {showFull ? h.nama : maskNama(h.nama)}
                              </td>
                              <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                                {showFull ? formatRupiah(h.penghasilanBruto) : maskRupiah(formatRupiah(h.penghasilanBruto))}
                              </td>
                              <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                                {showFull ? formatRupiah(h.totalPotonganBPJS + h.pph21) : maskRupiah(formatRupiah(h.totalPotonganBPJS + h.pph21))}
                              </td>
                              <td className="py-2 font-medium text-neutral-900 dark:text-white">
                                {showFull ? formatRupiah(h.gajiBersih) : maskRupiah(formatRupiah(h.gajiBersih))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className="pt-3 text-neutral-600 dark:text-neutral-400">Total</td>
                            <td className="pt-3 text-neutral-600 dark:text-neutral-400">
                              {showFull ? formatRupiah(total.bruto) : maskRupiah(formatRupiah(total.bruto))}
                            </td>
                            <td className="pt-3 text-neutral-600 dark:text-neutral-400">
                              {showFull ? formatRupiah(total.potongan) : maskRupiah(formatRupiah(total.potongan))}
                            </td>
                            <td className="pt-3 font-semibold text-neutral-900 dark:text-white">
                              {showFull ? formatRupiah(total.bersih) : maskRupiah(formatRupiah(total.bersih))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-neutral-600">
          Data riwayat payroll di sini contoh (mock) — begitu terhubung ke payroll engine riil, rekap ini
          otomatis terisi tiap kali payroll difinalisasi.
        </p>
      </div>
    </main>
  );
}
