# HTI PoC Demo — ITS

Demo dua workstream prioritas (P2 Document AI, P3 Warehouse Visibility) untuk
dibawa ke sesi Assessment/PoC dengan Pak Zamalludin (IT Manager HTI).

**Status:** sudah dibangun & diuji penuh (build sukses, semua halaman & API
route dites langsung, tidak ada error). Tinggal dipindah ke VPS kamu untuk
jalan persisten.

## Isi Paket

```
hti-demo/
├── app/                    ← project Next.js (demo utama)
│   ├── src/app/
│   │   ├── page.tsx              (landing, link ke 2 demo)
│   │   ├── document-ai/page.tsx  (demo P2 — upload → ekstraksi PDF)
│   │   ├── dashboard/page.tsx    (demo P3 — stok 3 gudang)
│   │   └── api/extract/route.ts  (backend: panggil LlamaParse atau mock)
│   ├── .env.local.example
│   └── package.json
├── ocr-scripts/             ← script Python berdiri sendiri untuk uji OCR
│   ├── test_llamaparse.py
│   ├── test_mindee.py
│   └── requirements.txt
└── install-vps.sh           ← script instalasi, tinggal jalankan di VPS
```

## Cara Pakai — Cepat (Lokal, buat lihat dulu)

```bash
cd app
npm install
npm run build
npm run start -- -p 3005
# buka http://localhost:3005
```

Demo jalan **tanpa API key apapun** — otomatis pakai data contoh (mock) yang
sudah realistis (invoice HTI-Thailand, 3 gudang, dll). Cocok untuk latihan
sebelum hari-H.

## Cara Pakai — di VPS Kamu (buat demo beneran)

1. Jalankan `install-vps.sh` di sesi MobaXterm SSH kamu (lihat isi file
   untuk detail tiap langkah — sudah saya beri komentar).
2. Upload folder `app/` ke VPS (SFTP MobaXterm, atau lewat git).
3. `npm install && npm run build && npm run start -- -p 3000`
4. Jaga tetap jalan pakai `pm2` atau Docker (kamu sudah pakai Docker untuk
   Odoo, tinggal bikin container serupa).

## Nyalakan OCR Sungguhan (opsional, kapan saja siap)

Demo defaultnya pakai data mock supaya bisa langsung didemokan. Begitu kamu
punya API key dan contoh dokumen asli HTI:

1. `cp app/.env.local.example app/.env.local`
2. Isi `LLAMA_CLOUD_API_KEY` (daftar gratis di cloud.llamaindex.ai)
3. Restart server — halaman Document AI otomatis mulai memanggil LlamaParse
   sungguhan, bukan mock lagi.
4. Sebelum itu, tes dulu lewat command line:
   ```bash
   cd ocr-scripts
   pip install -r requirements.txt
   export LLAMA_CLOUD_API_KEY="..."
   python3 test_llamaparse.py /path/to/invoice-hti.pdf
   ```
   Ini membantu kamu lihat kualitas hasilnya dulu sebelum didemokan live.

## Catatan Teknis

- **ui-ux-pro-max-skill** sudah terinstal di `app/.claude/skills/` — begitu
  kamu buka folder ini dengan Claude Code, skill-nya otomatis aktif untuk
  bantu desain komponen baru.
- **shadcn/ui & Tremor CLI** sengaja tidak dijalankan otomatis di sini (butuh
  koneksi ke registry publik yang diblokir di sandbox saya) — komponen yang
  ada saya tulis manual dengan gaya visual yang sama. Kalau nanti butuh
  komponen tambahan, command-nya sudah saya siapkan di `install-vps.sh`.
- Semua warna/style mengikuti brand ITS (dark theme, merah `#C00000`) supaya
  konsisten dengan deck presentasi yang sudah dibuat sebelumnya.
