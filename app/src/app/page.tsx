"use client";

import Link from "next/link";
import {
  FileText,
  Package,
  Wallet,
  Mail,
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccountBadge } from "@/components/AccountBadge";
import { Card, KpiCard } from "@/components/ui/Card";
import { MiniSlackChannelView } from "@/components/MiniSlackChannelView";
import { useMiniSlack } from "@/lib/MiniSlackContext";
import { mockWarehouseStock } from "@/lib/mockData";
import { systemStatusList, type SystemStatus } from "@/lib/systemStatus";

const STOK_KRITIS_AMBANG = 3500;

const modules = [
  { href: "/document-ai", title: "Document AI", desc: "OCR & ekstraksi field otomatis dari PDF", icon: FileText },
  { href: "/dashboard", title: "Warehouse Visibility", desc: "Stok tiga gudang dalam satu layar", icon: Package },
  { href: "/payroll", title: "Payroll Visibility", desc: "Absensi, cuti, payroll engine", icon: Wallet },
  { href: "/email-setup", title: "Email Setup Dashboard", desc: "Cloudflare + Gmail + Brevo, free-tier", icon: Mail },
];

const toneFor: Record<SystemStatus, "success" | "danger" | "warning"> = {
  Terhubung: "success",
  Terputus: "danger",
  "Belum Terintegrasi": "warning",
};

const iconFor: Record<SystemStatus, typeof CheckCircle2> = {
  Terhubung: CheckCircle2,
  Terputus: XCircle,
  "Belum Terintegrasi": HelpCircle,
};

export default function CommandCenter() {
  const { messages } = useMiniSlack();

  const dokumenDiproses = messages.filter((m) => m.channelSlug === "document-ai").length;
  const payrollDifinalisasi = messages.some(
    (m) => m.channelSlug === "payroll" && m.content.includes("difinalisasi")
  );
  const emailSetupEvents = messages.filter((m) => m.channelSlug === "email-setup").length;
  const gudangKritis = mockWarehouseStock.filter((g) => g.stok < STOK_KRITIS_AMBANG).length;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded bg-red-700 px-3 py-1.5">
              <span className="text-sm font-bold text-white">ITS</span>
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Command Center</h1>
            <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
              HTI Digital Operations — semua modul dalam satu layar.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <AccountBadge />
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Dokumen Diproses" value={String(dokumenDiproses)} sub="Sesi ini — Document AI" />
          <KpiCard
            label="Status Payroll"
            value={payrollDifinalisasi ? "Difinalisasi" : "Belum Dijalankan"}
            sub="Periode berjalan"
          />
          <KpiCard label="Request Email Setup" value={String(emailSetupEvents)} sub="Event tercatat sesi ini" />
          <KpiCard label="Gudang Stok Kritis" value={`${gudangKritis} dari ${mockWarehouseStock.length}`} sub="Di bawah ambang batas" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Status Integrasi Sistem</p>
              <Link href="/status" className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Detail &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {systemStatusList.map((s) => {
                const Icon = iconFor[s.status];
                return (
                  <Link
                    key={s.nama}
                    href="/status"
                    className="flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs hover:border-neutral-400 dark:hover:border-neutral-600"
                  >
                    <Icon
                      className={
                        s.status === "Terhubung"
                          ? "h-3.5 w-3.5 text-emerald-500"
                          : s.status === "Terputus"
                          ? "h-3.5 w-3.5 text-red-500"
                          : "h-3.5 w-3.5 text-amber-500"
                      }
                    />
                    {s.nama}
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Aktivitas Terbaru</p>
              <Link href="/chat" className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Lihat semua &rarr;
              </Link>
            </div>
            <MiniSlackChannelView variant="preview" limit={6} />
          </Card>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Modul</p>
          <Link
            href="/menu"
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Tampilan klasik
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="group flex items-start gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-6 transition hover:border-red-700/60 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-700/10 text-red-600 dark:text-red-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-100">
                    {m.title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{m.desc}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-400 opacity-0 transition group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
