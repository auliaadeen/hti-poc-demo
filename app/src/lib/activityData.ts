import { FileText, CalendarCheck, Wallet, RadioTower, PackageSearch, LogIn } from "lucide-react";

export type ActivityItem = {
  id: string;
  message: string;
  relativeTime: string;
  icon: typeof FileText;
  iconClass: string;
};

// Event mock lintas modul — belum ada event bus real, jadi daftar ini statis
// untuk demo (bukan hasil listener sungguhan).
export const activityFeed: ActivityItem[] = [
  {
    id: "act-1",
    message: "Dokumen INV-2026-08-0417 selesai diproses",
    relativeTime: "5 menit lalu",
    icon: FileText,
    iconClass: "text-red-500",
  },
  {
    id: "act-2",
    message: "Pengajuan cuti CUTI-001 disetujui atasan",
    relativeTime: "22 menit lalu",
    icon: CalendarCheck,
    iconClass: "text-blue-500",
  },
  {
    id: "act-3",
    message: "Payroll Agustus 2026 difinalisasi",
    relativeTime: "1 jam lalu",
    icon: Wallet,
    iconClass: "text-blue-500",
  },
  {
    id: "act-4",
    message: "WMS (Honda General) tersinkron — 214 data",
    relativeTime: "2 jam lalu",
    icon: RadioTower,
    iconClass: "text-emerald-500",
  },
  {
    id: "act-5",
    message: "Stok Cikarang - Gudang B (BMW) mendekati batas minimum",
    relativeTime: "3 jam lalu",
    icon: PackageSearch,
    iconClass: "text-amber-500",
  },
  {
    id: "act-6",
    message: "Kris check-in — Tepat Waktu",
    relativeTime: "Kemarin, 08:57",
    icon: LogIn,
    iconClass: "text-neutral-500",
  },
];
