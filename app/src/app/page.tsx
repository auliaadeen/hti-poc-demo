import Link from "next/link";

const demos = [
  {
    href: "/document-ai",
    title: "Document AI",
    desc: "OCR + ekstraksi field otomatis dari PDF (invoice, PO, packing list). Prioritas P2 — quick win.",
    tag: "P2 · Quick Win",
  },
  {
    href: "/dashboard",
    title: "Warehouse Visibility",
    desc: "Dashboard stok tiga gudang dalam satu layar, menyusul kemampuan Thailand.",
    tag: "P3 · Strategic",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-neutral-100">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded bg-red-700 px-3 py-1.5">
          <span className="text-sm font-bold text-white">ITS</span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">
          HTI Digital Operations — PoC Demo
        </h1>
        <p className="mt-3 text-neutral-400">
          Dua demo cepat untuk assessment: baca dokumen otomatis, dan lihat
          stok gudang dalam satu layar.
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {demos.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 transition hover:border-red-700/60 hover:bg-neutral-900"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-red-500">
              {d.tag}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-white group-hover:text-red-100">
              {d.title}
            </h2>
            <p className="mt-1.5 text-sm text-neutral-400">{d.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-neutral-600">
        Data ditampilkan adalah data contoh (mock) untuk keperluan demo — akan
        disambungkan ke data riil HTI saat implementasi.
      </p>
    </main>
  );
}
