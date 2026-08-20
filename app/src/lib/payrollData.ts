// Data model + mock data untuk modul PayrollKita.
// Semua angka di sini contoh/mock — ganti dengan data karyawan riil saat wiring ke DB.

export type Karyawan = {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  statusKontrak: "Tetap" | "Kontrak" | "Magang";
  gajiPokok: number;
  tunjanganTetap: number;
  statusPTKP: "TK/0" | "K/0" | "K/1" | "K/2" | "K/3";
  atasanId?: string; // undefined = lapor langsung ke Direksi
  polaKerjaId: string;
};

export const karyawanList: Karyawan[] = [
  { id: "EMP001", nama: "Deen", jabatan: "IT Technical & Business Analyst", departemen: "Teknologi & Operasional", statusKontrak: "Tetap", gajiPokok: 12000000, tunjanganTetap: 1500000, statusPTKP: "TK/0", polaKerjaId: "SHIFT-REG" },
  { id: "EMP002", nama: "Franky Jonly", jabatan: "Business Development", departemen: "Business Development", statusKontrak: "Tetap", gajiPokok: 11000000, tunjanganTetap: 1200000, statusPTKP: "K/1", polaKerjaId: "SHIFT-REG" },
  { id: "EMP003", nama: "Diana Aulia", jabatan: "Sales & Documentation", departemen: "Business Development", statusKontrak: "Tetap", gajiPokok: 9000000, tunjanganTetap: 1000000, statusPTKP: "TK/0", atasanId: "EMP002", polaKerjaId: "SHIFT-REG" },
  { id: "EMP004", nama: "Kris", jabatan: "Presales Engineer", departemen: "Teknologi & Operasional", statusKontrak: "Kontrak", gajiPokok: 9500000, tunjanganTetap: 800000, statusPTKP: "K/0", atasanId: "EMP001", polaKerjaId: "SHIFT-SORE" },
];

// --- Pola kerja / shift dasar ---

export type PolaKerja = {
  id: string;
  nama: string;
  jamMasuk: string; // "HH:MM"
  jamPulang: string; // "HH:MM"
  hariKerja: string[];
  toleransiTelatMenit: number;
};

export const polaKerjaList: PolaKerja[] = [
  {
    id: "SHIFT-REG",
    nama: "Reguler (Kantor)",
    jamMasuk: "09:00",
    jamPulang: "18:00",
    hariKerja: ["Sen", "Sel", "Rab", "Kam", "Jum"],
    toleransiTelatMenit: 5,
  },
  {
    id: "SHIFT-SORE",
    nama: "Shift Sore (Presales/Kunjungan Klien)",
    jamMasuk: "12:00",
    jamPulang: "20:00",
    hariKerja: ["Sen", "Sel", "Rab", "Kam", "Jum"],
    toleransiTelatMenit: 5,
  },
];

export function getPolaKerja(k: Karyawan): PolaKerja {
  return polaKerjaList.find((p) => p.id === k.polaKerjaId) ?? polaKerjaList[0];
}

function jamKeMenit(jam: string): number {
  const [h, m] = jam.split(":").map(Number);
  return h * 60 + m;
}

// Bandingin jam check-in terhadap pola kerja karyawan → status telat/tepat waktu otomatis.
export function hitungStatusMasuk(
  checkIn: string,
  pola: PolaKerja
): { status: "Tepat Waktu" | "Telat"; menitTelat?: number } {
  const selisih = jamKeMenit(checkIn) - jamKeMenit(pola.jamMasuk);
  if (selisih <= pola.toleransiTelatMenit) return { status: "Tepat Waktu" };
  return { status: "Telat", menitTelat: selisih };
}

export function hitungMenitLembur(checkOut: string, pola: PolaKerja): number {
  const selisih = jamKeMenit(checkOut) - jamKeMenit(pola.jamPulang);
  return selisih > 0 ? selisih : 0;
}

