# PRD: PayrollKita — Internal Payroll \& HR Tool \[ASUMSI: ganti nama sesuai brand internal]

## Problem Statement

Kantor bayar biaya langganan bulanan ke vendor payroll SaaS (Gadjian) buat urus absensi, cuti, hitung gaji, BPJS, dan PPh 21 — padahal kebutuhan intinya standar dan berulang tiap bulan. \[ASUMSI] biaya langganan ini jadi beban recurring yang bisa dihindari dengan tool internal, sepadan dengan effort build sekali jalan.

## Goals

* Payroll run (hitung gaji + lembur + BPJS + PPh 21 seluruh karyawan) selesai < 30 menit per periode. \[ASUMSI baseline sekarang: proses manual/berhari-hari]
* 100% karyawan akses slip gaji sendiri (ESS) tanpa minta HR.
* Zero biaya langganan bulanan ke vendor payroll pihak ketiga mulai \[ASUMSI: Q1 tahun depan].
* Approval cuti/izin kelar < 24 jam lewat approval berjenjang digital.

## Target Users

* End user: karyawan kantor — absen, ajuin cuti/izin/sakit, lihat slip gaji.
* Admin/stakeholder: tim HR/finance (Deen jadi admin awal) — kelola data karyawan, approve pengajuan, jalankan payroll; Direksi — lihat dashboard ringkas biaya SDM \& status kepatuhan.
* AI/dev: Claude Code (vibe coding) yang bangun \& maintain fitur.

## User Stories

* Sebagai karyawan, aku mau absen online (check-in/out) supaya gak perlu mesin fingerprint fisik.
Acceptance: absen tercatat < 3 detik, otomatis flag telat/lembur sesuai jam kerja.
* Sebagai karyawan, aku mau ajukan cuti/izin/sakit lewat portal supaya gak perlu form kertas.
Acceptance: form upload surat (opsional), status pending/approve/reject terlihat real-time.
* Sebagai admin HR, aku mau approval berjenjang (atasan langsung → HR) supaya pengajuan cuti gak nyangkut di satu orang.
Acceptance: tiap level approval kirim notifikasi, riwayat approval tercatat.
* Sebagai admin HR, aku mau jalankan payroll sekali klik supaya gaji, lembur, potongan, BPJS, dan PPh 21 terhitung otomatis.
Acceptance: hasil hitung per karyawan bisa direview sebelum finalisasi, sesuai aturan PPh 21 TER \& tarif BPJS terkini.
* Sebagai karyawan, aku mau unduh slip gaji PDF supaya ada bukti resmi tiap periode.
Acceptance: slip tersedia otomatis begitu payroll difinalisasi, format PDF terunduh < 2 detik.
* Sebagai direksi, aku mau lihat dashboard ringkas (total biaya SDM, status payroll bulan berjalan) supaya bisa pantau tanpa buka detail teknis.
Acceptance: dashboard load < 2 detik, angka ter-update otomatis tiap payroll difinalisasi.

## Functional Requirements

* \[x] Data karyawan (profil, jabatan, gaji pokok, status kontrak)
* \[x] Struktur organisasi \& jenjang approval
* \[x] Absensi online (check-in/out, deteksi telat/lembur otomatis)
* \[x] Pola kerja/shift dasar
* \[x] Cuti/izin/sakit dengan approval berjenjang + upload surat
* \[x] Payroll engine: gaji pokok + lembur + tunjangan + potongan otomatis
* \[x] Perhitungan PPh 21 otomatis sesuai skema TER terkini
* \[x] Perhitungan BPJS Kesehatan \& Ketenagakerjaan otomatis sesuai tarif terkini
* \[x] Slip gaji PDF otomatis per periode
* \[x] Rekap/laporan payroll (per periode, exportable)
* \[x] Portal ESS karyawan (self-service: absen, cuti, slip gaji)
* \[x] Dashboard admin (HR) + dashboard ringkas direksi
* \[x] Auth \& role-based access (admin, HR, karyawan)
* \[ ] (v1) THR \& bonus otomatis
* \[ ] (v1) Integrasi mesin fingerprint/absensi fisik
* \[ ] (v2) HR analytics / evaluasi kinerja
* \[ ] (v2) Modul rekrutmen \& manajemen aset kantor
* \[ ] (v2) Integrasi software akuntansi eksternal

## Non-Functional Requirements

* Performa: dashboard load < 2 detik; payroll run untuk \[ASUMSI: 50–100] karyawan selesai < 1 menit di server.
* Security: auth wajib (session/JWT), data gaji terenkripsi at-rest, role-based access, audit log tiap perubahan data payroll.
* Reliability: uptime 99% \[ASUMSI, skala internal tool], backup database harian.
* Usability: karyawan baru bisa absen \& lihat slip gaji pertama kali < 2 menit tanpa training.

## Scope

In scope (MVP):

* Data karyawan, absensi online, cuti/izin approval berjenjang
* Payroll engine (gaji + lembur + potongan + BPJS + PPh 21 otomatis)
* Slip gaji PDF, rekap payroll
* Portal ESS karyawan, dashboard admin + direksi ringkas

Out of scope (ditunda):

* HR analytics AI, evaluasi kinerja/KPI
* Modul rekrutmen, manajemen aset kantor
* Integrasi hardware fingerprint fisik
* Integrasi software akuntansi eksternal
* Multi-company / outsourcing

Catatan: PRD ini living doc — update tiap ada keputusan fitur masuk/keluar, terutama setelah lihat detail UI trial account Gadjian.

