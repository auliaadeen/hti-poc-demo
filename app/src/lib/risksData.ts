// Risk register dari proposal Bab 9 (RS-01 s.d. RS-09) — teks di sini masih
// draft/mock, ganti dengan teks persis dari dokumen proposal saat tersedia.

export type RiskLevel = "Tinggi" | "Sedang" | "Rendah";

export type RiskEntry = {
  kode: string;
  risiko: string;
  probabilitas: number; // 1-5
  dampak: number; // 1-5
  status: string;
  pemilik: string;
};

export const risksList: RiskEntry[] = [
  { kode: "RS-01", risiko: "Integrasi API real ke GATES/ERP molor dari jadwal proposal", probabilitas: 4, dampak: 4, status: "Mitigasi Berjalan", pemilik: "Deen — IT Technical & BA" },
  { kode: "RS-02", risiko: "Data stok antar-gudang (Honda General, BMW) tidak sinkron saat migrasi WMS", probabilitas: 3, dampak: 4, status: "Dipantau", pemilik: "Kris — Presales Engineer" },
  { kode: "RS-03", risiko: "Resistensi pengguna terhadap sistem baru, adopsi rendah di lapangan", probabilitas: 4, dampak: 3, status: "Mitigasi Berjalan", pemilik: "Franky — Business Development" },
  { kode: "RS-04", risiko: "Data karyawan/payroll terekspos karena masking baru sensor tampilan, bukan access control sungguhan", probabilitas: 2, dampak: 5, status: "Belum Ditangani", pemilik: "HR & IT" },
  { kode: "RS-05", risiko: "Ketergantungan pada satu developer untuk maintenance & bug fix (bus factor)", probabilitas: 3, dampak: 5, status: "Mitigasi Berjalan", pemilik: "Deen — IT Technical & BA" },
  { kode: "RS-06", risiko: "Biaya lisensi API pihak ketiga (LlamaParse, OpenRouter) naik seiring skala pemakaian", probabilitas: 2, dampak: 3, status: "Diterima (Accepted)", pemilik: "Finance & IT" },
  { kode: "RS-07", risiko: "Downtime VPS mengganggu akses middleware monitoring saat jam kerja", probabilitas: 2, dampak: 4, status: "Dipantau", pemilik: "IT Infrastructure" },
  { kode: "RS-08", risiko: "Perubahan regulasi PPh 21/BPJS membuat kalkulasi payroll usang", probabilitas: 1, dampak: 3, status: "Diterima (Accepted)", pemilik: "HR" },
  { kode: "RS-09", risiko: "Scope creep — stakeholder minta modul di luar cakupan proposal awal", probabilitas: 4, dampak: 2, status: "Belum Ditangani", pemilik: "Project Lead" },
];

export function skor(r: RiskEntry): number {
  return r.probabilitas * r.dampak;
}

export function levelFor(r: RiskEntry): RiskLevel {
  const s = skor(r);
  if (s >= 15) return "Tinggi";
  if (s >= 8) return "Sedang";
  return "Rendah";
}
