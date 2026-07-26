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

  function coverPage(state, lang, t, docTitle, docSubtitle) {
    const c = state.company || {};
    const logoImg = c.logo ? tryImage(c.logo, 90, 90) : null;
    const qr = qrImage(`${state.meta.contractNumber} | ${c.name || ""} | ${docTitle}`, 90);
    const children = [];

    children.push(new Paragraph({ spacing: { after: 600 }, children: [] }));
    if (logoImg) {
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [logoImg] }));
    }
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: (c.name || "").toUpperCase(), bold: true, font: FONT_BODY, size: SIZE_H2, color: BRAND_BLUE })],
    }));
    children.push(new Paragraph({ spacing: { after: 800 }, children: [] }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: docTitle, bold: true, font: FONT_BODY, size: 48, color: INK })],
    }));
    if (docSubtitle) {
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 500 },
        children: [new TextRun({ text: docSubtitle, italics: true, font: FONT_BODY, size: SIZE_H2, color: MUTED })],
      }));
    }
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: `${t("topbar.contractNo")}: ${state.meta.contractNumber}`, bold: true, font: FONT_BODY, size: SIZE_BODY })],
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
      children: [new TextRun({ text: state.meta.dateDisplay || "", font: FONT_BODY, size: SIZE_BODY })],
    }));

    // Two-party summary block
    const client = state.client || {};
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          borderedCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run("CONTRACTOR / ИСПОЛНИТЕЛЬ / IJROCHI", { bold: true, size: SIZE_SMALL })] })], { width: 50, shaded: true }),
          borderedCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run("CLIENT / ЗАКАЗЧИК / BUYURTMACHI", { bold: true, size: SIZE_SMALL })] })], { width: 50, shaded: true }),
        ]}),
        new TableRow({ children: [
          borderedCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run(c.name || "—", { bold: true })] })], { width: 50 }),
          borderedCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run(client.name || "—", { bold: true })] })], { width: 50 }),
        ]}),
      ],
    }));

    if (qr) {
      children.push(new Paragraph({ spacing: { before: 500 }, alignment: AlignmentType.CENTER, children: [qr] }));
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [run("Verification code / Tasdiqlash kodi", { size: SIZE_SMALL, italics: true })] }));
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

  function signatureBlock(state, lang, labels) {
    const c = state.company || {};
    const client = state.client || {};
    const sigImg = c.signature ? tryImage(c.signature, 120, 50) : null;
    const stampImg = c.stamp ? tryImage(c.stamp, 90, 90) : null;

    const contractorCell = [
      new Paragraph({ children: [run(labels.contractorTitle, { bold: true })], spacing: { after: 200 } }),
      new Paragraph({ children: [run(`${labels.companyLabel}: ${c.name || ""}`)], spacing: { after: 100 } }),
      new Paragraph({ children: [run(`${labels.tinLabel}: ${c.tin || ""}`)], spacing: { after: 100 } }),
      new Paragraph({ children: [run(`${labels.addressLabel}: ${c.address || ""}`)], spacing: { after: 100 } }),
      new Paragraph({ children: [run(`${labels.bankLabel}: ${c.bank || ""}, ${labels.accountLabel}: ${c.account || ""}, MFO: ${c.mfo || ""}`)], spacing: { after: 400 } }),
      sigImg ? new Paragraph({ children: [sigImg] }) : new Paragraph({ text: "" }),
      new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 4, color: INK } }, spacing: { before: 100 }, children: [run(`${c.director || ""}, ${c.position || ""}`)] }),
      stampImg ? new Paragraph({ spacing: { before: 200 }, children: [stampImg] }) : new Paragraph({ text: "" }),
    ];

    const clientCell = [
      new Paragraph({ children: [run(labels.clientTitle, { bold: true })], spacing: { after: 200 } }),
      new Paragraph({ children: [run(`${labels.nameLabel}: ${client.name || ""}`)], spacing: { after: 100 } }),
      new Paragraph({ children: [run(`${client.type === "individual" ? labels.passportLabel : labels.tinLabel}: ${client.type === "individual" ? (client.passport || "") : (client.tin || "")}`)], spacing: { after: 100 } }),
      new Paragraph({ children: [run(`${labels.addressLabel}: ${client.address || ""}`)], spacing: { after: 100 } }),
      new Paragraph({ children: [run(`${labels.phoneLabel}: ${client.phone || ""}`)], spacing: { after: 400 } }),
      new Paragraph({ text: "" }),
      new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 4, color: INK } }, spacing: { before: 100 }, children: [run(`${client.director || client.name || ""}`)] }),
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

  function buildDocument({ state, lang, t, docTitle, docSubtitle, bodyChildren, includeTOC = true, tocTitle = "Contents", includeCover = true }) {
    const children = [
      ...(includeCover ? coverPage(state, lang, t, docTitle, docSubtitle) : []),
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

  return {
    para, heading1, heading2, clause, pageBreak, spacer, bulletList,
    infoTable, gridTable, kvRow, coverPage, header, footer, tocPage,
    signatureBlock, buildDocument, saveDocument, run, tryImage, qrImage,
    dataUrlToBytes, BRAND_BLUE, INK, MUTED, HAIRLINE,
  };
})();
