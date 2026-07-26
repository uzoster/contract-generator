/**
 * contracts/sow.js — Statement of Work template (10–20 pages depending on milestones).
 */
const ContractSOW = (() => {
  const W = WordGen;

  function money(state, amount) {
    if (!amount) return "—";
    const n = Number(amount);
    if (Number.isNaN(n)) return amount;
    return `${n.toLocaleString("en-US")} ${state.payment.currency || "UZS"}`;
  }

  function milestoneRows(pr) {
    const list = (pr.milestones || "").split("\n").map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return [["1", "—", "—"]];
    return list.map((m, i) => [String(i + 1), m, "—"]);
  }

  function content(state, lang) {
    const co = state.company, cl = state.client, pr = state.project, pay = state.payment;
    const T = {
      en: {
        title: "Statement of Work",
        subtitle: `Annex to Agreement No. ${state.meta.contractNumber}`,
        toc: "Table of Contents",
        preamble: `This Statement of Work ("SOW") is issued under and forms an integral part of the IT Service Agreement No. ${state.meta.contractNumber} between ${co.name || "[Contractor]"} ("the Contractor") and ${cl.name || "[Client]"} ("the Client"), and sets out the detailed scope, deliverables, schedule, and acceptance criteria for the project titled "${pr.name || "[Project Name]"}."`,
        clauses: [
          ["Project Overview", [`Project type: ${pr.type || "—"}.`, `Description: ${pr.description || "To be detailed by the Parties prior to project kickoff."}`]],
          ["Objectives", ["The objective of this SOW is to define, in unambiguous terms, what will be built, how progress will be measured, and the criteria under which Deliverables will be accepted by the Client, so as to minimize ambiguity and scope disputes during execution."]],
          ["Technology Stack", [`The Project will be implemented using the following technologies and platforms: ${pr.technologies || "to be finalized during the discovery phase"}.`]],
          ["Functional Scope", ["The functional scope of the Project includes the features, modules, and integrations described in the Project Description above, together with any refinements agreed in writing during the discovery or planning phase preceding development."]],
          ["Out of Scope", ["Any feature, integration, platform, or deliverable not explicitly described in this SOW is considered out of scope and shall be handled as Additional Work under the terms of the underlying Agreement, requiring a separate written estimate before implementation begins."]],
          ["Milestones and Deliverables", ["The Project shall be delivered according to the following milestone plan. Dates and payment percentages per milestone shall be confirmed in writing by both Parties before the corresponding phase begins."]],
          ["Timeline", [`Estimated start date: ${pr.startDate || "—"}. Estimated completion date: ${pr.endDate || "—"}. Total estimated effort: ${pr.estimatedHours || "—"} person-hours.`]],
          ["Roles and Responsibilities", ["The Contractor is responsible for technical design, implementation, testing, and delivery of the agreed Deliverables. The Client is responsible for timely feedback, provision of necessary access and content, and designation of a single point of contact for approvals."]],
          ["Acceptance Criteria", ["A Deliverable shall be considered complete when it satisfies the functional description set out in this SOW and passes the testing procedures referenced in the underlying Agreement. Acceptance shall follow the procedure and timelines defined in the Agreement's Acceptance Procedure clause."]],
          ["Assumptions and Dependencies", ["This SOW assumes timely availability of Client stakeholders for feedback, timely provision of required credentials, content, and third-party accounts, and that no material change in the regulatory or technical environment will affect the Project during its execution. Delays caused by the Client's failure to meet these assumptions may extend the timeline accordingly."]],
          ["Change Management", ["Any change to the scope, timeline, or budget described in this SOW must be documented as a written change request and signed by authorized representatives of both Parties before implementation, in accordance with the Change Requests clause of the underlying Agreement."]],
        ],
        milestoneHeaders: ["#", "Milestone / Deliverable", "Target Date"],
        signContractorTitle: "CONTRACTOR",
        signClientTitle: "CLIENT",
      },
      ru: {
        title: "Техническое задание (SOW)",
        subtitle: `Приложение к Договору № ${state.meta.contractNumber}`,
        toc: "Содержание",
        preamble: `Настоящее Техническое задание («ТЗ») выдано в рамках Договора оказания IT-услуг № ${state.meta.contractNumber} между ${co.name || "[Исполнитель]"} («Исполнитель») и ${cl.name || "[Заказчик]"} («Заказчик») и является его неотъемлемой частью, определяя детальный объём работ, результаты, график и критерии приёмки для проекта «${pr.name || "[Название проекта]"}».`,
        clauses: [
          ["Обзор проекта", [`Тип проекта: ${pr.type || "—"}.`, `Описание: ${pr.description || "подлежит уточнению Сторонами до начала работ."}`]],
          ["Цели", ["Целью настоящего ТЗ является однозначное определение того, что будет разработано, каким образом будет измеряться прогресс, и по каким критериям Результаты работ будут приниматься Заказчиком, с тем чтобы минимизировать неопределённость и споры об объёме работ в ходе исполнения."]],
          ["Технологический стек", [`Проект будет реализован с использованием следующих технологий и платформ: ${pr.technologies || "уточняется на этапе анализа требований"}.`]],
          ["Функциональный объём", ["Функциональный объём Проекта включает функции, модули и интеграции, описанные в разделе «Описание проекта» выше, а также любые уточнения, согласованные в письменной форме на этапе анализа требований или планирования, предшествующем разработке."]],
          ["Вне объёма работ", ["Любая функция, интеграция, платформа либо результат, прямо не описанные в настоящем ТЗ, считаются выходящими за пределы объёма работ и рассматриваются как Дополнительные работы в соответствии с условиями основного Договора, требующие отдельной письменной оценки до начала реализации."]],
          ["Этапы и результаты", ["Проект будет реализован в соответствии со следующим планом этапов. Даты и проценты оплаты по каждому этапу подлежат письменному подтверждению обеими Сторонами до начала соответствующего этапа."]],
          ["Сроки", [`Ориентировочная дата начала: ${pr.startDate || "—"}. Ориентировочная дата завершения: ${pr.endDate || "—"}. Общая ориентировочная трудоёмкость: ${pr.estimatedHours || "—"} человеко-часов.`]],
          ["Роли и ответственность", ["Исполнитель отвечает за техническое проектирование, реализацию, тестирование и передачу согласованных Результатов работ. Заказчик отвечает за своевременную обратную связь, предоставление необходимого доступа и материалов, а также назначение единого контактного лица для согласований."]],
          ["Критерии приёмки", ["Результат работ считается завершённым, если он соответствует функциональному описанию, указанному в настоящем ТЗ, и успешно проходит процедуры тестирования, предусмотренные основным Договором. Приёмка осуществляется в порядке и в сроки, определённые разделом «Порядок приёмки» основного Договора."]],
          ["Допущения и зависимости", ["Настоящее ТЗ исходит из своевременной доступности представителей Заказчика для обратной связи, своевременного предоставления необходимых учётных данных, материалов и учётных записей третьих лиц, а также отсутствия существенных изменений в нормативной или технической среде в период реализации Проекта. Задержки, вызванные невыполнением Заказчиком указанных допущений, могут соответствующим образом продлевать сроки."]],
          ["Управление изменениями", ["Любое изменение объёма, сроков или бюджета, указанных в настоящем ТЗ, должно оформляться письменным запросом на изменение и подписываться уполномоченными представителями обеих Сторон до начала реализации, в соответствии с разделом «Дополнительные работы и изменения» основного Договора."]],
        ],
        milestoneHeaders: ["№", "Этап / результат", "Целевая дата"],
        signContractorTitle: "ИСПОЛНИТЕЛЬ",
        signClientTitle: "ЗАКАЗЧИК",
      },
      uz: {
        title: "Ish doirasi hujjati (SOW)",
        subtitle: `№ ${state.meta.contractNumber} shartnomasiga ilova`,
        toc: "Mundarija",
        preamble: `Ushbu Texnik topshiriq («TT») ${co.name || "[Ijrochi]"} («Ijrochi») va ${cl.name || "[Buyurtmachi]"} («Buyurtmachi») o'rtasidagi № ${state.meta.contractNumber} IT xizmatlarni ko'rsatish shartnomasi doirasida chiqarilgan bo'lib, uning ajralmas qismini tashkil etadi hamda «${pr.name || "[Loyiha nomi]"}» loyihasi uchun batafsil ish doirasi, natijalar, jadval va qabul qilish mezonlarini belgilaydi.`,
        clauses: [
          ["Loyiha haqida umumiy ma'lumot", [`Loyiha turi: ${pr.type || "—"}.`, `Tavsif: ${pr.description || "loyiha boshlanishidan oldin Taraflar tomonidan aniqlashtiriladi."}`]],
          ["Maqsadlar", ["Ushbu TT maqsadi nima ishlab chiqilishini, taraqqiyot qanday o'lchanishini va Natijalar Buyurtmachi tomonidan qanday mezonlar asosida qabul qilinishini aniq belgilashdan iborat bo'lib, bu ijro jarayonida noaniqlik va doira bo'yicha nizolarni kamaytiradi."]],
          ["Texnologiyalar to'plami", [`Loyiha quyidagi texnologiyalar va platformalardan foydalangan holda amalga oshiriladi: ${pr.technologies || "talablarni tahlil qilish bosqichida aniqlashtiriladi"}.`]],
          ["Funksional doira", ["Loyihaning funksional doirasi yuqoridagi «Loyiha tavsifi»da keltirilgan funksiyalar, modullar va integratsiyalarni, shuningdek ishlab chiqishdan oldingi tahlil yoki rejalashtirish bosqichida yozma ravishda kelishilgan har qanday aniqlashtirishlarni o'z ichiga oladi."]],
          ["Doiradan tashqari", ["Ushbu TTda aniq ko'rsatilmagan har qanday funksiya, integratsiya, platforma yoki natija doiradan tashqari deb hisoblanadi va asosiy Shartnoma shartlariga muvofiq Qo'shimcha ish sifatida ko'rib chiqiladi, bu esa amalga oshirishdan oldin alohida yozma bahoni talab qiladi."]],
          ["Bosqichlar va natijalar", ["Loyiha quyidagi bosqichlar rejasiga muvofiq amalga oshiriladi. Har bir bosqich bo'yicha sanalar va to'lov foizlari tegishli bosqich boshlanishidan oldin ikkala Taraf tomonidan yozma ravishda tasdiqlanadi."]],
          ["Muddatlar", [`Taxminiy boshlanish sanasi: ${pr.startDate || "—"}. Taxminiy yakunlanish sanasi: ${pr.endDate || "—"}. Umumiy taxminiy mehnat sarfi: ${pr.estimatedHours || "—"} kishi-soat.`]],
          ["Rollar va mas'uliyat", ["Ijrochi texnik loyihalash, amalga oshirish, sinovdan o'tkazish va kelishilgan Natijalarni topshirish uchun mas'uldir. Buyurtmachi o'z vaqtida fikr-mulohaza bildirish, zarur kirish huquqi va materiallarni taqdim etish, hamda tasdiqlashlar uchun yagona aloqa shaxsini tayinlash uchun mas'uldir."]],
          ["Qabul qilish mezonlari", ["Natija ushbu TTda keltirilgan funksional tavsifga mos kelsa va asosiy Shartnomada nazarda tutilgan sinov tartib-taomillaridan muvaffaqiyatli o'tsa, yakunlangan deb hisoblanadi. Qabul qilish asosiy Shartnomaning «Qabul qilish tartibi» bandida belgilangan tartib va muddatlarga muvofiq amalga oshiriladi."]],
          ["Taxminlar va bog'liqliklar", ["Ushbu TT Buyurtmachi vakillarining fikr-mulohaza uchun o'z vaqtida mavjudligi, zarur kirish ma'lumotlari, materiallar va uchinchi tomon hisoblarining o'z vaqtida taqdim etilishi, shuningdek Loyiha amalga oshirilishi davomida me'yoriy yoki texnik muhitda jiddiy o'zgarishlar bo'lmasligini nazarda tutadi. Buyurtmachi ushbu taxminlarni bajarmasligi sabab kechikishlar muddatni tegishlicha uzaytirishi mumkin."]],
          ["O'zgarishlarni boshqarish", ["Ushbu TTda ko'rsatilgan doira, muddat yoki byudjetga har qanday o'zgartirish, asosiy Shartnomaning «Qo'shimcha ishlar va o'zgartirish so'rovlari» bandiga muvofiq, amalga oshirishdan oldin yozma o'zgartirish so'rovi sifatida rasmiylashtirilib, ikkala Tarafning vakolatli vakillari tomonidan imzolanishi lozim."]],
        ],
        milestoneHeaders: ["№", "Bosqich / natija", "Maqsadli sana"],
        signContractorTitle: "IJROCHI",
        signClientTitle: "BUYURTMACHI",
      },
    };
    return T[lang] || T.en;
  }

  function generate(state, lang, t) {
    const c = content(state, lang);
    const pr = state.project;
    const body = [];
    body.push(W.para(c.preamble, { indentFirstLine: false }));
    body.push(W.spacer(200));
    c.clauses.forEach((entry, idx) => {
      body.push(...W.clause(idx + 1, entry[0], entry[1]));
      if (idx === 5) {
        body.push(W.gridTable(c.milestoneHeaders, milestoneRows(pr)));
        body.push(W.spacer(200));
      }
    });
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
    return W.buildDocument({ state, lang, t, docTitle: c.title, docSubtitle: c.subtitle, bodyChildren: body, includeTOC: true, tocTitle: c.toc });
  }

  return { generate };
})();
