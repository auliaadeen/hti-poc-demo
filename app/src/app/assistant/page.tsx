"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMiniSlack } from "@/lib/MiniSlackContext";
import { computeDashboardStats } from "@/lib/dashboardStats";
import { payrollHistory } from "@/lib/payrollData";
import { emailSetupRequestsSeed } from "@/lib/emailSetupData";
import { systemStatusList } from "@/lib/systemStatus";

const CONTOH_PERTANYAAN = [
  "Berapa dokumen diproses minggu ini?",
  "Status payroll bulan Agustus gimana?",
  "Ada request email-setup yang nyangkut gak?",
  "Sistem apa yang lagi bermasalah?",
];

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function AssistantPage() {
  const { messages } = useMiniSlack();
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function buildContext(): string {
    const stats = computeDashboardStats(messages);
    const periodeTerakhir = payrollHistory[payrollHistory.length - 1];

    const emailSetupSelesai = emailSetupRequestsSeed.filter((r) => r.status === "COMPLETED").length;
    const emailSetupNyangkut = emailSetupRequestsSeed.filter(
      (r) => r.status !== "COMPLETED" && r.status !== "DRAFT"
    );

    const sistemBermasalah = systemStatusList.filter((s) => s.status !== "Terhubung");

    return [
      `- Dokumen Diproses: ${stats.dokumenDiproses} dokumen (sesi ini, Document AI)`,
      `- Status Payroll: ${stats.payrollDifinalisasi ? "Difinalisasi" : "Belum dijalankan"} periode berjalan. Riwayat terakhir: periode ${periodeTerakhir.periode}, status ${periodeTerakhir.status}, ${periodeTerakhir.hasil.length} karyawan.`,
      `- Email Setup: ${stats.emailSetupEvents} event tercatat sesi ini. Total ${emailSetupRequestsSeed.length} request — ${emailSetupSelesai} selesai (COMPLETED), ${emailSetupNyangkut.length} masih berjalan${
        emailSetupNyangkut.length > 0
          ? ` (${emailSetupNyangkut.map((r) => `${r.targetDomainEmail}: ${r.status}`).join(", ")})`
          : ""
      }.`,
      `- Gudang Stok Kritis: ${stats.gudangKritis} dari ${stats.totalGudang} gudang di bawah ambang batas.`,
      `- Sistem Bermasalah: ${
        sistemBermasalah.length === 0
          ? "tidak ada, semua sistem terhubung normal."
          : sistemBermasalah.map((s) => `${s.nama} (${s.status})`).join(", ")
      }`,
    ].join("\n");
  }

  async function kirim(pertanyaan: string) {
    if (!pertanyaan.trim() || loading) return;
    setChat((prev) => [...prev, { role: "user", content: pertanyaan }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: pertanyaan, context: buildContext() }),
      });
      const json = await res.json();
      setChat((prev) => [...prev, { role: "assistant", content: json.answer ?? "Maaf, gagal dapat jawaban." }]);
    } catch {
      setChat((prev) => [...prev, { role: "assistant", content: "Maaf, ada gangguan — coba lagi." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen flex-col bg-white px-6 py-6 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 md:px-12">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col min-h-0">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            &larr; Kembali
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-500">
          <Sparkles className="h-4 w-4" /> AI Assistant
        </p>
        <h1 className="mt-1 text-2xl font-bold">Tanya kondisi semua modul.</h1>

        <div className="mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          {chat.length === 0 && (
            <div>
              <p className="text-sm text-neutral-500">Coba pertanyaan contoh:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CONTOH_PERTANYAAN.map((q) => (
                  <button
                    key={q}
                    onClick={() => kirim(q)}
                    className="rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chat.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700/10 text-blue-600 dark:text-blue-400">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-blue-700 text-white"
                    : "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Mengetik...
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && kirim(input)}
            placeholder="Tanya sesuatu tentang kondisi operasional..."
            className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2.5 text-sm"
          />
          <button
            onClick={() => kirim(input)}
            disabled={loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Jawaban berdasar ringkasan angka sesi ini, bukan pencarian dokumen penuh (bukan RAG).
        </p>
      </div>
    </main>
  );
}
