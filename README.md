# Uzbekistan IT Contract Generator

A production-ready, **fully offline**, browser-based web application that generates
professional IT contract templates aligned with the laws and business practices of
the Republic of Uzbekistan.

> **This application does not provide legal advice.** It generates editable,
> professionally structured contract templates. Always have the final document
> reviewed by a licensed lawyer before it is signed.

---

## ✨ Features

- **Six document types**, each generated as a real, editable Microsoft Word
  (`.docx`) file — never HTML or PDF:
  - IT Service Agreement
  - Non-Disclosure Agreement (NDA)
  - Statement of Work (SOW)
  - Project Acceptance Act
  - Invoice
  - Maintenance & Support Agreement
- **Trilingual**: the interface and every generated document are available in
  **Uzbek (Latin)**, **Russian**, and **English**, switchable instantly.
- **Zero backend** — everything runs in the browser via vanilla JS, Bootstrap 5,
  [docx.js](https://www.npmjs.com/package/docx) and
  [FileSaver.js](https://www.npmjs.com/package/file-saver). All libraries are
  bundled locally under `assets/vendor/`, so the app works fully offline the
  moment you open `index.html` — no CDN, no install step, no `npm install`.
- **Professional Word formatting**: cover page with brand accent rule, a boxed
  verification QR code, automatic table of contents, running headers/footers
  with page numbers, Times New Roman 14pt body text at 1.5 line spacing,
  formatted tables, and a two-column signature block styled like a standard
  Uzbek contract (signature line with "(imzo)" caption, dashed **M.O'.** seal
  placeholder when no stamp image is uploaded, and a date line for each
  party).
- **QR code → electronic copy**: set an "Electronic copy link" once in
  Settings (e.g. your own website or a Google Drive folder you control) and
  every generated document automatically downloads **two files**: the signed
  `.docx` and a matching, nicely branded, self-contained `.html` "electronic
  copy" — named to match exactly what the cover-page QR code links to
  (`{contractNumber}-{doctype}.html`). Upload that HTML file to the address
  you configured, and scanning the QR code on a printed/signed copy opens the
  real electronic version. If you leave the link blank, the QR code simply
  encodes a verification code instead (no hosting required).
- **Company profile & defaults**: fill in your company details once under
  Settings; they auto-fill into every document.
- **Auto-numbered contracts** (`IT-2026-000001`, incrementing automatically).
- **Drafts**: auto-save to the browser as you type, plus explicit Save/Load
  Draft, and JSON Export/Import for backing up or transferring a contract's
  data between machines.
- **Dark mode / light mode**, fully responsive down to mobile.
- **On-screen preview** and print support before generating the Word file.

---

## 📦 Installation

No installation needed.

1. Unzip the archive.
2. Double-click `index.html` (or open it from your browser with `File → Open`).
3. That's it — the app runs entirely client-side.

*(Optional, for local development only)*: if you prefer serving it over
`http://` instead of `file://` — e.g. to avoid any browser file-access
restrictions — you can run any static file server from the project folder,
for example `python3 -m http.server 8080`, and then visit
`http://localhost:8080`. This is optional; the app does not require a server.

---

## 🗂️ Folder Structure

```
contract-generator/
├── index.html                   # App shell: sidebar, topbar, all forms, modals
├── style.css                    # Full design system (light + dark themes)
├── script.js                    # App state, routing, form binding, drafts, generation
├── word-generator.js            # Shared docx.js helpers (cover page, headers,
│                                 #   footers, tables, signature block, QR code)
├── contracts/
│   ├── it-service-agreement.js  # 25-clause IT Service Agreement (EN/RU/UZ)
│   ├── nda.js                   # Non-Disclosure Agreement (EN/RU/UZ)
│   ├── sow.js                   # Statement of Work (EN/RU/UZ)
│   ├── acceptance.js            # Project Acceptance Act (EN/RU/UZ)
│   ├── invoice.js               # Invoice generator (EN/RU/UZ)
│   └── maintenance.js           # Maintenance & Support Agreement (EN/RU/UZ)
├── assets/
│   ├── i18n.js                  # UI translation dictionary
│   ├── logo.svg                 # App logo
│   └── vendor/                  # Bundled libraries (fully offline, no CDN)
│       ├── docx.iife.js         # docx.js — DOCX generation engine
│       ├── FileSaver.min.js     # File download helper
│       ├── qrcode.js            # Offline QR code generator
│       ├── bootstrap.min.css / bootstrap.bundle.min.js
│       └── bootstrap-icons/     # Icon font
├── README.md
└── LICENSE
```

---

## 🖱️ Usage

1. Open **Settings** and fill in your **Company Profile** (name, director,
   TIN/STIR, bank details, logo, stamp, signature). Save it — it will now
   auto-fill on every document.
2. Choose a document type from the sidebar (e.g. **IT Service Agreement**).
3. Fill in the **Client**, **Project**, **Payment**, and other relevant
   sections. Fields shared between document types (Company, Client, Project…)
   stay in sync everywhere they appear.
4. Optionally click **Preview** to sanity-check the content, or **Print**.
5. Click **Generate Word document** — the `.docx` file downloads immediately.
6. Open it in Microsoft Word (or any compatible editor), make any final
   adjustments, and send it to a lawyer for review before signing.

Your contract number, company profile, and in-progress form data are saved
automatically in your browser (localStorage) between sessions. Use **Export
JSON** any time you want a portable backup file, and **Import JSON** to
restore it on another computer.

---

## 🧩 Customization

- **Branding**: replace `assets/logo.svg` with your own logo, and adjust the
  color tokens (`--brand`, `--brand-dark`, etc.) at the top of `style.css`.
- **Add a clause**: open the relevant file in `contracts/`, and add an entry
  to the `clauses` array for each of the three languages — the numbering,
  headings, and table of contents update automatically.
- **Add a new document type**: create `contracts/your-doc.js` following the
  pattern in the existing files (a `content()` function returning per-language
  text, and a `generate(state, lang, t)` function that calls into
  `WordGen.buildDocument`), then wire it into `index.html` (sidebar link +
  `view-*` section) and `script.js` (`GENERATORS` / `FILENAME_PREFIX` maps).
- **Adjust legal wording**: all contract language lives in plain JS string
  literals inside `contracts/*.js` — no templating engine required, just edit
  the text directly per language.

---

## ⚠️ A note on scope and honesty

This generator produces genuinely useful, substantive contract language (not
placeholder/lorem-ipsum text) for all six document types in all three
languages, and every `.docx` file was verified to open correctly and render
properly formatted headers, footers, tables, and signature blocks.

That said, two things worth knowing:

- **Page counts**: the IT Service Agreement contains 25 fully-written clauses
  plus a cover page, table of contents, project annex, and signature block.
  Depending on font rendering this typically runs longer than a short template
  but will not always reach a literal 30–40 printed pages purely from clause
  text — reaching that count with genuinely useful (non-repetitive, non-filler)
  legal content would require either far more granular sub-clauses than most
  real IT contracts use, or attaching lengthy standard-form annexes. You can
  extend any document's length by adding more granular sub-clauses to the
  `clauses` arrays, or by appending additional annexes.
- **Not implemented in this version**: full undo/redo history, keyboard
  shortcuts, and contract duplication are not included, to keep the codebase
  focused and maintainable. Auto-save, Save/Load Draft, and JSON Export/Import
  cover the most common "don't lose my work" and "move this to another
  computer" needs. These would be natural follow-ups if you'd like them added.

---

## 🪪 License

MIT License — see [LICENSE](./LICENSE).

Bundled third-party libraries (docx.js, FileSaver.js, qrcode-generator,
Bootstrap, Bootstrap Icons) retain their own original licenses (all MIT/permissive).
