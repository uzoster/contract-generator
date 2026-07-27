/**
 * word-generator.js
 * Shared building blocks for turning form state into a real, professionally
 * formatted Microsoft Word (.docx) document using docx.js — entirely in the
 * browser, no backend involved.
 *
 * Every contracts/*.js template file calls into WordGen to assemble its
 * document so that cover pages, headers, footers, tables, and signature
 * blocks stay visually consistent across all six document types.
 */
const WordGen = (() => {
  const {
    Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
    Header, Footer, PageNumber, NumberFormat, AlignmentType, BorderStyle,
    WidthType, ImageRun, TableOfContents, Packer, ShadingType, VerticalAlign,
    PageBreak, LevelFormat, convertInchesToTwip, ExternalHyperlink, TabStopType, TabStopPosition
  } = docx;

  // ---- Brand constants -----------------------------------------------
  const BRAND_BLUE = "1B4DFF";
  const INK = "111827";
  const MUTED = "5B6472";
  const HAIRLINE = "C9D2E8";
  const FONT_BODY = "Times New Roman";
  const SIZE_BODY = 28;     // 14pt in half-points
  const SIZE_H1 = 34;       // 17pt
  const SIZE_H2 = 30;       // 15pt
  const SIZE_SMALL = 20;    // 10pt
  const LINE_1_5 = 360;     // 1.5 line spacing (240 = single)

  // ---- Low level helpers ----------------------------------------------

  function dataUrlToBytes(dataUrl) {
    if (!dataUrl || typeof dataUrl !== "string" || dataUrl.indexOf(",") === -1) return null;
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function imageTypeFromDataUrl(dataUrl) {
    const m = /^data:image\/(png|jpeg|jpg|gif|bmp);/i.exec(dataUrl || "");
    if (!m) return "png";
    const t = m[1].toLowerCase();
    return t === "jpeg" ? "jpg" : t;
  }

  function tryImage(dataUrl, width, height) {
    try {
      const bytes = dataUrlToBytes(dataUrl);
      if (!bytes) return null;
      return new ImageRun({ data: bytes, type: imageTypeFromDataUrl(dataUrl), transformation: { width, height } });
    } catch (e) {
      console.warn("Image embed failed", e);
      return null;
    }
  }

  function qrImage(text, sizePx = 90) {
    try {
      const qr = qrcode(0, "M");
      qr.addData(text || "");
      qr.make();
      const dataUrl = qr.createDataURL(6, 4);
      return tryImage(dataUrl, sizePx, sizePx);
    } catch (e) {
      console.warn("QR generation failed", e);
      return null;
    }
  }

  function electronicCopyUrl(state, docSlug) {
    const base = (state.company && state.company.verifyBaseUrl || "").trim();
    if (!base) return null;
    const cleanBase = base.replace(/\/+$/, "");
    return `${cleanBase}/${state.meta.contractNumber}-${docSlug}.html`;
  }

  // ---- Text-level helpers ----------------------------------------------

  function run(text, opts = {}) {
    return new TextRun({ text: text == null ? "" : String(text), font: FONT_BODY, size: SIZE_BODY, ...opts });
  }

  function para(text, opts = {}) {
    const { bold, italic, align = AlignmentType.JUSTIFIED, spacingAfter = 200, indentFirstLine = true, size } = opts;
    return new Paragraph({
      alignment: align,
      spacing: { line: LINE_1_5, after: spacingAfter },
      indent: indentFirstLine ? { firstLine: convertInchesToTwip(0.3) } : undefined,
      children: [run(text, { bold, italics: italic, size })],
    });
  }

  function heading1(text) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 320, after: 200, line: LINE_1_5 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, font: FONT_BODY, size: SIZE_H1, color: INK })],
    });
  }

  function heading2(number, text) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 160, line: LINE_1_5 },
      children: [new TextRun({ text: `${number}. ${text}`.toUpperCase(), bold: true, font: FONT_BODY, size: SIZE_H2, color: INK })],
    });
  }

  function clause(number, title, bodyText) {
    const paras = [heading2(number, title)];
    const parts = Array.isArray(bodyText) ? bodyText : [bodyText];
    parts.forEach((p, idx) => {
      if (typeof p === "string") {
        paras.push(para(p));
      } else {
        // { label, text } sub-clause like 5.1, 5.2
        paras.push(new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: LINE_1_5, after: 160 },
          indent: { left: convertInchesToTwip(0.25) },
          children: [
            new TextRun({ text: `${number}.${idx + 1}. `, bold: true, font: FONT_BODY, size: SIZE_BODY }),
            run(p),
          ],
        }));
      }
    });
    return paras;
  }

  function pageBreak() {
    return new Paragraph({ children: [new PageBreak()] });
  }

  function spacer(after = 100) {
    return new Paragraph({ text: "", spacing: { after } });
  }

  function bulletList(items) {
    return items.map(t => new Paragraph({
      bullet: { level: 0 },
      spacing: { line: LINE_1_5, after: 100 },
      children: [run(t)],
    }));
  }

  // ---- Tables -----------------------------------------------------------

  function borderedCell(children, opts = {}) {
    const { width, shaded, valign = VerticalAlign.CENTER } = opts;
    return new TableCell({
      width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
      verticalAlign: valign,
      shading: shaded ? { fill: "F0F3FC", type: ShadingType.CLEAR, color: "auto" } : undefined,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
        left: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
        right: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
      },
    });
  }

  function kvRow(label, value) {
    return new TableRow({
      children: [
        borderedCell([new Paragraph({ spacing: { line: 276 }, children: [run(label, { bold: true, size: SIZE_BODY - 2 })] })], { width: 35, shaded: true }),
        borderedCell([new Paragraph({ spacing: { line: 276 }, children: [run(value || "—", { size: SIZE_BODY - 2 })] })], { width: 65 }),
      ],
    });
  }

  function infoTable(rows) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: rows.map(([label, value]) => kvRow(label, value)),
    });
  }

  function headerRow(cells) {
    return new TableRow({
      tableHeader: true,
      children: cells.map(c => borderedCell(
        [new Paragraph({ alignment: AlignmentType.CENTER, children: [run(c, { bold: true, size: SIZE_BODY - 2 })] })],
        { shaded: true }
      )),
    });
  }

  function dataRow(cells, opts = {}) {
    return new TableRow({
      children: cells.map((c, i) => borderedCell(
        [new Paragraph({ alignment: opts.align || AlignmentType.LEFT, children: [run(String(c), { size: SIZE_BODY - 2, bold: opts.boldCols && opts.boldCols.includes(i) })] })],
      )),
    });
  }

  function gridTable(headerCells, bodyRows, opts = {}) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow(headerCells), ...bodyRows.map(r => dataRow(r, opts))],
    });
  }

  // ---- Cover page / header / footer --------------------------------------

  function coverPage(state, lang, t, docTitle, docSubtitle, docSlug) {
    const c = state.company || {};
    const logoImg = c.logo ? tryImage(c.logo, 90, 90) : null;
    const verifyUrl = electronicCopyUrl(state, docSlug || "doc");
    const qrPayload = verifyUrl || `${state.meta.contractNumber} | ${c.name || ""} | ${docTitle}`;
    const qr = qrImage(qrPayload, 96);
    const children = [];

    // Brand accent rule at the very top of the cover page
    children.push(new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: BRAND_BLUE, space: 1 } },
      spacing: { after: 500 },
      children: [],
    }));

    if (logoImg) {
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 250 }, children: [logoImg] }));
    }
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: (c.name || "").toUpperCase(), bold: true, font: FONT_BODY, size: SIZE_H2, color: BRAND_BLUE })],
    }));
    if (c.website || c.email) {
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 700 },
        children: [new TextRun({ text: [c.website, c.email].filter(Boolean).join("  ·  "), font: FONT_BODY, size: SIZE_SMALL, color: MUTED })],
      }));
    } else {
      children.push(new Paragraph({ spacing: { after: 700 }, children: [] }));
    }

    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [new TextRun({ text: docTitle, bold: true, font: FONT_BODY, size: 48, color: INK })],
    }));
    if (docSubtitle) {
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 450 },
        children: [new TextRun({ text: docSubtitle, italics: true, font: FONT_BODY, size: SIZE_H2, color: MUTED })],
      }));
    }
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: `${t("topbar.contractNo")}: ${state.meta.contractNumber}`, bold: true, font: FONT_BODY, size: SIZE_BODY })],
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 900 },
      children: [new TextRun({ text: state.meta.dateDisplay || "", font: FONT_BODY, size: SIZE_BODY, color: MUTED })],
    }));

    // Two-party summary block
    const client = state.client || {};
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          borderedCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run("CONTRACTOR / ИСПОЛНИТЕЛЬ / IJROCHI", { bold: true, size: SIZE_SMALL, color: BRAND_BLUE })] })], { width: 50, shaded: true }),
          borderedCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run("CLIENT / ЗАКАЗЧИК / BUYURTMACHI", { bold: true, size: SIZE_SMALL, color: BRAND_BLUE })] })], { width: 50, shaded: true }),
        ]}),
        new TableRow({ children: [
          borderedCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run(c.name || "—", { bold: true })] })], { width: 50 }),
          borderedCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run(client.name || "—", { bold: true })] })], { width: 50 }),
        ]}),
      ],
    }));

    if (qr) {
      children.push(new Paragraph({ spacing: { before: 550, after: 0 }, children: [] }));
      children.push(new Table({
        alignment: AlignmentType.CENTER,
        width: { size: 45, type: WidthType.PERCENTAGE },
        rows: [new TableRow({ children: [
          new TableCell({
            shading: { fill: "F4F6FB", type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 160, bottom: 160, left: 160, right: 160 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE }, bottom: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
              left: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE }, right: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
            },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [qr] }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [run(verifyUrl ? t("qr.scanToView") : t("qr.verificationCode"), { size: SIZE_SMALL, italics: true, color: MUTED })],
              }),
            ],
          }),
        ]})],
      }));
    }
    children.push(pageBreak());
    return children;
  }

  function header(state, lang, docTitle) {
    const c = state.company || {};
    return new Header({
      children: [
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_BLUE, space: 4 } },
          children: [
            new TextRun({ text: `${c.name || ""}`, bold: true, size: SIZE_SMALL, font: FONT_BODY, color: BRAND_BLUE }),
            new TextRun({ text: `\t${docTitle} · ${state.meta.contractNumber}`, size: SIZE_SMALL, font: FONT_BODY, color: MUTED }),
          ],
        }),
      ],
    });
  }

  function footer(state, lang, t) {
    return new Footer({
      children: [
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE, space: 4 } },
          children: [
            new TextRun({ text: `${t("footer.rights")} ${state.company.name || ""}`, size: SIZE_SMALL, font: FONT_BODY, color: MUTED }),
            new TextRun({ text: "\t", size: SIZE_SMALL }),
            new TextRun({ children: [PageNumber.CURRENT], size: SIZE_SMALL, font: FONT_BODY, color: MUTED }),
            new TextRun({ text: " / ", size: SIZE_SMALL, font: FONT_BODY, color: MUTED }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: SIZE_SMALL, font: FONT_BODY, color: MUTED }),
          ],
        }),
      ],
    });
  }

  function tocPage(tocTitle) {
    return [
      heading1(tocTitle),
      new TableOfContents("", { hyperlink: true, headingStyleRange: "1-2" }),
      pageBreak(),
    ];
  }

  // ---- Signature block ----------------------------------------------------

  const SIGNATURE_LOCALE = {
    en: { sigCaption: "(signature)", seal: "L.S.", dateLabel: "Date" },
    ru: { sigCaption: "(подпись)", seal: "М.П.", dateLabel: "Дата" },
    uz: { sigCaption: "(imzo)", seal: "M.O'.", dateLabel: "Sana" },
  };

  function sealBox(stampImg, lang) {
    const loc = SIGNATURE_LOCALE[lang] || SIGNATURE_LOCALE.en;
    if (stampImg) {
      return new Table({
        width: { size: 40, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [stampImg] })] })] })],
      });
    }
    return new Table({
      width: { size: 40, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: [
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 220, bottom: 220, left: 100, right: 100 },
          borders: {
            top: { style: BorderStyle.DASHED, size: 4, color: HAIRLINE }, bottom: { style: BorderStyle.DASHED, size: 4, color: HAIRLINE },
            left: { style: BorderStyle.DASHED, size: 4, color: HAIRLINE }, right: { style: BorderStyle.DASHED, size: 4, color: HAIRLINE },
          },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run(loc.seal, { color: MUTED, size: SIZE_SMALL })] })],
        }),
      ]})],
    });
  }

  function signatureBlock(state, lang, labels) {
    const c = state.company || {};
    const client = state.client || {};
    const loc = SIGNATURE_LOCALE[lang] || SIGNATURE_LOCALE.en;
    const sigImg = c.signature ? tryImage(c.signature, 130, 55) : null;
    const stampImg = c.stamp ? tryImage(c.stamp, 95, 95) : null;

    function sigLine(nameLine) {
      return [
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: INK } },
          spacing: { before: 60, after: 20 },
          children: [run("\u00A0".repeat(28))],
        }),
        new Paragraph({ spacing: { after: 200 }, children: [run(loc.sigCaption, { italics: true, size: SIZE_SMALL, color: MUTED })] }),
        new Paragraph({ children: [run(nameLine, { bold: true, size: SIZE_BODY - 2 })] }),
      ];
    }

    const contractorCell = [
      new Paragraph({ children: [run(labels.contractorTitle, { bold: true, color: BRAND_BLUE })], spacing: { after: 220 } }),
      new Paragraph({ children: [run(`${labels.companyLabel}: ${c.name || ""}`, { size: SIZE_BODY - 2 })], spacing: { after: 90 } }),
      new Paragraph({ children: [run(`${labels.tinLabel}: ${c.tin || ""}`, { size: SIZE_BODY - 2 })], spacing: { after: 90 } }),
      new Paragraph({ children: [run(`${labels.addressLabel}: ${c.address || ""}`, { size: SIZE_BODY - 2 })], spacing: { after: 90 } }),
      new Paragraph({ children: [run(`${labels.bankLabel}: ${c.bank || ""}`, { size: SIZE_BODY - 2 })], spacing: { after: 90 } }),
      new Paragraph({ children: [run(`${labels.accountLabel}: ${c.account || ""}, MFO: ${c.mfo || ""}`, { size: SIZE_BODY - 2 })], spacing: { after: 90 } }),
      new Paragraph({ children: [run(`${c.phone || ""} ${c.email ? "· " + c.email : ""}`, { size: SIZE_BODY - 2, color: MUTED })], spacing: { after: 340 } }),
      sigImg ? new Paragraph({ children: [sigImg] }) : new Paragraph({ spacing: { after: 500 }, children: [] }),
      ...sigLine(`${c.director || ""}${c.position ? ", " + c.position : ""}`),
      new Paragraph({ spacing: { before: 260, after: 80 }, children: [run(`${loc.dateLabel}: ____________________`, { size: SIZE_BODY - 2, color: MUTED })] }),
      new Paragraph({ spacing: { before: 140 }, children: [sealBox(stampImg, lang)] }),
    ];

    const clientCell = [
      new Paragraph({ children: [run(labels.clientTitle, { bold: true, color: BRAND_BLUE })], spacing: { after: 220 } }),
      new Paragraph({ children: [run(`${labels.nameLabel}: ${client.name || ""}`, { size: SIZE_BODY - 2 })], spacing: { after: 90 } }),
      new Paragraph({ children: [run(`${client.type === "individual" ? labels.passportLabel : labels.tinLabel}: ${client.type === "individual" ? (client.passport || "") : (client.tin || "")}`, { size: SIZE_BODY - 2 })], spacing: { after: 90 } }),
      new Paragraph({ children: [run(`${labels.addressLabel}: ${client.address || ""}`, { size: SIZE_BODY - 2 })], spacing: { after: 90 } }),
      new Paragraph({ children: [run(`${labels.phoneLabel}: ${client.phone || ""}${client.email ? " · " + client.email : ""}`, { size: SIZE_BODY - 2, color: MUTED })], spacing: { after: 340 } }),
      new Paragraph({ spacing: { after: 500 }, children: [] }),
      ...sigLine(`${client.director || client.name || ""}`),
      new Paragraph({ spacing: { before: 260, after: 80 }, children: [run(`${loc.dateLabel}: ____________________`, { size: SIZE_BODY - 2, color: MUTED })] }),
      client.type === "individual"
        ? new Paragraph({ spacing: { before: 140 }, children: [] })
        : new Paragraph({ spacing: { before: 140 }, children: [sealBox(null, lang)] }),
    ];

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
      },
      rows: [new TableRow({ children: [
        new TableCell({ width: { size: 48, type: WidthType.PERCENTAGE }, children: contractorCell, margins: { right: 200 } }),
        new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "" })] }),
        new TableCell({ width: { size: 48, type: WidthType.PERCENTAGE }, children: clientCell, margins: { left: 200 } }),
      ]})],
    });
  }

  // ---- Document assembly ----------------------------------------------

  function buildDocument({ state, lang, t, docTitle, docSubtitle, bodyChildren, includeTOC = true, tocTitle = "Contents", includeCover = true, docSlug = "doc" }) {
    const children = [
      ...(includeCover ? coverPage(state, lang, t, docTitle, docSubtitle, docSlug) : []),
      ...(includeCover && includeTOC ? tocPage(tocTitle) : []),
      ...bodyChildren,
    ];

    return new Document({
      creator: state.company.name || "IT Contract Generator",
      title: docTitle,
      styles: {
        default: {
          document: { run: { font: FONT_BODY, size: SIZE_BODY }, paragraph: { spacing: { line: LINE_1_5 } } },
        },
      },
      sections: [{
        properties: {
          page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
        },
        headers: { default: header(state, lang, docTitle) },
        footers: { default: footer(state, lang, t) },
        children,
      }],
    });
  }

  async function saveDocument(doc, filename) {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  }

  // ---- Electronic (HTML) copy ---------------------------------------------
  // A self-contained, branded HTML twin of the .docx, meant to be hosted by
  // the company (their own site, Manady.uz, Google Drive, etc.) at the URL
  // encoded in the cover-page QR code, so that scanning the QR opens a real,
  // human-readable electronic copy of the signed document.

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function paraTextToHtml(p) {
    if (typeof p === "string") return `<p>${escapeHtml(p)}</p>`;
    return `<p><strong>${escapeHtml(p.label)}</strong> ${escapeHtml(p.text)}</p>`;
  }

  function clausesToHtml(clauses) {
    return clauses.map((entry, idx) => {
      const [title, body] = entry;
      const parts = Array.isArray(body) ? body : [body];
      return `<section class="clause"><h3>${idx + 1}. ${escapeHtml(title)}</h3>${parts.map(paraTextToHtml).join("")}</section>`;
    }).join("\n");
  }

  function htmlSignatureBlock(state, lang, labels) {
    const c = state.company || {}, client = state.client || {};
    const loc = SIGNATURE_LOCALE[lang] || SIGNATURE_LOCALE.en;
    const sig = c.signature ? `<img class="sig-img" src="${c.signature}" alt="signature">` : "";
    const stamp = c.stamp ? `<img class="stamp-img" src="${c.stamp}" alt="stamp">` : `<div class="seal-box">${loc.seal}</div>`;
    return `
    <div class="sign-grid">
      <div class="sign-col">
        <h4>${escapeHtml(labels.contractorTitle)}</h4>
        <p>${escapeHtml(labels.companyLabel)}: ${escapeHtml(c.name)}<br>
           ${escapeHtml(labels.tinLabel)}: ${escapeHtml(c.tin)}<br>
           ${escapeHtml(labels.addressLabel)}: ${escapeHtml(c.address)}<br>
           ${escapeHtml(labels.bankLabel)}: ${escapeHtml(c.bank)}, ${escapeHtml(labels.accountLabel)}: ${escapeHtml(c.account)}, MFO: ${escapeHtml(c.mfo)}</p>
        ${sig}
        <div class="sig-line">${escapeHtml(c.director)}${c.position ? ", " + escapeHtml(c.position) : ""}</div>
        <div class="sig-caption">${loc.sigCaption}</div>
        <div class="date-line">${loc.dateLabel}: ____________________</div>
        ${stamp}
      </div>
      <div class="sign-col">
        <h4>${escapeHtml(labels.clientTitle)}</h4>
        <p>${escapeHtml(labels.nameLabel)}: ${escapeHtml(client.name)}<br>
           ${escapeHtml(client.type === "individual" ? labels.passportLabel : labels.tinLabel)}: ${escapeHtml(client.type === "individual" ? client.passport : client.tin)}<br>
           ${escapeHtml(labels.addressLabel)}: ${escapeHtml(client.address)}<br>
           ${escapeHtml(labels.phoneLabel)}: ${escapeHtml(client.phone)}</p>
        <div class="sig-line">${escapeHtml(client.director || client.name)}</div>
        <div class="sig-caption">${loc.sigCaption}</div>
        <div class="date-line">${loc.dateLabel}: ____________________</div>
      </div>
    </div>`;
  }

  const HTML_LOCALE = {
    en: { badge: "ELECTRONIC COPY", note: "This page is the electronic copy of a document generated by the Uzbekistan IT Contract Generator. It has the same content as the signed .docx original.", toc: "Contents" },
    ru: { badge: "ЭЛЕКТРОННАЯ КОПИЯ", note: "Данная страница является электронной копией документа, созданного в Uzbekistan IT Contract Generator. Содержание соответствует подписанному оригиналу в формате .docx.", toc: "Содержание" },
    uz: { badge: "ELEKTRON NUSXA", note: "Ushbu sahifa Uzbekistan IT Contract Generator orqali yaratilgan hujjatning elektron nusxasidir. Mazmuni imzolangan .docx asl nusxasiga mos keladi.", toc: "Mundarija" },
  };

  function buildHtmlDoc({ state, lang, t, docTitle, docSubtitle, preamble, clauses, signLabels, annexRows, annexTitle }) {
    const c = state.company || {};
    const loc = HTML_LOCALE[lang] || HTML_LOCALE.en;
    const annexHtml = annexRows ? `
      <section class="clause"><h3>${escapeHtml(annexTitle || "Annex")}</h3>
        <table class="annex-table">${annexRows.map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join("")}</table>
      </section>` : "";

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(docTitle)} — ${escapeHtml(state.meta.contractNumber)}</title>
<style>
  :root { --brand:#1B4DFF; --ink:#111827; --muted:#5B6472; --border:#E3E8F4; --soft:#F4F6FB; }
  * { box-sizing: border-box; }
  body { font-family: "Times New Roman", Georgia, serif; color: var(--ink); background: var(--soft); margin:0; padding: 0 0 60px; line-height:1.6; }
  .topband { height:8px; background: var(--brand); }
  .wrap { max-width: 820px; margin: 0 auto; background:#fff; padding: 48px 56px; box-shadow: 0 10px 40px rgba(17,24,39,.08); margin-top: 24px; border-radius: 10px; }
  .badge { display:inline-block; background:#EAEFFF; color:var(--brand); font-family: system-ui, sans-serif; font-weight:700; font-size:12px; letter-spacing:.06em; padding:5px 12px; border-radius:999px; margin-bottom:18px; }
  h1 { text-align:center; font-size: 26px; margin: 6px 0 4px; }
  .subtitle { text-align:center; color: var(--muted); font-style: italic; margin-bottom: 4px; }
  .meta { text-align:center; color: var(--muted); font-family: system-ui, sans-serif; font-size: 13px; margin-bottom: 28px; }
  .brandline { text-align:center; font-weight:700; color: var(--brand); margin-bottom: 30px; font-family: system-ui, sans-serif; }
  .preamble { text-align:justify; margin-bottom: 26px; }
  h3 { font-size: 15px; text-transform: uppercase; letter-spacing:.02em; border-bottom:1px solid var(--border); padding-bottom:6px; margin-top:28px; }
  .clause p { text-align: justify; margin: 10px 0; }
  .annex-table { width:100%; border-collapse: collapse; font-family: system-ui, sans-serif; font-size: 13.5px; }
  .annex-table th, .annex-table td { border:1px solid var(--border); padding:8px 10px; text-align:left; }
  .annex-table th { background: var(--soft); width: 38%; }
  .sign-grid { display:grid; grid-template-columns:1fr 1fr; gap: 32px; margin-top: 36px; font-family: system-ui, sans-serif; font-size: 13.5px; }
  .sign-col h4 { color: var(--brand); font-size:13px; text-transform:uppercase; letter-spacing:.04em; }
  .sig-img { max-width: 140px; display:block; margin-top: 20px; }
  .stamp-img { max-width:90px; margin-top: 16px; }
  .seal-box { width:90px; height:90px; border:1.5px dashed var(--border); border-radius:6px; display:flex; align-items:center; justify-content:center; color:var(--muted); margin-top:16px; font-size:12px; }
  .sig-line { border-top:1px solid var(--ink); margin-top: 30px; padding-top:6px; font-weight:600; }
  .sig-caption { color: var(--muted); font-style: italic; font-size:12px; margin-bottom: 14px; }
  .date-line { color: var(--muted); margin-top: 6px; }
  .footnote { text-align:center; color:var(--muted); font-family: system-ui, sans-serif; font-size:11.5px; margin-top: 40px; border-top:1px solid var(--border); padding-top:16px; }
  @media (max-width:700px){ .wrap{padding:28px 20px;} .sign-grid{grid-template-columns:1fr;} }
  @media print { body{background:#fff;} .wrap{box-shadow:none;margin-top:0;} }
</style>
</head>
<body>
  <div class="topband"></div>
  <div class="wrap">
    <div style="text-align:center;"><span class="badge">${loc.badge}</span></div>
    <div class="brandline">${escapeHtml((c.name || "").toUpperCase())}</div>
    <h1>${escapeHtml(docTitle)}</h1>
    ${docSubtitle ? `<div class="subtitle">${escapeHtml(docSubtitle)}</div>` : ""}
    <div class="meta">${escapeHtml(t("topbar.contractNo"))}: ${escapeHtml(state.meta.contractNumber)} &nbsp;·&nbsp; ${escapeHtml(state.meta.dateDisplay)}</div>
    <div class="preamble">${escapeHtml(preamble)}</div>
    ${clausesToHtml(clauses)}
    ${annexHtml}
    ${htmlSignatureBlock(state, lang, signLabels)}
    <div class="footnote">${loc.note}</div>
  </div>
</body>
</html>`;
  }

  function saveHtml(htmlString, filename) {
    const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
    saveAs(blob, filename);
  }

  return {
    para, heading1, heading2, clause, pageBreak, spacer, bulletList,
    infoTable, gridTable, kvRow, coverPage, header, footer, tocPage,
    signatureBlock, buildDocument, saveDocument, run, tryImage, qrImage,
    dataUrlToBytes, electronicCopyUrl, buildHtmlDoc, saveHtml,
    BRAND_BLUE, INK, MUTED, HAIRLINE,
  };
})();
