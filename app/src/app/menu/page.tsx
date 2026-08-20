import Link from "next/link";
import { ActivityFeed } from "@/components/ActivityFeed";
import { AccountBadge } from "@/components/AccountBadge";

const demos = [
  {
    href: "/document-ai",
    title: "Document AI",
    desc: "OCR + ekstraksi field otomatis dari PDF (invoice, PO, packing list).",
    tag: "Quick Win",
  },
  {
    href: "/dashboard",
    title: "Warehouse Visibility",
    desc: "Dashboard stok tiga gudang dalam satu layar",
    tag: "Warehouse Monitoring Strategic",
  },
  {
    href: "/payroll",
    title: "Payroll Visibility",
    desc: "Akses dan Monitoring Attendance + Payroll",
    tag: "HRIS Strategic",
  },
  {
    href: "/email-setup",
    title: "Email Setup Dashboard",
    desc: "Setup email kantor free-tier — Cloudflare + Gmail + Brevo",
    tag: "Cost Savings",
  },
];

export default function MenuPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-white dark:bg-neutral-950 px-6 text-neutral-900 dark:text-neutral-100">
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
        <AccountBadge />
        <ActivityFeed />
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded bg-red-700 px-3 py-1.5">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">ITS</span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">
          HTI Digital Operations — PoC Demo
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Demo Apps: baca dokumen otomatis, dan lihat stok gudang dalam satu
          layar.
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {demos.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-6 transition hover:border-red-700/60 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-red-500">
              {d.tag}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-100">
              {d.title}
            </h2>
            <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">{d.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
