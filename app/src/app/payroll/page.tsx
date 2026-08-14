import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const menu = [
  { href: "/payroll/absensi", title: "Absensi", desc: "Check-in/out online, auto-flag telat & lembur" },
  { href: "/payroll/cuti", title: "Cuti / Izin / Sakit", desc: "Ajukan & pantau approval berjenjang" },
  { href: "/payroll/payroll-run", title: "Payroll Run", desc: "Hitung gaji + BPJS + PPh 21 sekali klik" },
  { href: "/payroll/dashboard", title: "Dashboard", desc: "Ringkas biaya SDM untuk HR & Direksi" },
];

export default function PayrollHome() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-white dark:bg-neutral-950 px-6 text-neutral-900 dark:text-neutral-100">
      <ThemeToggle className="absolute right-4 top-4 md:right-6 md:top-6" />
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded bg-blue-700 px-3 py-1.5">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">PayrollKita</span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">Internal Payroll & HR Tool</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">Prototipe MVP — pengganti langganan vendor payroll pihak ketiga.</p>
      </div>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {menu.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-6 transition hover:border-blue-700/60 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-100">{m.title}</h2>
            <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">{m.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-neutral-600">
        Data karyawan, absensi, dan payroll di sini adalah data contoh (mock).
      </p>
    </main>
  );
}
