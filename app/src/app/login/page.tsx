"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, LogIn, LogOut } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth, type Role } from "@/lib/AuthContext";

export default function LoginPage() {
  const { role, setRole } = useAuth();
  const [selected, setSelected] = useState<Role>("Admin");
  const router = useRouter();

  function masuk() {
    setRole(selected);
    router.push("/");
  }

  function keluar() {
    setRole(null);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-white dark:bg-neutral-950 px-6 text-neutral-900 dark:text-neutral-100">
      <ThemeToggle className="absolute right-4 top-4 md:right-6 md:top-6" />
      <Link
        href="/"
        className="absolute left-4 top-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 md:left-6 md:top-6"
      >
        &larr; Kembali
      </Link>

      <div className="w-full max-w-sm">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-red-500">
          Login
        </p>
        <h1 className="mt-1 text-center text-2xl font-bold">Pilih peran untuk masuk.</h1>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Mode demo — bukan sistem autentikasi produksi. Tidak ada password/validasi sungguhan.</p>
        </div>

        <Card className="mt-6">
          {role && (
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Sedang masuk sebagai <span className="font-medium text-neutral-900 dark:text-white">{role}</span>.
            </p>
          )}

          <label className="block text-xs font-medium text-neutral-500">Peran</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value as Role)}
            className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
          <p className="mt-1.5 text-xs text-neutral-500">
            Viewer tidak bisa lihat data lengkap payroll atau finalisasi payroll.
          </p>

          <button
            onClick={masuk}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600"
          >
            <LogIn className="h-4 w-4" /> Masuk sebagai {selected}
          </button>

          {role && (
            <button
              onClick={keluar}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          )}
        </Card>
      </div>
    </main>
  );
}
