import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { mockExtraction } from "@/lib/mockData";

const EXTRACT_LABELS = [
  "Invoice No.",
  "Invoice Date",
  "Supplier",
  "Buyer",
  "PO Reference",
  "Currency",
  "Total Amount",
  "Incoterm",
  "HS Code",
  "Port of Discharge",
] as const;

type ExtractedFields = {
  fields: { label: string; value: string }[];
  lineItems: { sku: string; desc: string; qty: number; unit: string; total: string }[];
};

// Reads LlamaParse's markdown output and asks an LLM (via OpenRouter) to fill
// the structured field/line-item schema. Skips labels not present in the
// document rather than inventing values. Returns null on any failure so the
// caller can fall back to mock data.
async function extractFieldsWithLLM(resultText: string): Promise<ExtractedFields | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || !resultText.trim()) return null;

  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const model = process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4-6";

  const prompt = `Kamu membaca hasil OCR (markdown) dari dokumen trade seperti invoice/PO/packing list. Ekstrak field berikut jika ADA di teks: ${EXTRACT_LABELS.join(", ")}. Jangan mengarang nilai — kalau field tidak ditemukan di dokumen, SKIP (jangan dimasukkan ke output). Juga ekstrak baris item (line items) jika ada tabel barang.

Balas HANYA dengan JSON persis format ini, tanpa teks lain, tanpa markdown code fence:
{"fields": [{"label": string, "value": string}], "lineItems": [{"sku": string, "desc": string, "qty": number, "unit": string, "total": string}]}

Teks dokumen:
"""
${resultText}
"""`;

  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("LLM response contained no JSON");

  const parsed = JSON.parse(jsonMatch[0]) as ExtractedFields;
  if (!Array.isArray(parsed.fields) || !Array.isArray(parsed.lineItems)) {
    throw new Error("LLM response missing fields/lineItems arrays");
  }
  return parsed;
}

// Demo API route for the "Document AI" workstream (P2).
//
// Behavior:
// - If LLAMA_CLOUD_API_KEY is set in .env.local, it uploads the file to
//   LlamaParse and returns the parsed markdown alongside the mock structured
//   fields (LlamaParse gives you layout-aware text; turning that into the
//   structured field table on the right is the next engineering step —
//   typically an LLM call that reads the markdown and fills your schema).
// - If no key is set, it simulates a short delay and returns mock data, so
//   the demo works end-to-end with zero configuration.
//
// Verify field/endpoint names against LlamaParse's current docs before
// relying on this for anything beyond a demo:
// https://developers.llamaindex.ai/llamaparse

export async function POST(req: NextRequest) {
  const apiKey = process.env.LLAMA_CLOUD_API_KEY;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json({ source: "mock", ...mockExtraction });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const upstreamForm = new FormData();
    upstreamForm.append("file", file, file.name);

    const uploadRes = await fetch(
      "https://api.cloud.llamaindex.ai/api/v1/parsing/upload",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: upstreamForm,
      }
    );

    if (!uploadRes.ok) {
      throw new Error(`LlamaParse upload failed: ${uploadRes.status}`);
    }
    const uploadJson = await uploadRes.json();
    const jobId = uploadJson.id;

    // Poll for completion (simple demo-grade polling; add backoff for production).
    let resultText = "";
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const statusRes = await fetch(
        `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/markdown`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      if (statusRes.ok) {
        const statusJson = await statusRes.json();
        resultText = statusJson.markdown ?? "";
        break;
      }
    }

    let extracted: ExtractedFields | null = null;
    try {
      extracted = await extractFieldsWithLLM(resultText);
    } catch (llmErr) {
      console.error("OpenRouter field extraction failed, falling back to mock fields:", llmErr);
    }

    return NextResponse.json({
      source: extracted ? "llamaparse+llm" : "llamaparse",
      documentType: "Parsed Document",
      confidence: null,
      rawMarkdown: resultText,
      fields: extracted?.fields ?? mockExtraction.fields,
      lineItems: extracted?.lineItems ?? mockExtraction.lineItems,
    });
  } catch (err) {
    console.error("LlamaParse call failed, falling back to mock:", err);
    return NextResponse.json({ source: "mock-fallback", ...mockExtraction });
  }
}
