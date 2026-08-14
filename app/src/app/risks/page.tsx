import Link from "next/link";
import { Card, Badge } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { risksList, skor, levelFor, type RiskLevel } from "@/lib/risksData";

const rowToneFor: Record<RiskLevel, string> = {
  Tinggi: "bg-red-50 dark:bg-red-950/20",
  Sedang: "bg-amber-50 dark:bg-amber-950/20",
  Rendah: "bg-emerald-50 dark:bg-emerald-950/20",
};

const badgeToneFor: Record<RiskLevel, "danger" | "warning" | "success"> = {
  Tinggi: "danger",
  Sedang: "warning",
  Rendah: "success",
};

export default function RisksPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            &larr; Kembali
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-red-500">
          Risk Register — Proposal Bab 9
        </p>
        <h1 className="mt-1 text-3xl font-bold">
          Daftar risiko implementasi.
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Skor = Probabilitas × Dampak (skala 1–5). Warna baris mengikuti skor:
          merah (tinggi), kuning (sedang), hijau (rendah).
        </p>

        <Card className="mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
                  <th className="py-2 pr-4 font-medium">Kode</th>
                  <th className="py-2 pr-4 font-medium">Risiko</th>
                  <th className="py-2 pr-4 font-medium">Skor (P×D)</th>
                  <th className="py-2 pr-4 font-medium">Status Penanganan</th>
                  <th className="py-2 font-medium">Pemilik</th>
                </tr>
              </thead>
              <tbody>
                {risksList.map((r) => {
                  const level = levelFor(r);
                  return (
                    <tr
                      key={r.kode}
                      className={`border-b border-neutral-100 last:border-0 dark:border-neutral-900 ${rowToneFor[level]}`}
                    >
                      <td className="py-3 pr-4 font-medium text-neutral-900 dark:text-white">{r.kode}</td>
                      <td className="py-3 pr-4 text-neutral-700 dark:text-neutral-300">{r.risiko}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {skor(r)} ({r.probabilitas}×{r.dampak})
                          </span>
                          <Badge tone={badgeToneFor[level]}>{level}</Badge>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-neutral-700 dark:text-neutral-300">{r.status}</td>
                      <td className="py-3 text-neutral-700 dark:text-neutral-300">{r.pemilik}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
