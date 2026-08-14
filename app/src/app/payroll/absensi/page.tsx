"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, Badge } from "@/components/ui/Card";
import { karyawanList, absensiHariIni } from "@/lib/payrollData";
import { Clock, LogIn, LogOut } from "lucide-react";

export default function AbsensiPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const toneFor = (status: string) =>
    status === "Tepat Waktu" ? "success" : status === "Telat" ? "warning" : status === "Belum Absen" ? "danger" : "neutral";

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/payroll" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">&larr; Kembali</Link>
        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-500">Absensi Online</p>
        <h1 className="mt-1 text-3xl font-bold">Check-in / Check-out</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Absen tanpa mesin fingerprint fisik — otomatis flag telat/lembur.</p>

        <Card className="mt-8 flex flex-col items-center py-10 text-center">
          <Clock className="mb-3 h-8 w-8 text-neutral-500" />
          <p className="text-4xl font-bold tabular-nums">{now}</p>
          <p className="mt-1 text-sm text-neutral-500">Jam kerja: 09:00 – 18:00</p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setCheckedIn((v) => !v)}
            className={`mt-6 flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-neutral-900 dark:text-white transition ${
              checkedIn ? "bg-neutral-700 hover:bg-neutral-600" : "bg-blue-700 hover:bg-blue-600"
            }`}
          >
            {checkedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {checkedIn ? "Check-out" : "Check-in Sekarang"}
          </motion.button>
          {checkedIn && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-emerald-400">
              Absen tercatat — status otomatis dihitung dari jam kerja
            </motion.p>
          )}
        </Card>

        <h2 className="mt-10 mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">Status Tim Hari Ini</h2>
        <Card>
          <div className="divide-y divide-neutral-800">
            {absensiHariIni.map((a) => {
              const k = karyawanList.find((x) => x.id === a.karyawanId)!;
              return (
                <div key={a.karyawanId} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{k.nama}</p>
                    <p className="text-xs text-neutral-500">
                      {a.checkIn ? `Masuk ${a.checkIn}` : "Belum check-in"}
                      {a.checkOut ? ` · Pulang ${a.checkOut}` : ""}
                      {a.menitTelat ? ` · Telat ${a.menitTelat} menit` : ""}
                      {a.menitLembur ? ` · Lembur ${a.menitLembur} menit` : ""}
                    </p>
                  </div>
                  <Badge tone={toneFor(a.status) as any}>{a.status}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </main>
  );
}
