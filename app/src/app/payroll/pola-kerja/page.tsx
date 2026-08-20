import Link from "next/link";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { karyawanList, polaKerjaList } from "@/lib/payrollData";

export default function PolaKerjaPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/payroll" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">&larr; Kembali</Link>
        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-500">Pola Kerja / Shift</p>
        <h1 className="mt-1 text-3xl font-bold">Jam kerja dasar tiap pola.</h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Absensi (telat/lembur) dihitung otomatis relatif ke pola kerja karyawan yang bersangkutan, bukan satu jam kerja tunggal untuk semua orang.
        </p>

        <div className="mt-8 space-y-4">
          {polaKerjaList.map((p) => {
            const anggota = karyawanList.filter((k) => k.polaKerjaId === p.id);
            return (
              <Card key={p.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                      <Clock className="h-4 w-4 text-neutral-500" /> {p.nama}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {p.jamMasuk} – {p.jamPulang} · {p.hariKerja.join(", ")} · toleransi telat {p.toleransiTelatMenit} menit
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                  {anggota.length === 0 && (
                    <span className="text-xs text-neutral-500">Belum ada karyawan di pola ini.</span>
                  )}
                  {anggota.map((k) => (
                    <span
                      key={k.id}
                      className="rounded-full bg-neutral-200 dark:bg-neutral-800 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300"
                    >
                      {k.nama} — {k.jabatan}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-neutral-600">
          Pola kerja & penugasan di sini data contoh (mock) — di produksi, admin bisa tambah/ubah pola dan pindahkan karyawan antar shift.
        </p>
      </div>
    </main>
  );
}
