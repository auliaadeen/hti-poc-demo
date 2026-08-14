"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, KpiCard, Badge } from "@/components/ui/Card";
import { karyawanList, absensiHariIni, pengajuanCutiList, hitungPayroll, formatRupiah, maskRupiah } from "@/lib/payrollData";

export default function DashboardPage() {
  const [tampilkanLengkap, setTampilkanLengkap] = useState(false);

  const totalBiayaSDM = karyawanList.reduce((a, k) => a + hitungPayroll(k).gajiBersih, 0);
  const hadirHariIni = absensiHariIni.filter((a) => a.checkIn).length;
  const cutiPending = pengajuanCutiList.filter((c) => c.status.startsWith("Menunggu")).length;

  const pieData = [
    { name: "Tepat Waktu", value: absensiHariIni.filter((a) => a.status === "Tepat Waktu").length, color: "#10b981" },
    { name: "Telat", value: absensiHariIni.filter((a) => a.status === "Telat").length, color: "#f59e0b" },
    { name: "Lembur", value: absensiHariIni.filter((a) => a.status === "Lembur").length, color: "#3b82f6" },
    { name: "Belum Absen", value: absensiHariIni.filter((a) => a.status === "Belum Absen").length, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/payroll" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">&larr; Kembali</Link>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold">Ringkas untuk HR & Direksi.</h1>
          </div>
          <button
            onClick={() => setTampilkanLengkap((v) => !v)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            {tampilkanLengkap ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            Tampilkan Data Lengkap
          </button>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            label="Total Biaya SDM (bulan ini)"
            value={tampilkanLengkap ? formatRupiah(totalBiayaSDM) : maskRupiah(formatRupiah(totalBiayaSDM))}
            sub="Estimasi gaji bersih seluruh karyawan"
          />
          <KpiCard label="Hadir Hari Ini" value={`${hadirHariIni} / ${karyawanList.length}`} sub="Berdasarkan absensi online" />
          <KpiCard label="Cuti/Izin Menunggu" value={String(cutiPending)} sub="Butuh tindak lanjut approval" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <p className="mb-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">Status Absensi Hari Ini</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2">
              {pieData.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <p className="mb-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">Status Kepatuhan Payroll</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Payroll periode Agustus 2026</span>
                <Badge tone="warning">Belum Dijalankan</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Perhitungan BPJS Kesehatan & Ketenagakerjaan</span>
                <Badge tone="success">Otomatis — Tarif Terkini</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Perhitungan PPh 21 (skema TER)</span>
                <Badge tone="success">Otomatis — Tarif Terkini</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Slip gaji periode sebelumnya</span>
                <Badge tone="neutral">4 dari 4 terunduh</Badge>
              </div>
            </div>
            <Link
              href="/payroll/payroll-run"
              className="mt-5 inline-block rounded-lg bg-blue-700 px-4 py-2 text-xs font-medium text-neutral-900 dark:text-white hover:bg-blue-600"
            >
              Jalankan Payroll Sekarang →
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}
