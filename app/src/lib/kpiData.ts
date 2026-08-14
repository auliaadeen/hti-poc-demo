// KPI dari proposal Bab 10 — capaian di sini data mock realistis untuk demo
// (sengaja sebagian di bawah target, bukan semua hijau, biar kredibel).

export type KpiIndicator = {
  id: string;
  label: string;
  targetLabel: string;
  currentLabel: string;
  progressPercent: number; // 0-100, dipakai buat isi progress bar
  met: boolean;
};

export const kpiIndicators: KpiIndicator[] = [
  {
    id: "milestone",
    label: "Ketepatan waktu milestone",
    targetLabel: "Target 90%",
    currentLabel: "Capaian 78%",
    progressPercent: 78,
    met: false,
  },
  {
    id: "anggaran",
    label: "Kepatuhan anggaran",
    targetLabel: "Target ≤100%",
    currentLabel: "Capaian 104%",
    progressPercent: 100,
    met: false,
  },
  {
    id: "cacat",
    label: "Cacat lolos ke produksi",
    targetLabel: "Target 0",
    currentLabel: "Capaian 2 kasus",
    progressPercent: 100,
    met: false,
  },
  {
    id: "adopsi",
    label: "Tingkat adopsi pengguna",
    targetLabel: "Target 80%",
    currentLabel: "Capaian 61%",
    progressPercent: 61,
    met: false,
  },
  {
    id: "kepuasan",
    label: "Kepuasan pengguna",
    targetLabel: "Target 4 / 5",
    currentLabel: "Capaian 3.6 / 5",
    progressPercent: 72,
    met: false,
  },
  {
    id: "dokumen",
    label: "Jumlah dokumen diproses",
    targetLabel: "Target min. 50 dokumen",
    currentLabel: "Capaian 67 dokumen",
    progressPercent: 100,
    met: true,
  },
];
