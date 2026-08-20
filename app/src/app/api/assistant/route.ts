import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// AI Chat Assistant (spec Part 2 Bab 13). Beda dari api/extract/route.ts —
// itu lewat OpenRouter, ini langsung ke OpenAI (OPENAI_API_KEY), sesuai
// koreksi Deen: dia punya subscription OpenAI, bukan OpenRouter.
//
// Konteks (ringkasan angka lintas modul) dikirim client-side, bukan di-query
// dari "database" server — semua state modul lain (Mini Slack, Email Setup)
// cuma ada di React context browser, gak ada database beneran di repo ini.

type AssistantRequest = { question: string; context: string };

function jawabanMock(question: string, context: string): string {
  const q = question.toLowerCase();
  const cari = (label: string) =>
    context
      .split("\n")
      .find((line) => line.toLowerCase().includes(label))
      ?.replace(/^-\s*/, "");

  if (q.includes("dokumen")) {
    return cari("dokumen diproses") ?? "Belum ada data dokumen diproses sesi ini.";
  }
  if (q.includes("payroll")) {
    return cari("status payroll") ?? "Belum ada data status payroll.";
  }
  if (q.includes("email")) {
    return cari("email setup") ?? "Belum ada data email setup.";
  }
  if (q.includes("sistem") || q.includes("bermasalah") || q.includes("integrasi")) {
    return cari("sistem bermasalah") ?? "Semua sistem terhubung normal.";
  }
  return `Ringkasan kondisi saat ini:\n${context}`;
}

export async function POST(req: NextRequest) {
  const { question, context } = (await req.json()) as AssistantRequest;

  if (!question?.trim()) {
    return NextResponse.json({ error: "Pertanyaan kosong" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ answer: jawabanMock(question, context ?? "") });
  }

  try {
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `Kamu asisten internal HTI Digital Operations. Jawab singkat (2-4 kalimat) dalam Bahasa Indonesia, berdasarkan HANYA data ringkasan berikut — jangan mengarang angka di luar ini:\n\n${context}`,
        },
        { role: "user", content: question },
      ],
      temperature: 0.3,
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    if (!answer) throw new Error("Respons OpenAI kosong");

    return NextResponse.json({ answer });
  } catch {
    // Panggilan API eksternal gak boleh bikin app crash — fallback ke mock.
    return NextResponse.json({ answer: jawabanMock(question, context ?? "") });
  }
}