// --- Struktur organisasi & jenjang approval ---
// Deen merangkap role Admin/HR (lihat PRD) — approval final "HR" dilakukan lewat peran Admin,
// bukan orang lain, sesuai skala tim internal saat ini.

export function getAtasan(k: Karyawan): Karyawan | null {
  if (!k.atasanId) return null;
  return karyawanList.find((x) => x.id === k.atasanId) ?? null;
}

export function getBawahan(atasanId: string): Karyawan[] {
  return karyawanList.filter((x) => x.atasanId === atasanId);
}

// Jenjang approval untuk satu karyawan: [Atasan Langsung? →] HR (Admin) — final.
export function jenjangApproval(k: Karyawan): { level: string; nama: string }[] {
  const atasan = getAtasan(k);
  const jenjang: { level: string; nama: string }[] = [];
  if (atasan) jenjang.push({ level: "Atasan Langsung", nama: atasan.nama });
  jenjang.push({ level: "HR (final)", nama: "Admin" });
  return jenjang;
}

export type AbsensiHariIni = {
  karyawanId: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "Tepat Waktu" | "Telat" | "Belum Absen" | "Lembur";
  menitTelat?: number;
  menitLembur?: number;
};

export const absensiHariIni: AbsensiHariIni[] = [
  { karyawanId: "EMP001", checkIn: "08:57", checkOut: null, status: "Tepat Waktu" },
  { karyawanId: "EMP002", checkIn: "09:14", checkOut: null, status: "Telat", menitTelat: 14 },
  { karyawanId: "EMP003", checkIn: "08:50", checkOut: "18:40", status: "Lembur", menitLembur: 40 },
  { karyawanId: "EMP004", checkIn: null, checkOut: null, status: "Belum Absen" },
];

export type RiwayatAbsensi = {
  karyawanId: string;
  tanggal: string; // "YYYY-MM-DD"
  checkIn: string | null;
  checkOut: string | null;
  status: AbsensiHariIni["status"];
  menitTelat?: number;
  menitLembur?: number;
};

// 5 hari kerja terakhir per karyawan, buat riwayat absensi di Portal ESS — data contoh (mock).
export const riwayatAbsensiList: RiwayatAbsensi[] = [
  { karyawanId: "EMP001", tanggal: "2026-08-19", checkIn: "08:55", checkOut: "18:05", status: "Tepat Waktu" },
  { karyawanId: "EMP001", tanggal: "2026-08-18", checkIn: "08:58", checkOut: "18:02", status: "Tepat Waktu" },
  { karyawanId: "EMP001", tanggal: "2026-08-17", checkIn: "09:12", checkOut: "18:00", status: "Telat", menitTelat: 12 },
  { karyawanId: "EMP001", tanggal: "2026-08-14", checkIn: "08:50", checkOut: "19:30", status: "Lembur", menitLembur: 90 },
  { karyawanId: "EMP001", tanggal: "2026-08-13", checkIn: null, checkOut: null, status: "Belum Absen" },

  { karyawanId: "EMP002", tanggal: "2026-08-19", checkIn: "09:10", checkOut: "18:00", status: "Telat", menitTelat: 10 },
  { karyawanId: "EMP002", tanggal: "2026-08-18", checkIn: "08:59", checkOut: "18:00", status: "Tepat Waktu" },
  { karyawanId: "EMP002", tanggal: "2026-08-17", checkIn: "08:57", checkOut: "18:00", status: "Tepat Waktu" },
  { karyawanId: "EMP002", tanggal: "2026-08-14", checkIn: "09:05", checkOut: "18:00", status: "Telat", menitTelat: 5 },
  { karyawanId: "EMP002", tanggal: "2026-08-13", checkIn: "08:52", checkOut: "18:00", status: "Tepat Waktu" },

  { karyawanId: "EMP003", tanggal: "2026-08-19", checkIn: "08:50", checkOut: "18:40", status: "Lembur", menitLembur: 40 },
  { karyawanId: "EMP003", tanggal: "2026-08-18", checkIn: "08:55", checkOut: "18:00", status: "Tepat Waktu" },
  { karyawanId: "EMP003", tanggal: "2026-08-17", checkIn: "08:53", checkOut: "18:00", status: "Tepat Waktu" },
  { karyawanId: "EMP003", tanggal: "2026-08-14", checkIn: "08:58", checkOut: "18:00", status: "Tepat Waktu" },
  { karyawanId: "EMP003", tanggal: "2026-08-13", checkIn: "09:20", checkOut: "18:00", status: "Telat", menitTelat: 20 },

  { karyawanId: "EMP004", tanggal: "2026-08-19", checkIn: null, checkOut: null, status: "Belum Absen" },
  { karyawanId: "EMP004", tanggal: "2026-08-18", checkIn: "11:58", checkOut: "20:00", status: "Tepat Waktu" },
  { karyawanId: "EMP004", tanggal: "2026-08-17", checkIn: "12:12", checkOut: "20:00", status: "Telat", menitTelat: 12 },
  { karyawanId: "EMP004", tanggal: "2026-08-14", checkIn: "11:50", checkOut: "20:45", status: "Lembur", menitLembur: 45 },
  { karyawanId: "EMP004", tanggal: "2026-08-13", checkIn: "11:55", checkOut: "20:00", status: "Tepat Waktu" },
];

