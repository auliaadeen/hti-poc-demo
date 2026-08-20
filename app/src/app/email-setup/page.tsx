"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Mail, Plus, Settings, LogOut } from "lucide-react";
import { Card, KpiCard, Badge } from "@/components/ui/Card";
import { useEmailSetup } from "@/lib/EmailSetupContext";
import { STEP_ORDER, progressPercent, type EmailSetupStatus } from "@/lib/emailSetupData";

const toneFor = (status: EmailSetupStatus) =>
  status === "COMPLETED" ? "success" : status === "FAILED" ? "danger" : "warning";

const labelFor = (status: EmailSetupStatus): string => {
  if (status === "DRAFT") return "Draft";
  if (status === "FAILED") return "Gagal";
  return STEP_ORDER.find((s) => s.status === status)?.label ?? status;
};

export default function EmailSetupDashboardPage() {
  const { unlocked, logout, requests } = useEmailSetup();
  const router = useRouter();

  useEffect(() => {
    if (!unlocked) router.replace("/email-setup/login");
  }, [unlocked, router]);

  if (!unlocked) return null;

  const total = requests.length;
  const completed = requests.filter((r) => r.status === "COMPLETED").length;
  const nyangkut = requests.filter((r) => r.status !== "COMPLETED" && r.status !== "DRAFT").length;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Link
              href="/email-setup/settings"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
            >
              <Settings className="h-3.5 w-3.5" /> Settings
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/email-setup/login");
              }}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Keluar
            </button>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-500">
          <Mail className="h-4 w-4" /> Email Setup Dashboard
        </p>
        <h1 className="mt-1 text-3xl font-bold">Setup email kantor free-tier.</h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Cloudflare Email Routing + Gmail inbox + Brevo SMTP — tanpa langganan Google Workspace/Zoho.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Mode demo — status &amp; timeline di bawah ini simulasi, panggilan Cloudflare/Brevo API
            belum tersambung ke akun asli. Begitu API key beneran diisi di Settings, alur ini tinggal
            disambung ke endpoint sungguhan.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Total Request" value={String(total)} />
          <KpiCard label="Selesai (COMPLETED)" value={String(completed)} />
          <KpiCard label="Masih Berjalan" value={String(nyangkut)} sub="Nyangkut di salah satu step" />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Semua Request</h2>
          <Link
            href="/email-setup/routing"
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600"
          >
            <Plus className="h-3.5 w-3.5" /> Setup Email Baru
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {requests.length === 0 && <p className="text-sm text-neutral-500">Belum ada request.</p>}
          {requests.map((r) => (
            <Link key={r.id} href={`/email-setup/routing?id=${r.id}`}>
              <Card className="transition hover:border-blue-700/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{r.targetDomainEmail}</p>
                    <p className="text-xs text-neutral-500">{r.personalEmail} · {r.displayName}</p>
                  </div>
                  <Badge tone={toneFor(r.status)}>{labelFor(r.status)}</Badge>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className={`h-1.5 rounded-full ${r.status === "FAILED" ? "bg-red-600" : "bg-blue-600"}`}
                    style={{ width: `${progressPercent(r.status)}%` }}
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
