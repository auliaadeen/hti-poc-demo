"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  LogIn,
  LogOut,
  FileText,
  Upload,
  Download,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { Card, Badge } from "@/components/ui/Card";
import { AccountBadge } from "@/components/AccountBadge";
import { useAuth } from "@/lib/AuthContext";
import {
  karyawanList,
  absensiHariIni,
  pengajuanCutiList,
  payrollHistory,
  unduhSlipGajiPDF,
  formatRupiah,
  getPolaKerja,
  hitungStatusMasuk,
  hitungMenitLembur,
  type PengajuanCuti,
} from "@/lib/payrollData";

const toneFor = (status: string) =>
  status === "Disetujui" ? "success" : status === "Ditolak" ? "danger" : "warning";

export default function EssPage() {
  const { role, employeeId } = useAuth();

  if (role !== "Karyawan" || !employeeId) {
    return (
      <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
        <div className="mx-auto max-w-md text-center">
          <Link href="/payroll" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">&larr; Kembali</Link>
          <Card className="mt-8 flex flex-col items-center py-10 text-center">
            <ShieldAlert className="mb-3 h-8 w-8 text-amber-500" />
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Portal ESS cuma bisa diakses login sebagai peran Karyawan.
            </p>
            <Link
              href="/login"
              className="mt-5 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600"
            >
              Login sebagai Karyawan
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  return <EssDashboard employeeId={employeeId} />;
}

function EssDashboard({ employeeId }: { employeeId: string }) {
  const k = karyawanList.find((x) => x.id === employeeId)!;
  const pola = getPolaKerja(k);
  const [checkedIn, setCheckedIn] = useState(false);
  const [hasilCheckIn, setHasilCheckIn] = useState<{ status: "Tepat Waktu" | "Telat"; menitTelat?: number } | null>(null);
  const [menitLembur, setMenitLembur] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [cutiSendiri, setCutiSendiri] = useState<PengajuanCuti[]>(
    pengajuanCutiList.filter((c) => c.karyawanId === employeeId)
  );
  const [jenis, setJenis] = useState<PengajuanCuti["jenis"]>("Cuti Tahunan");
  const [tglMulai, setTglMulai] = useState("");
  const [tglSelesai, setTglSelesai] = useState("");
  const [alasan, setAlasan] = useState("");
  const [downloadingPeriode, setDownloadingPeriode] = useState<string | null>(null);

  const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const absensi = absensiHariIni.find((a) => a.karyawanId === employeeId);

  function toggleAbsen() {
    if (!checkedIn) {
      setHasilCheckIn(hitungStatusMasuk(now, pola));
      setMenitLembur(null);
      setCheckedIn(true);
    } else {
      setMenitLembur(hitungMenitLembur(now, pola));
      setHasilCheckIn(null);
      setCheckedIn(false);
    }
  }

  function ajukanCuti() {
    if (!tglMulai || !tglSelesai || !alasan) return;
    const baru: PengajuanCuti = {
      id: `CUTI-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      karyawanId: employeeId,
      jenis,
      tanggalMulai: tglMulai,
      tanggalSelesai: tglSelesai,
      alasan,
      status: "Menunggu Atasan",
      riwayat: [],
    };
    setCutiSendiri((prev) => [baru, ...prev]);
    setTglMulai("");
    setTglSelesai("");
    setAlasan("");
    setFormOpen(false);
  }

  async function unduhSlip(periode: string) {
    const rekap = payrollHistory.find((r) => r.periode === periode);
    const hasil = rekap?.hasil.find((h) => h.karyawanId === employeeId);
    if (!hasil) return;
    setDownloadingPeriode(periode);
    try {
      await unduhSlipGajiPDF(hasil, k, periode, true);
    } finally {
      setDownloadingPeriode(null);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/payroll" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">&larr; Kembali</Link>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-500">Portal ESS</p>
            <h1 className="mt-1 text-3xl font-bold">Halo, {k.nama}.</h1>
            <p className="mt-1 text-sm text-neutral-500">{k.jabatan} · {k.statusKontrak}</p>
          </div>
          <AccountBadge className="mt-3 shrink-0" />
        </div>

        {/* Absensi */}
        <Card className="mt-8 flex flex-col items-center py-10 text-center">
          <Clock className="mb-3 h-8 w-8 text-neutral-500" />
          <p className="text-4xl font-bold tabular-nums">{now}</p>
          <p className="mt-1 text-sm text-neutral-500">
            Pola kerja: {pola.nama} · {pola.jamMasuk} – {pola.jamPulang}
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={toggleAbsen}
            className={`mt-6 flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-neutral-900 dark:text-white transition ${
              checkedIn ? "bg-neutral-700 hover:bg-neutral-600" : "bg-blue-700 hover:bg-blue-600"
            }`}
          >
            {checkedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {checkedIn ? "Check-out" : "Check-in Sekarang"}
          </motion.button>

          {hasilCheckIn && (
            <p className="mt-4 text-xs text-neutral-500">
              Status: <Badge tone={hasilCheckIn.status === "Telat" ? "warning" : "success"}>{hasilCheckIn.status}</Badge>
              {hasilCheckIn.menitTelat ? ` · telat ${hasilCheckIn.menitTelat} menit` : ""}
            </p>
          )}
          {!hasilCheckIn && menitLembur !== null && (
            <p className="mt-4 text-xs text-neutral-500">
              Check-out tercatat{menitLembur > 0 ? ` · lembur ${menitLembur} menit` : ""}
            </p>
          )}
          {!hasilCheckIn && menitLembur === null && absensi && (
            <p className="mt-4 text-xs text-neutral-500">
              Status kemarin: <Badge tone={toneFor(absensi.status) as never}>{absensi.status}</Badge>
            </p>
          )}
        </Card>

        {/* Cuti */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Cuti / Izin / Sakit</h2>
          <button
            onClick={() => setFormOpen((v) => !v)}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            {formOpen ? "Batal" : "+ Ajukan Baru"}
          </button>
        </div>

        {formOpen && (
          <Card className="mt-3">
            <div className="space-y-3">
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value as PengajuanCuti["jenis"])}
                className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
              >
                <option>Cuti Tahunan</option>
                <option>Izin</option>
                <option>Sakit</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={tglMulai}
                  onChange={(e) => setTglMulai(e.target.value)}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={tglSelesai}
                  onChange={(e) => setTglSelesai(e.target.value)}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
                />
              </div>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Alasan singkat"
                rows={2}
                className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
              />
              <button className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                <Upload className="h-3.5 w-3.5" /> Lampirkan surat (opsional)
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={ajukanCuti}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white hover:bg-blue-600"
              >
                Ajukan
              </motion.button>
            </div>
          </Card>
        )}

        <div className="mt-3 space-y-3">
          {cutiSendiri.length === 0 && (
            <p className="text-sm text-neutral-500">Belum ada pengajuan cuti/izin/sakit.</p>
          )}
          {cutiSendiri.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white">
                    <FileText className="h-4 w-4 text-neutral-500" /> {c.jenis}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {c.tanggalMulai} s/d {c.tanggalSelesai} · {c.alasan}
                  </p>
                </div>
                <Badge tone={toneFor(c.status) as never}>{c.status}</Badge>
              </div>
              {c.riwayat.length > 0 && (
                <div className="mt-3 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  {c.riwayat.map((r, i) => (
                    <p key={i} className="text-xs text-neutral-500">
                      {r.level}: <span className="text-neutral-700 dark:text-neutral-300">{r.aksi}</span> — {r.tanggal}
                    </p>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Slip gaji */}
        <h2 className="mt-10 mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">Slip Gaji</h2>
        <Card>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {payrollHistory.map((r) => {
              const hasil = r.hasil.find((h) => h.karyawanId === employeeId);
              if (!hasil) return null;
              return (
                <div key={r.periode} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{r.periode}</p>
                    <p className="text-xs text-neutral-500">Gaji bersih: {formatRupiah(hasil.gajiBersih)}</p>
                  </div>
                  <button
                    onClick={() => unduhSlip(r.periode)}
                    disabled={downloadingPeriode === r.periode}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-50"
                  >
                    {downloadingPeriode === r.periode ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    PDF
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <p className="mt-6 text-xs text-neutral-600">
          Portal self-service — absen, cuti, dan slip gaji di sini cuma untuk akunmu sendiri. Data contoh (mock).
        </p>
      </div>
    </main>
  );
}
