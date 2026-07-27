/**
 * contracts/invoice.js — Professional invoice template (single/double page).
 */
const ContractInvoice = (() => {
  const W = WordGen;
  const { Paragraph, TextRun, AlignmentType } = docx;

  function money(state, amount) {
    if (amount === undefined || amount === null || amount === "") return "0";
    const n = Number(amount);
    if (Number.isNaN(n)) return amount;
    return n.toLocaleString("en-US");
  }

  function content(state, lang) {
    const T = {
      en: {
        title: "Invoice", labels: {
          invoiceNo: "Invoice No.", date: "Date", dueDate: "Due date", billTo: "Bill to", from: "From",
          project: "Project", description: "Description", qty: "Qty", unitPrice: "Unit price", amount: "Amount",
          subtotal: "Subtotal", vat: "VAT", total: "Total due", notes: "Notes", paymentDetails: "Payment details",
          note: "Please make payment by bank transfer to the account specified below, referencing the invoice number.",
          esfNote: "This document is a commercial payment request and does not replace the official electronic tax invoice (E-invoice/EF) that VAT-registered persons must issue through the state tax authority's electronic invoicing system in accordance with the Tax Code of the Republic of Uzbekistan.",
        },
      },
      ru: {
        title: "Счёт на оплату", labels: {
          invoiceNo: "Счёт №", date: "Дата", dueDate: "Срок оплаты", billTo: "Плательщик", from: "Получатель",
          project: "Проект", description: "Описание", qty: "Кол-во", unitPrice: "Цена за ед.", amount: "Сумма",
          subtotal: "Промежуточный итог", vat: "НДС", total: "Итого к оплате", notes: "Примечания", paymentDetails: "Платёжные реквизиты",
          note: "Просьба произвести оплату банковским переводом на указанный ниже счёт с указанием номера счёта в назначении платежа.",
          esfNote: "Настоящий документ является коммерческим требованием об оплате и не заменяет официальный электронный счёт-фактуру (ЭСФ), который плательщики НДС обязаны оформлять через систему электронных счетов-фактур налоговых органов в соответствии с Налоговым кодексом Республики Узбекистан.",
        },
      },
      uz: {
        title: "Hisob-faktura", labels: {
          invoiceNo: "Hisob-faktura №", date: "Sana", dueDate: "To'lov muddati", billTo: "To'lovchi", from: "Qabul qiluvchi",
          project: "Loyiha", description: "Tavsif", qty: "Soni", unitPrice: "Birlik narxi", amount: "Summa",
          subtotal: "Oraliq jami", vat: "QQS", total: "To'lanishi lozim jami", notes: "Izohlar", paymentDetails: "To'lov rekvizitlari",
          note: "Iltimos, to'lovni quyida ko'rsatilgan hisob raqamiga, to'lov maqsadida hisob-faktura raqamini ko'rsatgan holda, bank o'tkazmasi orqali amalga oshiring.",
          esfNote: "Ushbu hujjat tijorat to'lov talabnomasi hisoblanadi va QQS to'lovchilari Soliq kodeksiga muvofiq davlat soliq organining elektron hisob-fakturalar tizimi orqali rasmiylashtirishi shart bo'lgan rasmiy elektron hisob-fakturani (ЭСФ) almashtirmaydi.",
        },
      },
    };
    return T[lang] || T.en;
  }

  function generate(state, lang, t) {
    const co = state.company, cl = state.client, pr = state.project, pay = state.payment;
    const c = content(state, lang);
    const L = c.labels;
    const currency = pay.currency || "UZS";
    const items = (state.invoiceItems && state.invoiceItems.length) ? state.invoiceItems : [
      { desc: pr.name || "IT Services", qty: 1, price: pay.price || 0 },
    ];
    const subtotal = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
    const vatRate = pay.vatIncluded ? 0 : (Number(state.meta.defaultVat) || 0);
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    const body = [];
    body.push(W.heading1(c.title));
    body.push(W.spacer(100));
    body.push(W.infoTable([
      [L.invoiceNo, state.meta.contractNumber],
      [L.date, state.meta.dateDisplay],
      [L.dueDate, pay.invoiceDueDate || "—"],
      [L.project, pr.name || "—"],
    ]));
    body.push(W.spacer(200));

    body.push(new Paragraph({ children: [new TextRun({ text: L.from, bold: true, font: "Times New Roman", size: 24 })], spacing: { after: 100 } }));
    body.push(W.para(`${co.name || ""} · ${L.invoiceNo === "Счёт №" ? "ИНН" : "TIN"}: ${co.tin || "—"} · ${co.address || ""} · ${co.phone || ""} · ${co.email || ""}`, { indentFirstLine: false, align: AlignmentType.LEFT }));
    body.push(new Paragraph({ children: [new TextRun({ text: L.billTo, bold: true, font: "Times New Roman", size: 24 })], spacing: { before: 200, after: 100 } }));
    body.push(W.para(`${cl.name || ""} · ${cl.type === "individual" ? (cl.passport || "") : (cl.tin || "")} · ${cl.address || ""} · ${cl.phone || ""}`, { indentFirstLine: false, align: AlignmentType.LEFT }));
    body.push(W.spacer(300));

    const rows = items.map((it, i) => [
      String(i + 1), it.desc || "—", String(it.qty || 0), `${money(state, it.price)} ${currency}`,
      `${money(state, (Number(it.qty) || 0) * (Number(it.price) || 0))} ${currency}`,
    ]);
    body.push(W.gridTable(["#", L.description, L.qty, L.unitPrice, L.amount], rows));
    body.push(W.spacer(200));

    body.push(W.infoTable([
      [L.subtotal, `${money(state, subtotal)} ${currency}`],
      [`${L.vat} (${vatRate}%)`, `${money(state, vatAmount)} ${currency}`],
      [L.total, `${money(state, total)} ${currency}`],
    ]));
    body.push(W.spacer(300));

    body.push(new Paragraph({ children: [new TextRun({ text: L.paymentDetails, bold: true, font: "Times New Roman", size: 24 })], spacing: { after: 100 } }));
    body.push(W.infoTable([
      [t("field.bank"), co.bank || "—"],
      [t("field.account"), co.account || "—"],
      ["MFO", co.mfo || "—"],
      [t("field.tin"), co.tin || "—"],
    ]));
    body.push(W.spacer(200));
    body.push(W.para(L.note, { indentFirstLine: false }));
    body.push(W.spacer(150));
    body.push(W.para(L.esfNote, { indentFirstLine: false, italic: true, size: 20 }));
    body.push(W.spacer(400));

    if (co.stamp) {
      const stampImg = W.tryImage(co.stamp, 90, 90);
      if (stampImg) body.push(new Paragraph({ children: [stampImg] }));
    }
    if (co.signature) {
      const sigImg = W.tryImage(co.signature, 120, 50);
      if (sigImg) body.push(new Paragraph({ spacing: { before: 100 }, children: [sigImg] }));
    }
    body.push(new Paragraph({ border: { top: { style: docx.BorderStyle.SINGLE, size: 4, color: "111827" } }, spacing: { before: 100 }, children: [W.run(`${co.director || ""}, ${co.position || ""}`)] }));

    return W.buildDocument({
      state, lang, t, docTitle: c.title, docSubtitle: `${L.invoiceNo} ${state.meta.contractNumber}`,
      bodyChildren: body, includeCover: false, includeTOC: false,
    });
  }

  return { generate };
})();
