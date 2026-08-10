import { NextRequest, NextResponse } from "next/server";
import { mockExtraction } from "@/lib/mockData";

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

    return NextResponse.json({
      source: "llamaparse",
      documentType: "Parsed Document",
      confidence: null,
      rawMarkdown: resultText,
      fields: mockExtraction.fields, // TODO: replace with LLM-extracted fields from resultText
      lineItems: mockExtraction.lineItems,
    });
  } catch (err) {
    console.error("LlamaParse call failed, falling back to mock:", err);
    return NextResponse.json({ source: "mock-fallback", ...mockExtraction });
  }
}
