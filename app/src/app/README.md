# PayrollKita — Modul Baru (drop-in ke hti-poc-demo)

Sudah dites build+run bersih (5 route, semua 200 OK) di sandbox terpisah dari project utamamu.
Karena project utamamu di sisi kamu sudah berubah (OpenRouter, dll), aku gak nyentuh file existing —
ini murni file BARU, tinggal copy-timpa ke struktur project kamu.

## Cara pasang

1. Copy folder `payroll/` ke: `src/app/payroll/` (project kamu)
2. Copy `payrollData.ts` ke: `src/lib/payrollData.ts`
3. Cek `src/components/ui/Card.tsx` kamu — sudah ada `Card` dan `KpiCard`.
   Kalau belum ada `Badge`, timpa file itu pakai `Card.tsx` di paket ini (isinya superset, aman).
4. Pastikan deps sudah ada (kamu udah install semua ini sebelumnya):
   `framer-motion recharts lucide-react clsx tailwind-merge`
5. `npm run build` buat cek gak ada conflict, lalu jalan seperti biasa.

## Isi

- `/payroll` — landing, link ke 4 modul
- `/payroll/absensi` — check-in/out + status tim
- `/payroll/cuti` — form pengajuan + approval berjenjang (mock)
- `/payroll/payroll-run` — hitung gaji sekali klik (gaji + lembur + BPJS + PPh21 TER) + slip
- `/payroll/dashboard` — ringkas biaya SDM buat HR/Direksi

## PENTING — sebelum dipakai beneran

Tabel tarif PPh 21 skema TER (kategori A/B/C) di `payrollData.ts` aku tulis dari
memori struktur PP 58/2023 — **belum diverifikasi ulang ke sumber resmi terbaru**.
Cek ke situs DJP / konsultan pajak sebelum dipakai hitung gaji riil. Sama untuk
tarif BPJS (Kesehatan/JHT/JP) — aku pakai angka pendekatan, bukan tarif resmi
terkini yang sudah diverifikasi.

Belum ada: auth/RBAC, database (masih mock in-memory), generate PDF slip beneran
(tombol Download masih dummy), integrasi fingerprint fisik. Semua itu di luar
scope MVP demo ini sesuai PRD kamu (v1/v2 items).
