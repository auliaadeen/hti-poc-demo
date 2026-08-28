"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Circle,
  Loader2,
  RefreshCcw,
  FlaskConical,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useEmailSetup } from "@/lib/EmailSetupContext";
import { STEP_ORDER, stepIndexFor, type EmailSetupRequest } from "@/lib/emailSetupData";

export default function RoutingPage() {
  return (
    <Suspense fallback={null}>
      <RoutingPageInner />
    </Suspense>
  );
}

function RoutingPageInner() {
  const { unlocked, requests, createRequest, advance, confirmAlias, retry, simulateFail } = useEmailSetup();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!unlocked) router.replace("/email-setup/login");
  }, [unlocked, router]);

  const [busy, setBusy] = useState(false);
  const [personalEmail, setPersonalEmail] = useState("");
  const [targetDomainEmail, setTargetDomainEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [activeId, setActiveId] = useState<string | null>(id);

  if (!unlocked) return null;

  const active = requests.find((r) => r.id === activeId);

  async function mulai() {
    if (!personalEmail || !targetDomainEmail || !displayName) return;
    setBusy(true);
    try {
      const req = await createRequest({ personalEmail, targetDomainEmail, displayName });
      setActiveId(req.id);
      router.replace(`/email-setup/routing?id=${req.id}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Routing Email</p>
        <h1 className="mt-1 text-3xl font-bold">
          {active ? active.targetDomainEmail : "Setup email baru."}
        </h1>

        {!active && (
          <Card className="mt-8">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500">Email Pribadi (Gmail)</label>
                <input
                  type="email"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  placeholder="nama@gmail.com"
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500">Email Domain Target</label>
                <input
                  type="email"
                  value={targetDomainEmail}
                  onChange={(e) => setTargetDomainEmail(e.target.value)}
                  placeholder="nama@perusahaan.co.id"
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500">Nama Tampilan (Sender)</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nama — Perusahaan"
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={mulai}
                disabled={busy}
                className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Mulai Setup
              </motion.button>
            </div>
          </Card>
        )}

        {active && (
          <Timeline
            request={active}
            onCekStatus={async () => {
              setBusy(true);
              try {
                await advance(active.id);
              } finally {
                setBusy(false);
              }
            }}
            onKonfirmasiAlias={async () => {
              setBusy(true);
              try {
                await confirmAlias(active.id);
              } finally {
                setBusy(false);
              }
            }}
            onCobaLagi={async () => {
              setBusy(true);
              try {
                await retry(active.id);
              } finally {
                setBusy(false);
              }
            }}
            onSimulasikanGagal={async () => {
              setBusy(true);
              try {
                await simulateFail(active.id);
              } finally {
                setBusy(false);
              }
            }}
            busy={busy}
          />
        )}
      </div>
    </main>
  );
}

function Timeline({
  request,
  onCekStatus,
  onKonfirmasiAlias,
  onCobaLagi,
  onSimulasikanGagal,
  busy,
}: {
  request: EmailSetupRequest;
  onCekStatus: () => void;
  onKonfirmasiAlias: () => void;
  onCobaLagi: () => void;
  onSimulasikanGagal: () => void;
  busy: boolean;
}) {
  const activeIdx = stepIndexFor(request.status);

  return (
    <Card className="mt-8">
      <div className="space-y-5">
        {/* Saat FAILED, step2 sebelum kegagalan tetap "done" (event suksesnya beneran
            kejadian) — cuma step yang gagal beneran yang dapet ikon X. */}
        {STEP_ORDER.map((step, i) => {
          const failedAtIdx = request.status === "FAILED" ? stepIndexFor(request.statusSebelumGagal ?? "DRAFT") + 1 : -1;
          const failed = i === failedAtIdx;
          const done = request.status === "FAILED" ? i < failedAtIdx : i < activeIdx;
          const isCurrent = request.status !== "FAILED" && i === activeIdx;
          // findLast, bukan find — setelah retry, satu step bisa punya >1 event
          // (gagal lalu sukses); yang ditampilkan wajib event TERBARU.
          const event = [...request.timeline].reverse().find((t) => t.step === step.label);

          return (
            <div key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                {failed ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : done || (request.status === "COMPLETED" && i <= activeIdx) ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 animate-pulse text-blue-500" />
                ) : (
                  <Circle className="h-5 w-5 text-neutral-300 dark:text-neutral-700" />
                )}
                {i < STEP_ORDER.length - 1 && <div className="mt-1 h-8 w-px bg-neutral-200 dark:bg-neutral-800" />}
              </div>
              <div className="flex-1 pb-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{step.label}</p>
                {event && (
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {event.message} · {new Date(event.createdAt).toLocaleString("id-ID")}
                  </p>
                )}

                {failed && (
                  <div className="mt-2">
                    <p className="mb-2 text-xs text-red-600 dark:text-red-400">
                      {request.timeline[request.timeline.length - 1]?.message ?? "Step gagal."}
                    </p>
                    <button
                      onClick={onCobaLagi}
                      disabled={busy}
                      className="flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" /> Coba Lagi
                    </button>
                  </div>
                )}

                {!failed && isCurrent && step.status === "VERIFICATION_SENT" && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={onCekStatus}
                      disabled={busy}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      Cek Status
                    </button>
                    <button
                      onClick={onSimulasikanGagal}
                      disabled={busy}
                      className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      <FlaskConical className="h-3 w-3" /> Simulasikan Gagal (demo)
                    </button>
                  </div>
                )}

                {!failed && isCurrent && step.status === "ALIAS_PENDING_MANUAL" && (
                  <div className="mt-2 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 text-xs text-neutral-600 dark:text-neutral-400">
                    <p className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">Langkah manual di Gmail:</p>
                    <ol className="list-decimal space-y-1 pl-4">
                      <li>Buka Gmail → Setelan → Lihat semua setelan.</li>
                      <li>Tab &quot;Akun dan Impor&quot; → &quot;Kirim email sebagai&quot; → &quot;Tambahkan alamat email lain&quot;.</li>
                      <li>Masukkan {request.targetDomainEmail} sebagai alias, ikuti verifikasi.</li>
                      <li>Set sebagai default kalau mau balasan otomatis pakai alamat ini.</li>
                    </ol>
                    <button
                      onClick={onKonfirmasiAlias}
                      disabled={busy}
                      className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Saya Sudah Setting
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
