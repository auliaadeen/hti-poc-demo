import { ArrowRight, Users } from "lucide-react";
import { Card, Badge } from "@/components/ui/Card";
import { karyawanList, getBawahan, jenjangApproval } from "@/lib/payrollData";

export default function StrukturOrganisasiPage() {
  const levelAtas = karyawanList.filter((k) => !k.atasanId);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Struktur Organisasi</p>
        <h1 className="mt-1 text-3xl font-bold">Siapa lapor ke siapa.</h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Jenjang approval cuti/izin ikut struktur ini: karyawan → atasan langsung → HR (final).
        </p>

        {/* Org chart */}
        <div className="mt-10 flex flex-col items-center">
          <div className="rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 px-6 py-3 text-center">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Direksi</p>
            <p className="text-xs text-neutral-500">[ASUMSI: struktur di atas admin belum dimodelkan]</p>
          </div>
          <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700" />

          <div className="flex flex-wrap justify-center gap-8">
            {levelAtas.map((atasan) => {
              const bawahan = getBawahan(atasan.id);
              return (
                <div key={atasan.id} className="flex flex-col items-center">
                  <Card className="w-56 text-center">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{atasan.nama}</p>
                    <p className="text-xs text-neutral-500">{atasan.jabatan}</p>
                    <Badge tone="neutral" className="mt-2">{atasan.departemen}</Badge>
                  </Card>

                  {bawahan.length > 0 && (
                    <>
                      <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700" />
                      <div className="flex flex-wrap justify-center gap-4">
                        {bawahan.map((b) => (
                          <Card key={b.id} className="w-48 text-center">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{b.nama}</p>
                            <p className="text-xs text-neutral-500">{b.jabatan}</p>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Jenjang approval per karyawan */}
        <h2 className="mt-12 mb-3 flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          <Users className="h-4 w-4" /> Jenjang Approval per Karyawan
        </h2>
        <Card>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {karyawanList.map((k) => {
              const jenjang = jenjangApproval(k);
              return (
                <div key={k.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
                  <span className="min-w-[10rem] font-medium text-neutral-900 dark:text-white">{k.nama}</span>
                  {jenjang.map((j, i) => (
                    <span key={i} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                      {j.nama} <span className="text-xs text-neutral-500">({j.level})</span>
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>

        <p className="mt-6 text-xs text-neutral-600">
          Struktur & atasan langsung di sini data contoh (mock) — ganti sesuai bagan organisasi riil
          saat wiring ke data karyawan sebenarnya.
        </p>
      </div>
    </main>
  );
}
