# Task: Auto-fill ITS CRM Pipeline (Google Sheets) from HTI demo document upload

## Context
- App: Next.js PoC demo at `/opt/docker/projects/hti-demo/app` on the VPS (built for the ITS x Honda Trading Indonesia (HTI) pitch)
- Existing pages: Document AI upload/extraction (uses LlamaParse for OCR — currently returns raw markdown only, no field-structuring step yet), Warehouse Visibility dashboard
- Goal: when a user uploads a document via the Document AI page, after OCR runs, extract structured fields via an LLM step, then auto-fill/update a row in a specific Google Sheet tab — the same "Accounts" tab used as Deen's interim CRM pipeline (staging replacement for Odoo CRM).

## Part 1 — Finish the LLM structuring step (if not already done)
After LlamaParse returns markdown, call an LLM (OpenAI or OpenRouter — whichever key is already configured in `.env`) to convert the markdown into structured JSON. Fields should map to what a MoM (Minutes of Meeting), notulen, or project-status PPT would typically report about a client project: client name, project name, status, health, progress %, next milestone, PIC, next-step action, and any other field explicitly stated in the document. Do not invent or guess a value that isn't in the source text.

## Part 2 — Google Sheets auto-fill

Target spreadsheet: `19uF2V6Sn43I6bkQQxoVObknGcdRKzbYllgplle-m4l8`, tab **`Accounts`** only. Never write to any other tab in this workbook (`2026 HQ People Progression`, `DATA FINANCE`, `Engineer`, `Sheet13`, `Engineer+EOS`, `cleansing`, `HQ People Progression`, `KPI 2025`, `KPI 2026`, `Bahan Gantt`, `Certificate`, `Huddle`).

### Column map (Accounts tab — header row 2, data starts row 3)

| Col | Header | Col | Header |
|---|---|---|---|
| A | No | R | PAID to ITS |
| B | CLIENT | S | AR Outstanding (Piutang) |
| C | NAMA PROJECT | T | Planned COST |
| D | START DATE | U | Actual COST |
| E | END DATE | V | Nomor Quotation |
| F | START YEAR | W | BAST Status |
| G | END YEAR | X | BAST Signed Date |
| H | PHASE | Y | Billing Flag |
| I | Project Status | Z | RENEWAL FLAG (Perlu perpanjang?) |
| J | Status Keterangan | AA | DOC COMPLETENESS |
| K | HEALTH (RYG) | AB | COMPLIANCE FLAG (NDA, akses data, dll) |
| L | PROGRESS (%) | AC | TOP RISK COUNT (1-5) |
| M | NEXT MILESTONE (DATE) | AD | ISSUE TREND |
| N | Sales PIC | AE | NEXT STEP (Action) |
| O | TECH LEAD | AF | PM Tool (Jira) |
| P | CONTRACT VALUE (OMSET) | AG | DOCS (Gdrive) |
| Q | NOMINAL PADA INVOICE | AH | OPAs (Mgmt View) |
| | | AI | Accurate ID |

Re-verify this map with a live read of `Accounts!A2:AI2` before relying on it — it may have shifted since this was written.

### Fill rules

1. **Classify** the extracted content as one of:
   - **Prospect** (opportunity, new lead, needs assessment/discovery, not yet a confirmed running project) → only fill columns B, C, H (= `"Prospecting"`), I (= `"Prospect"`), N (only if a Sales PIC name is actually stated), and AE (short next-step summary). Leave every other column blank — no placeholders like "TBD" or "-", no guessed dates, no estimated values.
   - **Active/ongoing project** → update only the specific columns the document actually speaks to (most commonly I, J, K, L, M, AE). Do not touch columns the document didn't mention.
2. **Match the row**: read columns B (CLIENT) and C (NAMA PROJECT) for existing rows, match case-insensitively and allow partial name matches (client/project names are sometimes abbreviated differently between documents and the sheet).
   - Match found → update only the changed cells at that row. Never overwrite the whole row.
   - No match → append to the next empty row, filling only the fields allowed by the Prospect/Active rule above.
3. **Flag every change**: append (never overwrite) a dated note to column AE, e.g. `[upd DD-MM-YYYY dari upload]: <short summary of what changed>`. If AE already has content, add this as a new line underneath.
4. Use `valueInputOption: "USER_ENTERED"` on writes so dates and percentages parse correctly instead of landing as literal text.

### Auth — service account (not interactive OAuth)

This runs unattended server-side, so it needs a Google Cloud service account rather than a user OAuth flow:

1. Create a service account in a GCP project and enable the Google Sheets API for that project.
2. Download the service account's JSON key. Store it on the VPS **outside** the git repo (e.g. `/opt/docker/projects/hti-demo/secrets/gsheets-sa.json`), reference the path via an env var (e.g. `GOOGLE_SERVICE_ACCOUNT_KEY_PATH`), and make sure that path is git-ignored.
3. Share the target spreadsheet with the service account's `client_email` (Editor access). This one step has to be done manually in the Google Sheets UI once the service account exists — flag it back to me if you need me to do the sharing since it's my Drive file.
4. In the Next.js API route, use the `googleapis` npm package with the service account credentials to call `spreadsheets.values.get` (to find/verify the target row) and `spreadsheets.values.update` / `spreadsheets.values.append` (to write).

### UX

After a successful write, show a confirmation in the upload page UI: which row was updated or newly added, and which columns changed. If it's ambiguous whether this is a new project or a near-match to an existing row, surface that ambiguity in the UI instead of guessing which row to touch.

## Deliverables
- New/updated API route implementing the LLM structuring step + Sheets write
- `.env.example` updated with any new required vars (LLM key if not already present, service-account key path, spreadsheet ID)
- Short note in the README covering the one-time manual setup (create service account, share the sheet with its email)
