// Ringkasan lintas-modul dipakai bareng oleh Command Center (KPI cards) dan
// AI Assistant (context buat LLM) — satu sumber angka, gak dihitung dobel.

import { mockWarehouseStock } from "@/lib/mockData";
import type { Message } from "@/lib/miniSlackData";

export const STOK_KRITIS_AMBANG = 3500;

export type DashboardStats = {
  dokumenDiproses: number;
  payrollDifinalisasi: boolean;
  emailSetupEvents: number;
  gudangKritis: number;
  totalGudang: number;
};

export function computeDashboardStats(messages: Message[]): DashboardStats {
  const dokumenDiproses = messages.filter((m) => m.channelSlug === "document-ai").length;
  const payrollDifinalisasi = messages.some(
    (m) => m.channelSlug === "payroll" && m.content.includes("difinalisasi")
  );
  const emailSetupEvents = messages.filter((m) => m.channelSlug === "email-setup").length;
  const gudangKritis = mockWarehouseStock.filter((g) => g.stok < STOK_KRITIS_AMBANG).length;

  return {
    dokumenDiproses,
    payrollDifinalisasi,
    emailSetupEvents,
    gudangKritis,
    totalGudang: mockWarehouseStock.length,
  };
}