export function getRiwayatAbsensi(karyawanId: string): RiwayatAbsensi[] {
  return riwayatAbsensiList
    .filter((r) => r.karyawanId === karyawanId)
    .sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
}

export type PengajuanCuti = {
  id: string;
  karyawanId: string;
  jenis: "Cuti Tahunan" | "Izin" | "Sakit";
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  status: "Menunggu Atasan" | "Menunggu HR" | "Disetujui" | "Ditolak";
  riwayat: { level: string; aksi: string; tanggal: string }[];
};

export const pengajuanCutiList: PengajuanCuti[] = [
  {
    id: "CUTI-001",
    karyawanId: "EMP002",
    jenis: "Cuti Tahunan",
    tanggalMulai: "2026-08-20",
    tanggalSelesai: "2026-08-21",
    alasan: "Acara keluarga",
    status: "Menunggu HR",
    riwayat: [{ level: "Atasan Langsung", aksi: "Disetujui", tanggal: "2026-08-11" }],
  },
  {
    id: "CUTI-002",
    karyawanId: "EMP004",
    jenis: "Sakit",
    tanggalMulai: "2026-08-12",
    tanggalSelesai: "2026-08-12",
    alasan: "Demam, ada surat dokter",
    status: "Disetujui",
    riwayat: [
      { level: "Atasan Langsung", aksi: "Disetujui", tanggal: "2026-08-12" },
      { level: "HR", aksi: "Disetujui", tanggal: "2026-08-12" },
    ],
  },
];

// --- Perhitungan payroll (disederhanakan untuk demo — verifikasi ke aturan resmi terkini sebelum dipakai produksi) ---

const TARIF_BPJS_KESEHATAN_KARYAWAN = 0.01; // 1% dari gaji (batas atas berlaku, disederhanakan)
const TARIF_BPJS_JHT_KARYAWAN = 0.02; // 2% JHT
const TARIF_BPJS_JP_KARYAWAN = 0.01; // 1% JP

