"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, KeyRound, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEmailSetup } from "@/lib/EmailSetupContext";

const PROVIDERS = [
  { id: "cloudflare" as const, nama: "Cloudflare", desc: "API Token + Zone ID buat Email Routing rule." },
  { id: "brevo" as const, nama: "Brevo", desc: "API Key buat kirim SMTP & tambah sender." },
];

export default function EmailSetupSettingsPage() {
  const { unlocked, credentials, saveCredential, testConnection } = useEmailSetup();
  const router = useRouter();

  useEffect(() => {
    if (!unlocked) router.replace("/email-setup/login");
  }, [unlocked, router]);

  if (!unlocked) return null;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <Link href="/email-setup" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            &larr; Kembali
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-500">Settings</p>
        <h1 className="mt-1 text-3xl font-bold">API Key Cloudflare & Brevo.</h1>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-3 text-xs text-neutral-600 dark:text-neutral-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Versi produksi mengenkripsi key ini (AES-256-GCM) sebelum disimpan ke database dan cuma
            pernah menampilkan versi masked. Versi demo ini nyimpen di memori browser aja — ilang begitu
            halaman di-reload penuh.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {PROVIDERS.map((p) => (
            <ProviderCard
              key={p.id}
              nama={p.nama}
              desc={p.desc}
              state={credentials[p.id]}
              onSave={(raw) => saveCredential(p.id, raw)}
              onTest={() => testConnection(p.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function ProviderCard({
  nama,
  desc,
  state,
  onSave,
  onTest,
}: {
  nama: string;
  desc: string;
  state: { saved: boolean; masked: string };
  onSave: (raw: string) => void;
  onTest: () => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(!state.saved);
  const [raw, setRaw] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "failed" | null>(null);

  async function simpan() {
    if (!raw.trim()) return;
    onSave(raw.trim());
    setRaw("");
    setEditing(false);
    setTestResult(null);
  }

  async function tesKoneksi() {
    setTesting(true);
    setTestResult(null);
    try {
      const ok = await onTest();
      setTestResult(ok ? "success" : "failed");
    } finally {
      setTesting(false);
    }
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
            <KeyRound className="h-4 w-4 text-neutral-500" /> {nama}
          </p>
          <p className="mt-1 text-xs text-neutral-500">{desc}</p>
        </div>
      </div>

      {!editing && state.saved ? (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-100 dark:bg-neutral-900 px-3 py-2">
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Tersimpan ({state.masked})</span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Ganti
          </button>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <input
            type="password"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={`${nama} API Key`}
            className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
          />
          <button
            onClick={simpan}
            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={tesKoneksi}
          disabled={testing || !state.saved}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-50"
        >
          {testing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Test Koneksi
        </button>
        {testResult === "success" && (
          <span className="flex items-center gap-1 text-xs text-emerald-500">
            <CheckCircle2 className="h-3.5 w-3.5" /> Koneksi berhasil
          </span>
        )}
        {testResult === "failed" && (
          <span className="flex items-center gap-1 text-xs text-red-500">
            <XCircle className="h-3.5 w-3.5" /> Gagal — cek key
          </span>
        )}
      </div>
    </Card>
  );
}
