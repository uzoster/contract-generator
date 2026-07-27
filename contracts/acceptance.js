/**
 * contracts/acceptance.js — Project / Milestone Acceptance Act template (~5 pages).
 */
const ContractAcceptance = (() => {
  const W = WordGen;

  function money(state, amount) {
    if (!amount) return "—";
    const n = Number(amount);
    if (Number.isNaN(n)) return amount;
    return `${n.toLocaleString("en-US")} ${state.payment.currency || "UZS"}`;
  }

  function content(state, lang) {
    const co = state.company, cl = state.client, pr = state.project, pay = state.payment, ac = state.acceptance;
    const T = {
      en: {
        title: "Project Acceptance Act",
        subtitle: `Under Agreement No. ${state.meta.contractNumber}`,
        preamble: `This Acceptance Act (the "Act") is executed in Tashkent, the Republic of Uzbekistan, on ${state.meta.dateDisplay}, by ${co.name || "[Contractor]"} ("the Contractor") and ${cl.name || "[Client]"} ("the Client") to confirm the delivery and acceptance of work performed under IT Service Agreement No. ${state.meta.contractNumber} regarding the project "${pr.name || "[Project Name]"}."`,
        clauses: [
          ["Subject of the Act", [`The Contractor has delivered, and the Client has reviewed, the Deliverables described below in connection with the project "${pr.name || "[Project Name]"}" (${pr.type || "—"}).`]],
          ["Description of Delivered Work", [pr.description || "As detailed in the Statement of Work (Annex 1) to the underlying Agreement."]],
          ["Review Period", [`In accordance with the underlying Agreement, the Client had ${ac.acceptancePeriod || "5"} business days from the date of delivery to review the Deliverables and raise any objections in writing.`]],
          ["Findings", ["The Client confirms that the Deliverables have been reviewed and found to conform to the agreed specification, subject to any deficiencies listed in the table below, if any."]],
          ["Financial Summary", [`Value of work covered by this Act: ${money(state, pay.price)}. Payment status shall be tracked separately in accordance with the payment schedule set out in the underlying Agreement.`]],
          ["Warranty Commencement", [`The Warranty Period referred to in the underlying Agreement (${pr.warranty || "as specified therein"}) shall be deemed to commence on the date of signing of this Act.`]],
          ["Final Statement", ["By signing this Act, the Parties confirm that, save for any deficiencies expressly noted below, the Deliverables described herein have been duly delivered and accepted, without prejudice to the Contractor's warranty obligations under the underlying Agreement."]],
        ],
        deficiencyHeader: ["#", "Deficiency description", "Severity", "Target fix date"],
        signContractorTitle: "CONTRACTOR",
        signClientTitle: "CLIENT",
      },
      ru: {
        title: "Акт приёма-передачи выполненных работ",
        subtitle: `По Договору № ${state.meta.contractNumber}`,
        preamble: `Настоящий Акт приёма-передачи (далее — «Акт») составлен в городе Ташкент, Республика Узбекистан, «${state.meta.dateDisplay}», между ${co.name || "[Исполнитель]"} («Исполнитель») и ${cl.name || "[Заказчик]"} («Заказчик») в подтверждение передачи и приёмки работ, выполненных по Договору оказания IT-услуг № ${state.meta.contractNumber}, по проекту «${pr.name || "[Название проекта]"}».`,
        clauses: [
          ["Предмет Акта", [`Исполнитель передал, а Заказчик рассмотрел Результаты работ, указанные ниже, по проекту «${pr.name || "[Название проекта]"}» (${pr.type || "—"}).`]],
          ["Описание переданных работ", [pr.description || "Согласно Техническому заданию (Приложение № 1) к основному Договору."]],
          ["Срок рассмотрения", [`В соответствии с основным Договором, Заказчик располагал ${ac.acceptancePeriod || "5"} рабочими днями с даты передачи для рассмотрения Результатов работ и заявления письменных возражений.`]],
          ["Заключение", ["Заказчик подтверждает, что Результаты работ рассмотрены и соответствуют согласованной спецификации, с учётом замечаний, перечисленных в таблице ниже, при их наличии."]],
          ["Финансовая сводка", [`Стоимость работ, охватываемых настоящим Актом: ${money(state, pay.price)}. Статус оплаты отслеживается отдельно в соответствии с графиком платежей, установленным основным Договором.`]],
          ["Начало гарантийного периода", [`Гарантийный период, предусмотренный основным Договором (${pr.warranty || "согласно его условиям"}), считается начавшимся с даты подписания настоящего Акта.`]],
          ["Итоговое заявление", ["Подписывая настоящий Акт, Стороны подтверждают, что, за исключением замечаний, прямо указанных ниже, описанные Результаты работ надлежащим образом переданы и приняты, без ущерба для гарантийных обязательств Исполнителя по основному Договору."]],
        ],
        deficiencyHeader: ["№", "Описание замечания", "Критичность", "Срок устранения"],
        signContractorTitle: "ИСПОЛНИТЕЛЬ",
        signClientTitle: "ЗАКАЗЧИК",
      },
      uz: {
        title: "Ishlarni qabul qilish-topshirish dalolatnomasi",
        subtitle: `№ ${state.meta.contractNumber} shartnoma bo'yicha`,
        preamble: `Ushbu Qabul qilish dalolatnomasi (keyingi o'rinlarda — «Dalolatnoma») Toshkent shahrida, O'zbekiston Respublikasida, ${state.meta.dateDisplay} kuni, ${co.name || "[Ijrochi]"} («Ijrochi») va ${cl.name || "[Buyurtmachi]"} («Buyurtmachi») o'rtasida № ${state.meta.contractNumber} IT xizmatlarni ko'rsatish shartnomasi bo'yicha «${pr.name || "[Loyiha nomi]"}» loyihasi doirasida bajarilgan ishlarning topshirilishi va qabul qilinishini tasdiqlash uchun tuzildi.`,
        clauses: [
          ["Dalolatnoma predmeti", [`Ijrochi «${pr.name || "[Loyiha nomi]"}» (${pr.type || "—"}) loyihasi bo'yicha quyida ko'rsatilgan Natijalarni topshirdi, Buyurtmachi esa ularni ko'rib chiqdi.`]],
          ["Topshirilgan ishlar tavsifi", [pr.description || "Asosiy Shartnomaga 1-ilova (Texnik topshiriq)da batafsil ko'rsatilganidek."]],
          ["Ko'rib chiqish muddati", [`Asosiy Shartnomaga muvofiq, Buyurtmachi Natijalarni ko'rib chiqish va yozma e'tirozlarni bildirish uchun topshirilgan kundan boshlab ${ac.acceptancePeriod || "5"} ish kuniga ega edi.`]],
          ["Xulosa", ["Buyurtmachi Natijalar ko'rib chiqilgani va quyidagi jadvalda ko'rsatilgan kamchiliklar (agar mavjud bo'lsa) bundan mustasno, kelishilgan spesifikatsiyaga mos kelishini tasdiqlaydi."]],
          ["Moliyaviy xulosa", [`Ushbu Dalolatnoma qamrab olgan ishlar qiymati: ${money(state, pay.price)}. To'lov holati asosiy Shartnomada belgilangan to'lov jadvaliga muvofiq alohida kuzatiladi.`]],
          ["Kafolat muddatining boshlanishi", [`Asosiy Shartnomada nazarda tutilgan Kafolat muddati (${pr.warranty || "unda ko'rsatilganidek"}) ushbu Dalolatnoma imzolangan kundan boshlab boshlangan hisoblanadi.`]],
          ["Yakuniy bayonot", ["Ushbu Dalolatnomani imzolash orqali Taraflar, quyida aniq ko'rsatilgan kamchiliklar bundan mustasno, tavsiflangan Natijalar tegishli tarzda topshirilgani va qabul qilingani, bu esa Ijrochining asosiy Shartnoma bo'yicha kafolat majburiyatlariga putur yetkazmasligini tasdiqlaydilar."]],
        ],
        deficiencyHeader: ["№", "Kamchilik tavsifi", "Muhimlik darajasi", "Bartaraf etish muddati"],
        signContractorTitle: "IJROCHI",
        signClientTitle: "BUYURTMACHI",
      },
    };
    return T[lang] || T.en;
  }

  function generate(state, lang, t) {
    const c = content(state, lang);
    const body = [];
    body.push(W.para(c.preamble, { indentFirstLine: false }));
    body.push(W.spacer(200));
    c.clauses.forEach((entry, idx) => {
      body.push(...W.clause(idx + 1, entry[0], entry[1]));
    });
    body.push(W.spacer(150));
    body.push(W.gridTable(c.deficiencyHeader, [["1", "—", "—", "—"]]));
    body.push(W.spacer(400));
    body.push(W.signatureBlock(state, lang, {
      contractorTitle: c.signContractorTitle,
      clientTitle: c.signClientTitle,
      companyLabel: t("field.companyName"),
      tinLabel: t("field.tin"),
      addressLabel: t("field.address"),
      bankLabel: t("field.bank"),
      accountLabel: t("field.account"),
      nameLabel: t("field.companyName"),
      passportLabel: t("field.passportPinfl"),
      phoneLabel: t("field.phone"),
    }));
    return W.buildDocument({ state, lang, t, docTitle: c.title, docSubtitle: c.subtitle, bodyChildren: body, includeTOC: false, docSlug: "acceptance" });
  }

  return { generate, content };
})();