// Tarif Efektif Rata-rata (TER) PPh 21 bulanan — kategori & lapisan disederhanakan untuk demo.
// SUMBER RESMI WAJIB DICEK ULANG: PP 58/2023 & PMK terkait sebelum dipakai untuk payroll riil.
function tarifTERBulanan(statusPTKP: Karyawan["statusPTKP"], penghasilanBruto: number): number {
  const kategori: Record<Karyawan["statusPTKP"], "A" | "B" | "C"> = {
    "TK/0": "A", "K/0": "A", "K/1": "B", "K/2": "B", "K/3": "C",
  };
  const kat = kategori[statusPTKP];
  const brackets = {
    A: [ [5400000, 0], [5650000, 0.0025], [6000000, 0.005], [6300000, 0.0075], [6750000, 0.01], [7500000, 0.0125], [8550000, 0.015], [9650000, 0.0175], [10050000, 0.02], [10350000, 0.0225], [10450000, 0.025], [10700000, 0.03], [11050000, 0.035], [11600000, 0.04], [12500000, 0.05], [13750000, 0.06], [15100000, 0.07], [16950000, 0.075], [19750000, 0.08], [24150000, 0.09], [26450000, 0.10], [28000000, 0.11], [30050000, 0.12], [32400000, 0.13], [35400000, 0.14], [39100000, 0.15], [43850000, 0.16], [47800000, 0.17], [51400000, 0.18], [56300000, 0.19], [62200000, 0.20], [68600000, 0.21], [77500000, 0.22], [89000000, 0.23], [103000000, 0.24], [125000000, 0.25], [157000000, 0.26], [206000000, 0.27], [337000000, 0.28], [454000000, 0.29], [550000000, 0.30], [695000000, 0.31], [910000000, 0.32], [1400000000, 0.33], [Infinity, 0.34] ],
    B: [ [6200000, 0], [6500000, 0.0025], [6850000, 0.005], [7300000, 0.0075], [9200000, 0.01], [10750000, 0.0125], [11250000, 0.015], [11600000, 0.0175], [12600000, 0.02], [13600000, 0.0225], [14950000, 0.025], [16400000, 0.03], [18450000, 0.035], [21850000, 0.04], [25000000, 0.05], [28000000, 0.06], [30150000, 0.07], [32800000, 0.075], [37100000, 0.08], [45800000, 0.09], [49500000, 0.10], [53800000, 0.11], [58500000, 0.12], [64000000, 0.13], [71000000, 0.14], [80000000, 0.15], [93000000, 0.16], [109000000, 0.17], [129000000, 0.18], [163000000, 0.19], [211000000, 0.20], [374000000, 0.21], [459000000, 0.22], [555000000, 0.23], [704000000, 0.24], [957000000, 0.25], [1405000000, 0.26], [Infinity, 0.27] ],
    C: [ [6600000, 0], [6950000, 0.0025], [7350000, 0.005], [7800000, 0.0075], [8850000, 0.01], [9800000, 0.0125], [10950000, 0.015], [11200000, 0.0175], [12050000, 0.02], [12950000, 0.0225], [14150000, 0.025], [15550000, 0.03], [17050000, 0.035], [19500000, 0.04], [22700000, 0.05], [26600000, 0.06], [28100000, 0.07], [30100000, 0.075], [32600000, 0.08], [35400000, 0.09], [38900000, 0.10], [43000000, 0.11], [47400000, 0.12], [51200000, 0.13], [56300000, 0.14], [62200000, 0.15], [68600000, 0.16], [77500000, 0.17], [89000000, 0.18], [103000000, 0.19], [125000000, 0.20], [157000000, 0.21], [206000000, 0.23], [337000000, 0.25], [454000000, 0.27], [550000000, 0.28], [695000000, 0.29], [910000000, 0.30], [1400000000, 0.31], [Infinity, 0.32] ],
  };
  const table = brackets[kat];
  for (const [batasAtas, tarif] of table) {
    if (penghasilanBruto <= (batasAtas as number)) return tarif as number;
  }
  return table[table.length - 1][1] as number;
}

export type HasilPayroll = {
  karyawanId: string;
  nama: string;
  gajiPokok: number;
  tunjanganTetap: number;
  lembur: number;
  penghasilanBruto: number;
  bpjsKesehatan: number;
  bpjsJHT: number;
  bpjsJP: number;
  totalPotonganBPJS: number;
  pph21: number;
  gajiBersih: number;
};

