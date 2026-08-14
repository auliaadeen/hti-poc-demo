// Data mock untuk Integration Status Board — belum ada koneksi API real ke
// sistem-sistem HTI ini, semua status/angka di sini simulasi untuk demo.

export type SystemStatus = "Terhubung" | "Terputus" | "Belum Terintegrasi";

export type SystemStatusEntry = {
  nama: string;
  deskripsi: string;
  status: SystemStatus;
  lastSync: string;
  dataTersinkronHariIni: number;
};

export const systemStatusList: SystemStatusEntry[] = [
  {
    nama: "GATES/ERP",
    deskripsi: "Sistem ERP utama HTI — PO, invoice, stok gudang",
    status: "Belum Terintegrasi",
    lastSync: "—",
    dataTersinkronHariIni: 0,
  },
  {
    nama: "WMS (Honda General)",
    deskripsi: "Warehouse Management System — gudang Honda General",
    status: "Terhubung",
    lastSync: "14 Agustus 2026, 09:12",
    dataTersinkronHariIni: 214,
  },
  {
    nama: "WMS (BMW)",
    deskripsi: "Warehouse Management System — gudang BMW",
    status: "Terputus",
    lastSync: "13 Agustus 2026, 22:47",
    dataTersinkronHariIni: 0,
  },
  {
    nama: "Jpayroll",
    deskripsi: "Sistem payroll & HR eksternal (vendor pihak ketiga)",
    status: "Belum Terintegrasi",
    lastSync: "—",
    dataTersinkronHariIni: 0,
  },
  {
    nama: "Blue Yonder",
    deskripsi: "Supply chain planning & forecasting",
    status: "Terhubung",
    lastSync: "14 Agustus 2026, 08:05",
    dataTersinkronHariIni: 58,
  },
];
