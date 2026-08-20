"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  FileText,
  Mail,
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Package,
  Wallet,
  ShieldCheck,
  Radio,
  Sparkles,
} from "lucide-react";
import { Card, KpiCard } from "@/components/ui/Card";
import { MiniSlackChannelView } from "@/components/MiniSlackChannelView";
import { useMiniSlack } from "@/lib/MiniSlackContext";
import { computeDashboardStats } from "@/lib/dashboardStats";
import { systemStatusList, type SystemStatus } from "@/lib/systemStatus";
import { mockWeeklyTrend } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const modules = [
  { href: "/document-ai", title: "Document AI", desc: "OCR & ekstraksi field otomatis dari PDF", icon: FileText },
  { href: "/dashboard", title: "Warehouse Visibility", desc: "Stok tiga gudang dalam satu layar", icon: Package },
  { href: "/payroll", title: "Payroll Visibility", desc: "Absensi, cuti, payroll engine", icon: Wallet },
  { href: "/email-setup", title: "Email Setup Dashboard", desc: "Cloudflare + Gmail + Brevo, free-tier", icon: Mail },
  { href: "/assistant", title: "AI Assistant", desc: "Tanya kondisi semua modul, jawab natural language", icon: Sparkles },
];

const iconFor: Record<SystemStatus, typeof CheckCircle2> = {
  Terhubung: CheckCircle2,
  Terputus: XCircle,
  "Belum Terintegrasi": HelpCircle,
};

const statusDotFor: Record<SystemStatus, string> = {
  Terhubung: "bg-emerald-500",
  Terputus: "bg-red-500",
  "Belum Terintegrasi": "bg-amber-500",
};

const HARI_ORDER = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950";