export function hitungPayroll(k: Karyawan, jamLembur = 0): HasilPayroll {
  const upahLemburPerJam = (k.gajiPokok / 173) * 1.5; // pendekatan sederhana, sesuaikan aturan lembur resmi
  const lembur = Math.round(jamLembur * upahLemburPerJam);
  const penghasilanBruto = k.gajiPokok + k.tunjanganTetap + lembur;

  const bpjsKesehatan = Math.round(penghasilanBruto * TARIF_BPJS_KESEHATAN_KARYAWAN);
  const bpjsJHT = Math.round(penghasilanBruto * TARIF_BPJS_JHT_KARYAWAN);
  const bpjsJP = Math.round(penghasilanBruto * TARIF_BPJS_JP_KARYAWAN);
  const totalPotonganBPJS = bpjsKesehatan + bpjsJHT + bpjsJP;

  const tarif = tarifTERBulanan(k.statusPTKP, penghasilanBruto);
  const pph21 = Math.round(penghasilanBruto * tarif);

  const gajiBersih = penghasilanBruto - totalPotonganBPJS - pph21;

  return {
    karyawanId: k.id, nama: k.nama, gajiPokok: k.gajiPokok, tunjanganTetap: k.tunjanganTetap,
    lembur, penghasilanBruto, bpjsKesehatan, bpjsJHT, bpjsJP, totalPotonganBPJS, pph21, gajiBersih,
  };
}

export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

// --- Riwayat payroll (mock, untuk rekap/laporan per periode) ---

export type RekapPeriode = {
  periode: string;
  status: "Difinalisasi";
  hasil: HasilPayroll[];
};

const jamLemburPerPeriode: Record<string, Record<string, number>> = {
  "Juni 2026": { EMP003: 2 },
  "Juli 2026": { EMP002: 1, EMP003: 5 },
  "Agustus 2026": { EMP003: 3 },
};

export const payrollHistory: RekapPeriode[] = Object.entries(jamLemburPerPeriode).map(
  ([periode, lemburMap]) => ({
    periode,
    status: "Difinalisasi",
    hasil: karyawanList.map((k) => hitungPayroll(k, lemburMap[k.id] ?? 0)),
  })
);

export function totalRekap(hasil: HasilPayroll[]) {
  return hasil.reduce(
    (acc, h) => ({
      bruto: acc.bruto + h.penghasilanBruto,
      potongan: acc.potongan + h.totalPotonganBPJS + h.pph21,
      bersih: acc.bersih + h.gajiBersih,
    }),
    { bruto: 0, potongan: 0, bersih: 0 }
  );
}

