"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { UploadCloud, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useMiniSlack } from "@/lib/MiniSlackContext";

type Stage = "idle" | "processing" | "done";

type ExtractResult = {
  source: string;
  fields: { label: string; value: string }[];
  lineItems: { sku: string; desc: string; qty: number; unit: string; total: string }[];
};

export default function DocumentAiPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<ExtractResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { post } = useMiniSlack();

  async function handleFile(file: File) {
    setFileName(file.name);
    setStage("processing");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const json = await res.json();
      setResult(json);
    } catch {
      setResult(null);
    } finally {
      setStage("done");
      post("document-ai", `📄 Dokumen ${file.name} selesai diproses`, "document.processed");
    }
  }

  function reset() {
    setStage("idle");
    setResult(null);
    setFileName("");
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
          Document AI — Demo
        </p>
        <h1 className="mt-1 text-3xl font-bold">
          Dari PDF ke data terstruktur, dalam hitungan detik.
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Upload contoh invoice/PO/packing list — sistem membaca dokumennya dan
          menyusun field-field kunci secara otomatis. Manusia tetap yang
          menyetujui sebelum data masuk ERP.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upload zone */}
          <Card className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {stage === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <UploadCloud className="mb-4 h-10 w-10 text-neutral-500" />
                  <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                    Drag & drop dokumen, atau klik tombol di bawah
                  </p>
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white transition hover:bg-red-600"
                  >
                    Pilih Dokumen
                  </button>
                  <button
                    onClick={() =>
                      handleFile(new File([""], "sample-invoice-hti.pdf", { type: "application/pdf" }))
                    }
                    className="mt-3 text-xs text-neutral-500 underline hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    atau coba dengan dokumen contoh
                  </button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </motion.div>
              )}

              {stage === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <Loader2 className="mb-4 h-10 w-10 animate-spin text-red-500" />
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">Membaca {fileName}…</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    OCR &amp; ekstraksi field berjalan
                  </p>
                </motion.div>
              )}

              {stage === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 className="mb-4 h-10 w-10 text-emerald-500" />
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{fileName}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Selesai diproses ({result?.source ?? "mock"})
                  </p>
                  <button
                    onClick={reset}
                    className="mt-4 text-xs text-neutral-500 underline hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    Coba dokumen lain
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Result panel */}
          <Card>
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <FileText className="h-4 w-4" /> Hasil Ekstraksi
            </p>
            {!result && (
              <p className="text-sm text-neutral-500">
                Belum ada dokumen diproses.
              </p>
            )}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-1.5"
              >
                {result.fields?.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 py-1.5 text-sm"
                  >
                    <span className="text-neutral-500">{f.label}</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{f.value}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </Card>
        </div>

        {result?.lineItems && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card>
              <p className="mb-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">Line Items</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                      <th className="pb-2 pr-4 font-medium">SKU</th>
                      <th className="pb-2 pr-4 font-medium">Deskripsi</th>
                      <th className="pb-2 pr-4 font-medium">Qty</th>
                      <th className="pb-2 pr-4 font-medium">Harga Satuan</th>
                      <th className="pb-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.lineItems.map((li) => (
                      <tr key={li.sku} className="border-b border-neutral-100 dark:border-neutral-900">
                        <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">{li.sku}</td>
                        <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">{li.desc}</td>
                        <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">{li.qty}</td>
                        <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">{li.unit}</td>
                        <td className="py-2 text-neutral-800 dark:text-neutral-200">{li.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}