export default function CommandCenter() {
  const { messages } = useMiniSlack();
  const { dokumenDiproses, payrollDifinalisasi, emailSetupEvents, gudangKritis, totalGudang } =
    computeDashboardStats(messages);
  const prefersReducedMotion = useReducedMotion();

  const statusCounts = systemStatusList.reduce(
    (acc, s) => {
      acc[s.status] += 1;
      return acc;
    },
    { Terhubung: 0, Terputus: 0, "Belum Terintegrasi": 0 } as Record<SystemStatus, number>
  );

  const weeklyActivity = useMemo(() => {
    const byHari = new Map<string, number>();
    for (const r of mockWeeklyTrend) {
      byHari.set(r.hari, (byHari.get(r.hari) ?? 0) + r.masuk);
    }
    return HARI_ORDER.map((hari) => ({ hari, masuk: byHari.get(hari) ?? 0 }));
  }, []);

  const peakDay = useMemo(
    () => weeklyActivity.reduce((a, b) => (b.masuk > a.masuk ? b : a), weeklyActivity[0]),
    [weeklyActivity]
  );

  return (
    <>
      {/* Hero + KPI zone — vibrant ambient background so the glass cards read as glass */}
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-red-500/25 blur-3xl dark:bg-red-500/15"
            animate={prefersReducedMotion ? undefined : { x: [0, 20, 0], y: [0, 15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -top-10 right-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-500/10"
            animate={prefersReducedMotion ? undefined : { x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 pt-6 md:px-10">
          {/* Hero */}
          <div className="grid grid-cols-1 gap-8 pb-16 lg:grid-cols-5 lg:items-center">
              <div className="lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
                  HTI Digital Operations
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">Command Center</h1>
                <p className="mt-3 max-w-xl text-base text-neutral-600 dark:text-neutral-400">
                  Semua modul operasional — dokumen, gudang, payroll, email, dan AI Assistant — dalam satu layar
                  yang jelas dan siap dipakai.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="#modul"
                    className={cn(
                      "rounded-full bg-red-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-800",
                      focusRing
                    )}
                  >
                    Buka Modul
                  </Link>
                  <Link
                    href="/assistant"
                    className={cn(
                      "rounded-full border border-neutral-300 bg-white/50 px-5 py-2.5 text-sm font-medium text-neutral-700 backdrop-blur transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white",
                      focusRing
                    )}
                  >
                    Tanya AI Assistant
                  </Link>
                </div>
              </div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-xl shadow-red-950/5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Ringkasan Operasional
                    </p>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span
                          className={cn(
                            "absolute inline-flex h-full w-full rounded-full bg-emerald-400",
                            !prefersReducedMotion && "animate-ping"
                          )}
                        />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      Tersinkron
                    </span>
                  </div>

                  <div className="mt-4 h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyActivity} margin={{ top: 4, right: 14, left: 8, bottom: 0 }}>
                        <defs>
                          <linearGradient id="heroActivityFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#dc2626" stopOpacity={0.45} />
                            <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="hari"
                          stroke="#8a8a8a"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--tooltip-bg)",
                            color: "var(--tooltip-fg)",
                            border: "1px solid var(--tooltip-border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="masuk"
                          stroke="#dc2626"
                          strokeWidth={2}
                          fill="url(#heroActivityFill)"
                          name="Barang masuk"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="sr-only">
                    Grafik aktivitas gudang mingguan. Puncak pada hari {peakDay.hari} dengan {peakDay.masuk} unit
                    barang masuk.
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Barang masuk gudang, 7 hari terakhir — puncak {peakDay.hari}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-200/70 pt-4 dark:border-neutral-700/50">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold tabular-nums">{dokumenDiproses}</p>
                        <p className="text-[11px] text-neutral-500">Dokumen diproses</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold tabular-nums">{emailSetupEvents}</p>
                        <p className="text-[11px] text-neutral-500">Request email setup</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* KPI strip — overlaps the hero's bottom edge for a layered dashboard feel */}
            <div className="relative z-10 -mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                icon={FileText}
                label="Dokumen Diproses"
                value={String(dokumenDiproses)}
                sub="Sesi ini — Document AI"
              />
              <KpiCard
                icon={Wallet}
                label="Status Payroll"
                value={payrollDifinalisasi ? "Difinalisasi" : "Belum Dijalankan"}
                sub="Periode berjalan"
              />
              <KpiCard
                icon={Mail}
                label="Request Email Setup"
                value={String(emailSetupEvents)}
                sub="Event tercatat sesi ini"
              />
              <KpiCard
                icon={gudangKritis > 0 ? AlertTriangle : Package}
                label="Gudang Stok Kritis"
                value={`${gudangKritis} dari ${totalGudang}`}
                sub="Di bawah ambang batas"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-10 md:px-10">
          {/* Trust badges — system integration status */}
          <Card className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Terintegrasi dengan Sistem Operasional
                </p>
                <span className="text-xs text-neutral-500">
                  {statusCounts.Terhubung} terhubung
                  {statusCounts.Terputus > 0 && ` · ${statusCounts.Terputus} terputus`}
                  {statusCounts["Belum Terintegrasi"] > 0 && ` · ${statusCounts["Belum Terintegrasi"]} belum`}
                </span>
              </div>
              <Link
                href="/status"
                className={cn(
                  "shrink-0 rounded text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400",
                  focusRing
                )}
              >
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
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 px-3 py-1.5 text-xs backdrop-blur transition-colors hover:border-neutral-400 dark:border-white/10 dark:bg-neutral-900/40 dark:hover:border-neutral-600",
                      focusRing
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className={
                        s.status === "Terhubung"
                          ? "h-3.5 w-3.5 text-emerald-500"
                          : s.status === "Terputus"
                          ? "h-3.5 w-3.5 text-red-500"
                          : "h-3.5 w-3.5 text-amber-500"
                      }
                    />
                    {s.nama}
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusDotFor[s.status])} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Feature highlights */}
            <div id="modul" className="scroll-mt-8 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Modul</p>
                <Link
                  href="/menu"
                  className={cn(
                    "flex items-center gap-1 rounded text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
                    focusRing
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Tampilan klasik
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {modules.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={m.href}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: prefersReducedMotion ? 0 : i * 0.04, ease: "easeOut" }}
                    >
                      <Link
                        href={m.href}
                        className={cn(
                          "group flex h-full items-start gap-4 rounded-xl border border-white/60 bg-white/50 p-6 backdrop-blur-xl transition-colors hover:border-red-700/60 hover:bg-white/70 active:scale-[0.99] dark:border-white/10 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/60",
                          focusRing
                        )}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-700/10 text-red-600 dark:text-red-400">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-100">
                            {m.title}
                          </h2>
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{m.desc}</p>
                        </div>
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Activity feed */}
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <Radio className="h-3.5 w-3.5 text-neutral-500" aria-hidden="true" />
                  Aktivitas Terbaru
                </p>
                <Link
                  href="/chat"
                  className={cn("rounded text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400", focusRing)}
                >
                  Lihat semua &rarr;
                </Link>
              </div>
              <MiniSlackChannelView variant="preview" limit={6} />
            </Card>
          </div>
        </div>
    </>
  );
}