export function unduhRekapCSV(periode: string, hasil: HasilPayroll[]): void {
  const header = [
    "Nama",
    "Gaji Pokok",
    "Tunjangan Tetap",
    "Lembur",
    "Penghasilan Bruto",
    "BPJS Kesehatan",
    "BPJS JHT",
    "BPJS JP",
    "PPh 21",
    "Gaji Bersih",
  ];
  const rows = hasil.map((h) => [
    h.nama,
    h.gajiPokok,
    h.tunjanganTetap,
    h.lembur,
    h.penghasilanBruto,
    h.bpjsKesehatan,
    h.bpjsJHT,
    h.bpjsJP,
    h.pph21,
    h.gajiBersih,
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((v) => (typeof v === "string" && v.includes(",") ? `"${v}"` : v)).join(","))
    .join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rekap-payroll-${periode.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Masking untuk mode demo "Tampilkan Data Lengkap" OFF ---
// Bukan access control sungguhan — cuma sensor tampilan di sisi client.

function maskWordKeepFirstLast(word: string): string {
  if (word.length <= 2) return word;
  return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
}

function maskWordFirstOnly(word: string): string {
  if (word.length <= 1) return word;
  return word[0] + "*".repeat(word.length - 1);
}

// "Deen" -> "D**n", "Franky Jonly" -> "F****y J****"
// (kata pertama sisakan huruf pertama+terakhir, kata berikutnya cuma huruf pertama)
export function maskNama(nama: string): string {
  const words = nama.trim().split(/\s+/);
  if (words.length === 1) return maskWordKeepFirstLast(words[0]);
  return [maskWordKeepFirstLast(words[0]), ...words.slice(1).map(maskWordFirstOnly)].join(" ");
}

// "Rp 12.000.000" -> "Rp 12.XXX.XXX" (sisakan 2 digit pertama nominal, sisanya "X")
export function maskRupiah(formatted: string): string {
  let digitsSeen = 0;
  let out = "";
  for (const ch of formatted) {
    if (/\d/.test(ch)) {
      digitsSeen += 1;
      out += digitsSeen <= 2 ? ch : "X";
    } else {
      out += ch;
    }
  }
  return out;
}

// --- Slip gaji PDF ---

export async function unduhSlipGajiPDF(
  h: HasilPayroll,
  k: Karyawan,
  periode: string,
  showFull: boolean
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a5" });
  const nama = showFull ? h.nama : maskNama(h.nama);
  const rp = (n: number) => (showFull ? formatRupiah(n) : maskRupiah(formatRupiah(n)));

  let y = 50;
  const left = 40;
  const right = 300;

  doc.setFontSize(14).setFont("helvetica", "bold");
  doc.text("SLIP GAJI", left, y);
  doc.setFontSize(9).setFont("helvetica", "normal");
  doc.text("PayrollKita — Internal Payroll Tool [ASUMSI: ganti nama sesuai brand internal]", left, (y += 16));

  y += 20;
  doc.setFontSize(10);
  doc.text(`Nama`, left, y);
  doc.text(`: ${nama}`, left + 70, y);
  doc.text(`Periode`, right, y);
  doc.text(`: ${periode}`, right + 70, y);
  y += 16;
  doc.text(`Jabatan`, left, y);
  doc.text(`: ${k.jabatan}`, left + 70, y);
  doc.text(`ID Karyawan`, right, y);
  doc.text(`: ${h.karyawanId}`, right + 70, y);
  y += 16;
  doc.text(`Status`, left, y);
  doc.text(`: ${k.statusKontrak}`, left + 70, y);

  y += 30;
  doc.setLineWidth(0.5);
  doc.line(left, y, 400, y);
  y += 20;

  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, left, y);
    doc.text(value, 400, y, { align: "right" });
    y += 18;
  };

  doc.setFontSize(10).setFont("helvetica", "bold");
  doc.text("Pendapatan", left, y);
  y += 18;
  row("Gaji Pokok", rp(h.gajiPokok));
  row("Tunjangan Tetap", rp(h.tunjanganTetap));
  row("Lembur", rp(h.lembur));
  row("Penghasilan Bruto", rp(h.penghasilanBruto), true);

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Potongan", left, y);
  y += 18;
  row("BPJS Kesehatan", rp(h.bpjsKesehatan));
  row("BPJS JHT", rp(h.bpjsJHT));
  row("BPJS JP", rp(h.bpjsJP));
  row("PPh 21 (TER)", rp(h.pph21));
  row("Total Potongan", rp(h.totalPotonganBPJS + h.pph21), true);

  y += 12;
  doc.line(left, y, 400, y);
  y += 22;
  doc.setFontSize(12);
  row("Gaji Bersih Diterima", rp(h.gajiBersih), true);

  y += 30;
  doc.setFontSize(7).setFont("helvetica", "normal");
  doc.text(
    "Perhitungan PPh 21 (skema TER) dan BPJS pada demo ini disederhanakan untuk ilustrasi —",
    left,
    y
  );
  doc.text("verifikasi ulang ke aturan resmi terbaru sebelum dipakai payroll riil.", left, (y += 10));

  doc.save(`slip-gaji-${h.karyawanId}-${periode.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
