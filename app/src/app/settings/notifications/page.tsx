"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, KeyRound, Info, Send, SkipForward } from "lucide-react";
import { Card, Badge } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNotifications } from "@/lib/NotificationContext";
import {
  EVENT_LABELS,
  CHANNEL_LABELS,
  type NotificationChannelType,
  type NotificationEventType,
} from "@/lib/notificationData";

const CHANNELS: { id: NotificationChannelType; desc: string; placeholder: string; dispatchable: boolean }[] = [
  { id: "discord", desc: "Webhook URL — event masuk sebagai pesan bot di channel Discord.", placeholder: "https://discord.com/api/webhooks/...", dispatchable: true },
  {
    id: "email",
    desc: "SMTP — bisa reuse akun Brevo yang sama dari Email Setup. Input ulang di sini karena kredensial Email Setup sengaja diisolasi di balik login-nya sendiri (lihat Part 1).",
    placeholder: "Host:Port:Username:Password:FromAddress",
    dispatchable: true,
  },
  {
    id: "tally",
    desc: "Webhook Signing Secret — dipakai verifikasi form Tally yang masuk ke app, BUKAN kirim notifikasi ke Tally (Tally gak nerima notif masuk).",
    placeholder: "Signing secret",
    dispatchable: false,
  },
];

const EVENTS = Object.keys(EVENT_LABELS) as NotificationEventType[];

export default function NotificationSettingsPage() {
  const { channels, rules, deliveryLog, saveChannelConfig, toggleChannelEnabled, toggleRule, testChannel } =
    useNotifications();

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            &larr; Kembali
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-500">Settings</p>
        <h1 className="mt-1 text-3xl font-bold">Notification Channels.</h1>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-3 text-xs text-neutral-600 dark:text-neutral-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Mode demo — gak ada panggilan Discord/SMTP beneran. Event tetap selalu masuk ke Mini Slack;
            di sini kamu atur mana yang JUGA di-fan-out ke channel eksternal.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {CHANNELS.map((c) => (
            <ChannelCard
              key={c.id}
              id={c.id}
              nama={CHANNEL_LABELS[c.id]}
              desc={c.desc}
              placeholder={c.placeholder}
              dispatchable={c.dispatchable}
              state={channels[c.id]}
              onSave={(raw) => saveChannelConfig(c.id, raw)}
              onTest={() => testChannel(c.id)}
              onToggleEnabled={() => toggleChannelEnabled(c.id)}
            />
          ))}
        </div>

        <h2 className="mt-10 mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Kirim Notifikasi Kemana — per Event
        </h2>
        <Card>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                <th className="pb-2 pr-4 font-medium">Event</th>
                <th className="pb-2 pr-4 font-medium">Discord</th>
                <th className="pb-2 font-medium">Email</th>
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((eventType) => (
                <tr key={eventType} className="border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                  <td className="py-2.5 pr-4 text-neutral-700 dark:text-neutral-300">{EVENT_LABELS[eventType]}</td>
                  <td className="py-2.5 pr-4">
                    <input
                      type="checkbox"
                      checked={rules[eventType].discord}
                      onChange={() => toggleRule(eventType, "discord")}
                      className="h-4 w-4 accent-blue-700"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="checkbox"
                      checked={rules[eventType].email}
                      onChange={() => toggleRule(eventType, "email")}
                      className="h-4 w-4 accent-blue-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <h2 className="mt-10 mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Log Pengiriman Terakhir
        </h2>
        <Card>
          {deliveryLog.length === 0 && (
            <p className="text-sm text-neutral-500">Belum ada event yang dicoba dikirim.</p>
          )}
          <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {deliveryLog.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    {EVENT_LABELS[entry.eventType]} &rarr; {CHANNEL_LABELS[entry.channelType]}
                  </p>
                  <p className="truncate text-xs text-neutral-500">{entry.content}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-neutral-500">
                    {new Date(entry.createdAt).toLocaleTimeString("id-ID")}
                  </span>
                  {entry.status === "sent" ? (
                    <Badge tone="success">
                      <Send className="mr-1 inline h-3 w-3" /> Terkirim
                    </Badge>
                  ) : (
                    <Badge tone="neutral">
                      <SkipForward className="mr-1 inline h-3 w-3" /> Dilewati
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

function ChannelCard({
  nama,
  desc,
  placeholder,
  dispatchable,
  state,
  onSave,
  onTest,
  onToggleEnabled,
}: {
  id: NotificationChannelType;
  nama: string;
  desc: string;
  placeholder: string;
  dispatchable: boolean;
  state: { saved: boolean; masked: string; enabled: boolean };
  onSave: (raw: string) => void;
  onTest: () => Promise<boolean>;
  onToggleEnabled: () => void;
}) {
  const [editing, setEditing] = useState(!state.saved);
  const [raw, setRaw] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "failed" | null>(null);

  function simpan() {
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
        {dispatchable && (
          <label className="flex shrink-0 items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            Aktif
            <input type="checkbox" checked={state.enabled} onChange={onToggleEnabled} className="h-4 w-4 accent-blue-700" />
          </label>
        )}
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
            placeholder={placeholder}
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

      {dispatchable && (
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
              <XCircle className="h-3.5 w-3.5" /> Gagal — cek konfigurasi
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
