/**
 * contracts/maintenance.js — Maintenance & Support Agreement template (~10 pages).
 */
const ContractMaintenance = (() => {
  const W = WordGen;

  function money(state, amount) {
    if (!amount) return "—";
    const n = Number(amount);
    if (Number.isNaN(n)) return amount;
    return `${n.toLocaleString("en-US")} ${state.payment.currency || "UZS"}`;
  }

  function content(state, lang) {
    const co = state.company, cl = state.client, pr = state.project, mt = state.maintenance || {}, ac = state.acceptance;
    const T = {
      en: {
        title: "Maintenance and Support Agreement",
        subtitle: `No. ${state.meta.contractNumber}-M`,
        toc: "Table of Contents",
        preamble: `This Maintenance and Support Agreement (the "Agreement") is entered into in Tashkent, the Republic of Uzbekistan, on ${state.meta.dateDisplay}, by and between ${co.name || "[Contractor]"} ("the Contractor") and ${cl.name || "[Client]"} ("the Client"), for the ongoing maintenance and technical support of the system "${pr.name || "[Project Name]"}" previously delivered under Agreement No. ${state.meta.contractNumber}.`,
        clauses: [
          ["General Provisions", ["This Agreement governs the post-warranty maintenance and support services to be provided by the Contractor for the software system referenced above, and supplements, without replacing, the intellectual property and confidentiality terms of the underlying Agreement, which remain in full force."]],
          ["Scope of Maintenance Services", [
            "Monitoring of system availability and performance within the agreed service hours.",
            "Diagnosis and resolution of defects reported by the Client that are attributable to the Contractor's original development work.",
            "Application of security patches and minor updates to keep the system compatible with its operating environment.",
            "Advisory support regarding the operation, configuration, and minor enhancement of the system.",
          ]],
          ["Exclusions", ["Maintenance under this Agreement does not include major new feature development, integrations not part of the original Project, recovery from Client-side misuse or unauthorized modification, or issues arising from third-party services outside the Contractor's control; such work shall be quoted and agreed separately as Additional Work."]],
          ["Service Level", [
            { label: "Service tier", text: `${mt.tier || "Standard"}.` },
            { label: "Response time", text: `${mt.responseTime || "within 4 business hours"} of a support request being logged.` },
            { label: "Resolution time", text: `${mt.resolutionTime || "within 2 business days"} for standard issues, subject to the bug severity classification below.` },
          ]],
          ["Bug Severity and Resolution Windows", [
            { label: "Critical", text: `${ac.bugCritical || "1"} business day(s) — system unusable or data at risk.` },
            { label: "Major", text: `${ac.bugMajor || "3"} business day(s) — core functionality materially impaired.` },
            { label: "Minor", text: `${ac.bugMinor || "7"} business day(s) — limited functional impact.` },
            { label: "Enhancement", text: `${ac.bugEnhancement || "10"} business day(s) to evaluate; implementation quoted separately if approved.` },
          ]],
          ["Support Channels", ["Support requests shall be submitted via the communication channel(s) agreed between the Parties (e.g., email, ticketing system, or messaging application) and shall be logged with a timestamp for the purpose of measuring response and resolution times."]],
          ["Fees", [`The Client shall pay a recurring fee of ${money(state, mt.monthlyFee)} for the service tier described above, payable in advance on a monthly basis unless otherwise agreed in writing.`, "Work falling outside the scope of this Agreement shall be quoted separately and is payable in addition to the recurring fee."]],
          ["Term and Renewal", [`This Agreement is effective for an initial term of ${pr.support || "twelve (12) months"} from the date of signing and shall automatically renew for successive equal terms unless either Party provides written notice of non-renewal at least thirty (30) calendar days before the end of the then-current term.`]],
          ["Termination", ["Either Party may terminate this Agreement for cause upon material breach not remedied within fifteen (15) calendar days of written notice, or for convenience upon sixty (60) calendar days' written notice, without prejudice to fees accrued prior to the effective date of termination."]],
          ["Confidentiality and Data Protection", ["The confidentiality and personal data protection obligations set out in the underlying Agreement shall apply equally to this Agreement and shall survive its termination for the period specified therein."]],
          ["Liability", ["The Contractor's aggregate liability under this Agreement in any twelve-month period shall not exceed the total fees paid by the Client under this Agreement during that period, except in cases of willful misconduct or gross negligence."]],
          ["Governing Law and Disputes", ["This Agreement is governed by the laws of the Republic of Uzbekistan. Disputes shall first be addressed through good-faith negotiation and, failing resolution within thirty (30) calendar days, referred to the competent economic court of the Republic of Uzbekistan."]],
          ["Final Provisions", ["This Agreement, together with the underlying IT Service Agreement, constitutes the complete understanding between the Parties regarding maintenance and support of the system. This document is a professional template and does not constitute legal advice; the Parties are encouraged to have it reviewed by a licensed lawyer."]],
        ],
        signContractorTitle: "CONTRACTOR",
        signClientTitle: "CLIENT",
      },
      ru: {
        title: "Договор технического обслуживания и поддержки",
        subtitle: `№ ${state.meta.contractNumber}-M`,
        toc: "Содержание",
        preamble: `Настоящий Договор технического обслуживания и поддержки (далее — «Договор») заключён в городе Ташкент, Республика Узбекистан, «${state.meta.dateDisplay}», между ${co.name || "[Исполнитель]"} («Исполнитель») и ${cl.name || "[Заказчик]"} («Заказчик») в отношении текущего технического обслуживания и поддержки системы «${pr.name || "[Название проекта]"}», ранее переданной по Договору № ${state.meta.contractNumber}.`,
        clauses: [
          ["Общие положения", ["Настоящий Договор регулирует услуги послегарантийного технического обслуживания и поддержки, оказываемые Исполнителем в отношении указанной выше программной системы, и дополняет, не заменяя, условия об интеллектуальной собственности и конфиденциальности основного Договора, которые сохраняют полную силу."]],
          ["Объём услуг по обслуживанию", [
            "Мониторинг доступности и производительности системы в согласованные часы обслуживания.",
            "Диагностика и устранение дефектов, заявленных Заказчиком, возникших по вине первоначальной разработки Исполнителя.",
            "Установка обновлений безопасности и незначительных обновлений для поддержания совместимости системы с операционной средой.",
            "Консультационная поддержка по эксплуатации, настройке и незначительным улучшениям системы.",
          ]],
          ["Исключения", ["Обслуживание по настоящему Договору не включает разработку крупных новых функций, интеграции, не входившие в первоначальный проект, устранение последствий неправомерного использования или несанкционированных изменений со стороны Заказчика, а также проблемы, возникшие по вине сторонних сервисов вне контроля Исполнителя; такие работы оцениваются и согласовываются отдельно как Дополнительные работы."]],
          ["Уровень обслуживания (SLA)", [
            { label: "Уровень обслуживания", text: `${mt.tier || "Стандартный"}.` },
            { label: "Время реакции", text: `${mt.responseTime || "в течение 4 рабочих часов"} с момента регистрации обращения.` },
            { label: "Время устранения", text: `${mt.resolutionTime || "в течение 2 рабочих дней"} для стандартных обращений, с учётом классификации по критичности ниже.` },
          ]],
          ["Критичность ошибок и сроки устранения", [
            { label: "Критическая", text: `${ac.bugCritical || "1"} рабочий(-их) день(-ей) — система неработоспособна либо данные под угрозой.` },
            { label: "Серьёзная", text: `${ac.bugMajor || "3"} рабочих дня — существенно нарушен основной функционал.` },
            { label: "Незначительная", text: `${ac.bugMinor || "7"} рабочих дней — ограниченное влияние на функциональность.` },
            { label: "Улучшение", text: `${ac.bugEnhancement || "10"} рабочих дней на оценку; реализация оценивается отдельно в случае одобрения.` },
          ]],
          ["Каналы поддержки", ["Обращения в службу поддержки направляются по каналу связи, согласованному Сторонами (например, электронная почта, система заявок либо мессенджер), и регистрируются с указанием времени для целей измерения сроков реакции и устранения."]],
          ["Стоимость услуг", [`Заказчик уплачивает периодическое вознаграждение в размере ${money(state, mt.monthlyFee)} за указанный уровень обслуживания, вносимое авансом ежемесячно, если Сторонами не согласовано иное в письменной форме.`, "Работы, выходящие за пределы настоящего Договора, оцениваются отдельно и оплачиваются дополнительно к периодическому вознаграждению."]],
          ["Срок действия и продление", [`Настоящий Договор действует в течение первоначального срока ${pr.support || "двенадцати (12) месяцев"} с даты подписания и автоматически продлевается на очередные равные периоды, если ни одна из Сторон не направит письменное уведомление об отказе от продления не позднее чем за тридцать (30) календарных дней до окончания текущего срока.`]],
          ["Расторжение", ["Любая из Сторон вправе расторгнуть настоящий Договор при существенном нарушении, не устранённом в течение пятнадцати (15) календарных дней с момента письменного уведомления, либо в одностороннем порядке с уведомлением за шестьдесят (60) календарных дней, без ущерба для вознаграждения, начисленного до даты расторжения."]],
          ["Конфиденциальность и защита данных", ["Обязательства о конфиденциальности и защите персональных данных, предусмотренные основным Договором, в равной мере применяются к настоящему Договору и сохраняют силу после его прекращения в течение установленного в нём срока."]],
          ["Ответственность", ["Совокупная ответственность Исполнителя по настоящему Договору за любой двенадцатимесячный период не превышает общей суммы вознаграждения, уплаченного Заказчиком по настоящему Договору за такой период, за исключением случаев умысла или грубой неосторожности."]],
          ["Применимое право и споры", ["Настоящий Договор регулируется законодательством Республики Узбекистан. Споры подлежат урегулированию путём переговоров, а при недостижении согласия в течение тридцати (30) календарных дней — передаются в компетентный экономический суд Республики Узбекистан."]],
          ["Заключительные положения", ["Настоящий Договор вместе с основным Договором оказания IT-услуг составляет полное понимание Сторон в отношении технического обслуживания и поддержки системы. Настоящий документ является профессиональным шаблоном и не является юридической консультацией; Сторонам рекомендуется передать его на проверку лицензированному юристу."]],
        ],
        signContractorTitle: "ИСПОЛНИТЕЛЬ",
        signClientTitle: "ЗАКАЗЧИК",
      },
      uz: {
        title: "Texnik xizmat ko'rsatish va qo'llab-quvvatlash shartnomasi",
        subtitle: `№ ${state.meta.contractNumber}-M`,
        toc: "Mundarija",
        preamble: `Ushbu Texnik xizmat ko'rsatish va qo'llab-quvvatlash shartnomasi (keyingi o'rinlarda — «Shartnoma») Toshkent shahrida, O'zbekiston Respublikasida, ${state.meta.dateDisplay} kuni, ${co.name || "[Ijrochi]"} («Ijrochi») va ${cl.name || "[Buyurtmachi]"} («Buyurtmachi») o'rtasida, ilgari № ${state.meta.contractNumber} Shartnoma bo'yicha topshirilgan «${pr.name || "[Loyiha nomi]"}» tizimiga doimiy texnik xizmat ko'rsatish va qo'llab-quvvatlash yuzasidan tuzildi.`,
        clauses: [
          ["Umumiy qoidalar", ["Ushbu Shartnoma yuqorida ko'rsatilgan dasturiy tizim uchun Ijrochi tomonidan ko'rsatiladigan kafolatdan keyingi texnik xizmat ko'rsatish va qo'llab-quvvatlash xizmatlarini tartibga soladi hamda to'liq kuchda qolayotgan asosiy Shartnomaning intellektual mulk va maxfiylik shartlarini bekor qilmasdan to'ldiradi."]],
          ["Texnik xizmat ko'rsatish doirasi", [
            "Kelishilgan xizmat ko'rsatish soatlarida tizim mavjudligi va unumdorligini kuzatish.",
            "Buyurtmachi tomonidan xabar qilingan, Ijrochining dastlabki ishlab chiqishi natijasida yuzaga kelgan nuqsonlarni aniqlash va bartaraf etish.",
            "Tizimning ishlash muhitiga moslashuvini saqlash uchun xavfsizlik yamoqlari va kichik yangilanishlarni qo'llash.",
            "Tizimni ishlatish, sozlash va kichik yaxshilashlar bo'yicha maslahat xizmatlari.",
          ]],
          ["Istisnolar", ["Ushbu Shartnoma bo'yicha texnik xizmat yirik yangi funksiyalarni ishlab chiqish, asl loyiha tarkibiga kirmagan integratsiyalar, Buyurtmachi tomonidan noto'g'ri foydalanish yoki ruxsatsiz o'zgartirish oqibatlarini bartaraf etish, yoxud Ijrochi nazorati doirasidan tashqaridagi uchinchi tomon xizmatlari bilan bog'liq muammolarni o'z ichiga olmaydi; bunday ishlar alohida Qo'shimcha ish sifatida baholanadi va kelishiladi."]],
          ["Xizmat darajasi (SLA)", [
            { label: "Xizmat darajasi", text: `${mt.tier || "Standart"}.` },
            { label: "Javob berish vaqti", text: `so'rov qayd etilgandan so'ng ${mt.responseTime || "4 ish soati ichida"}.` },
            { label: "Hal qilish vaqti", text: `quyidagi xatolik darajasi tasnifiga muvofiq, standart murojaatlar uchun ${mt.resolutionTime || "2 ish kuni ichida"}.` },
          ]],
          ["Xatolik darajasi va bartaraf etish muddatlari", [
            { label: "Kritik", text: `${ac.bugCritical || "1"} ish kuni — tizim ishlamaydi yoki ma'lumotlar xavf ostida.` },
            { label: "Jiddiy", text: `${ac.bugMajor || "3"} ish kuni — asosiy funksionallik sezilarli darajada buzilgan.` },
            { label: "Kichik", text: `${ac.bugMinor || "7"} ish kuni — funksionallikka cheklangan ta'sir.` },
            { label: "Yaxshilash", text: `baholash uchun ${ac.bugEnhancement || "10"} ish kuni; tasdiqlangan taqdirda amalga oshirish alohida baholanadi.` },
          ]],
          ["Qo'llab-quvvatlash kanallari", ["Qo'llab-quvvatlash so'rovlari Taraflar kelishgan aloqa kanali (masalan, elektron pochta, murojaatlarni qayd etish tizimi yoki messenjer) orqali yuborilishi va javob berish hamda hal qilish muddatlarini o'lchash maqsadida vaqt belgisi bilan qayd etilishi lozim."]],
          ["To'lovlar", [`Buyurtmachi yuqorida tavsiflangan xizmat darajasi uchun ${money(state, mt.monthlyFee)} miqdorida davriy to'lovni, Taraflar yozma ravishda boshqacha kelishmagan bo'lsa, har oy avans tarzida to'laydi.`, "Ushbu Shartnoma doirasidan tashqaridagi ishlar alohida baholanadi va davriy to'lovga qo'shimcha ravishda to'lanadi."]],
          ["Amal qilish muddati va uzaytirish", [`Ushbu Shartnoma imzolangan kundan boshlab dastlabki ${pr.support || "o'n ikki (12) oy"} muddatga amal qiladi va har qanday Taraf amaldagi muddat tugashidan kamida o'ttiz (30) kalendar kuni oldin uzaytirishdan bosh tortish to'g'risida yozma bildirishnoma yubormasa, avtomatik ravishda navbatdagi teng muddatlarga uzaytiriladi.`]],
          ["Bekor qilish", ["Har qanday Taraf yozma bildirishnoma olingan kundan boshlab o'n besh (15) kalendar kuni ichida bartaraf etilmagan jiddiy buzilish sababli, yoki oltmish (60) kalendar kuni oldin yozma bildirishnoma yuborish orqali bir tomonlama, ushbu Shartnomani bekor qilishi mumkin; bu bekor qilish sanasigacha to'plangan to'lovlarga putur yetkazmaydi."]],
          ["Maxfiylik va ma'lumotlarni himoya qilish", ["Asosiy Shartnomada nazarda tutilgan maxfiylik va shaxsga doir ma'lumotlarni himoya qilish majburiyatlari ushbu Shartnomaga ham teng darajada qo'llaniladi va unda belgilangan muddat davomida Shartnoma bekor qilingandan keyin ham saqlanib qoladi."]],
          ["Javobgarlik", ["Ijrochining ushbu Shartnoma bo'yicha har qanday o'n ikki oylik davr uchun umumiy javobgarligi, qasddan qilingan harakat yoki qo'pol beparvolik holatlari bundan mustasno, Buyurtmachi tomonidan shu davr uchun to'langan umumiy to'lov summasidan oshmaydi."]],
          ["Amal qiluvchi qonunchilik va nizolar", ["Ushbu Shartnoma O'zbekiston Respublikasi qonunchiligiga muvofiq tartibga solinadi. Nizolar avvalo muzokaralar orqali hal qilinadi, o'ttiz (30) kalendar kuni ichida kelishuvga erishilmasa — O'zbekiston Respublikasining vakolatli iqtisodiy sudiga topshiriladi."]],
          ["Yakuniy qoidalar", ["Ushbu Shartnoma asosiy IT xizmatlarni ko'rsatish shartnomasi bilan birgalikda tizimga texnik xizmat ko'rsatish va qo'llab-quvvatlash bo'yicha Taraflar o'rtasidagi to'liq kelishuvni tashkil etadi. Ushbu hujjat professional shablon bo'lib, yuridik maslahat emas; Taraflarga uni litsenziyalangan yurist tomonidan tekshirtirish tavsiya etiladi."]],
        ],
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
    return W.buildDocument({ state, lang, t, docTitle: c.title, docSubtitle: c.subtitle, bodyChildren: body, includeTOC: true, tocTitle: c.toc, docSlug: "maintenance" });
  }

  return { generate, content };
})();
