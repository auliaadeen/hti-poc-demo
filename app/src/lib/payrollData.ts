// Data model + mock data untuk modul PayrollKita.
// Semua angka di sini contoh/mock — ganti dengan data karyawan riil saat wiring ke DB.

export type Karyawan = {
  id: string;
  nama: string;
  jabatan: string;
  statusKontrak: "Tetap" | "Kontrak" | "Magang";
  gajiPokok: number;
  tunjanganTetap: number;
  statusPTKP: "TK/0" | "K/0" | "K/1" | "K/2" | "K/3";
};

export const karyawanList: Karyawan[] = [
  { id: "EMP001", nama: "Deen", jabatan: "IT Technical & Business Analyst", statusKontrak: "Tetap", gajiPokok: 12000000, tunjanganTetap: 1500000, statusPTKP: "TK/0" },
  { id: "EMP002", nama: "Franky Jonly", jabatan: "Business Development", statusKontrak: "Tetap", gajiPokok: 11000000, tunjanganTetap: 1200000, statusPTKP: "K/1" },
  { id: "EMP003", nama: "Diana Aulia", jabatan: "Sales & Documentation", statusKontrak: "Tetap", gajiPokok: 9000000, tunjanganTetap: 1000000, statusPTKP: "TK/0" },
  { id: "EMP004", nama: "Kris", jabatan: "Presales Engineer", statusKontrak: "Kontrak", gajiPokok: 9500000, tunjanganTetap: 800000, statusPTKP: "K/0" },
];

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
