/**
 * contracts/nda.js — Non-Disclosure Agreement template (5–8 pages).
 */
const ContractNDA = (() => {
  const W = WordGen;

  function content(state, lang) {
    const co = state.company, cl = state.client, cf = state.confidentiality, pr = state.project;
    const T = {
      en: {
        title: "Non-Disclosure Agreement",
        subtitle: `No. ${state.meta.contractNumber}`,
        toc: "Table of Contents",
        preamble: `This Non-Disclosure Agreement (the "Agreement") is entered into in Tashkent, the Republic of Uzbekistan, on ${state.meta.dateDisplay}, by and between ${co.name || "[Disclosing Party]"}, represented by ${co.director || "[Director]"} (the "Disclosing Party"), and ${cl.name || "[Receiving Party]"}, represented by ${cl.director || cl.name || "[Representative]"} (the "Receiving Party"), in connection with a possible business relationship regarding "${pr.name || "the Project"}."`,
        clauses: [
          ["Purpose", ["The Parties wish to explore, discuss, or carry out a business relationship regarding the Project and, in doing so, may disclose to each other certain confidential and proprietary information that each Party desires to protect against unauthorized use or disclosure."]],
          ["Definition of Confidential Information", [
            "\"Confidential Information\" means any technical, commercial, financial, strategic, or organizational information, including but not limited to source code, business plans, client data, pricing, and know-how, disclosed by either Party, whether in written, oral, electronic, or any other form, and whether or not marked as confidential.",
            "Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was lawfully known to the Receiving Party prior to disclosure; (c) is lawfully obtained from a third party without breach of any confidentiality obligation; or (d) is independently developed without reference to the Disclosing Party's Confidential Information.",
          ]],
          ["Obligations of the Receiving Party", [
            `${cf.nondisclosure || "The Receiving Party shall hold the Confidential Information in strict confidence, use it solely for the purpose stated above, and shall not disclose it to any third party without the prior written consent of the Disclosing Party."}`,
            "The Receiving Party shall limit access to the Confidential Information to its employees, contractors, or advisors who need to know such information for the stated purpose, and who are bound by confidentiality obligations no less protective than those set out herein.",
            "The Receiving Party shall apply at least the same degree of care to protect the Confidential Information as it applies to protect its own confidential information of similar nature, and in any event no less than a reasonable degree of care.",
          ]],
          ["Data Protection", [
            `${cf.dataProtection || "Where Confidential Information includes personal data, each Party shall process such data in accordance with the Law of the Republic of Uzbekistan \"On Personal Data\" (as amended), including its data-localization requirements for biometric, genetic, and telecom-subscriber data of Uzbekistan citizens, and shall implement reasonable technical and organizational safeguards against unauthorized access, loss, or disclosure."}`,
          ]],
          ["Required Disclosure", ["Where the Receiving Party is required by law, regulation, or a competent state authority to disclose Confidential Information, it shall, to the extent legally permitted, notify the Disclosing Party promptly and cooperate in seeking a protective measure prior to disclosure."]],
          ["Term", [
            `This Agreement shall remain in effect for ${cf.ndaDuration || "three (3) years"} from the date of signing.`,
            `${cf.privacy || "The confidentiality obligations set out herein shall survive the termination or expiration of this Agreement for the duration specified above, irrespective of the termination of any underlying business relationship between the Parties."}`,
          ]],
          ["Return or Destruction of Materials", ["Upon written request of the Disclosing Party, or upon termination of the discussions between the Parties, the Receiving Party shall promptly return or destroy all materials containing Confidential Information, and confirm such return or destruction in writing, except to the extent retention is required by applicable law."]],
          ["No License", ["Nothing in this Agreement shall be construed as granting any license or right to the Receiving Party under any patent, copyright, trademark, or other intellectual property right of the Disclosing Party, other than the limited right to use the Confidential Information for the stated purpose."]],
          ["Remedies", ["The Parties acknowledge that unauthorized disclosure of Confidential Information may cause irreparable harm for which monetary damages may be an insufficient remedy, and that the Disclosing Party shall accordingly be entitled to seek injunctive or other equitable relief in addition to any other remedies available at law."]],
          ["Governing Law and Disputes", ["This Agreement shall be governed by the laws of the Republic of Uzbekistan. Any dispute arising out of or in connection with this Agreement shall first be addressed through good-faith negotiation and, failing resolution within thirty (30) calendar days, shall be referred to the competent economic court of the Republic of Uzbekistan."]],
          ["Final Provisions", ["This Agreement constitutes the entire understanding between the Parties regarding confidentiality of the subject matter described herein and may be amended only in writing signed by both Parties. This document is a professional template and does not constitute legal advice; the Parties are encouraged to have it reviewed by a licensed lawyer."]],
        ],
        signContractorTitle: "DISCLOSING PARTY",
        signClientTitle: "RECEIVING PARTY",
      },
      ru: {
        title: "Соглашение о конфиденциальности (NDA)",
        subtitle: `№ ${state.meta.contractNumber}`,
        toc: "Содержание",
        preamble: `Настоящее Соглашение о конфиденциальности (далее — «Соглашение») заключено в городе Ташкент, Республика Узбекистан, «${state.meta.dateDisplay}», между ${co.name || "[Раскрывающая сторона]"}, в лице ${co.director || "[Директор]"} («Раскрывающая сторона»), и ${cl.name || "[Получающая сторона]"}, в лице ${cl.director || cl.name || "[Представитель]"} («Получающая сторона»), в связи с возможным деловым сотрудничеством по проекту «${pr.name || "Проект"}».`,
        clauses: [
          ["Цель соглашения", ["Стороны намерены обсудить или осуществить деловое сотрудничество по Проекту и в этой связи могут раскрывать друг другу конфиденциальную и служебную информацию, которую каждая Сторона желает защитить от несанкционированного использования или раскрытия."]],
          ["Определение конфиденциальной информации", [
            "«Конфиденциальная информация» означает любую техническую, коммерческую, финансовую, стратегическую или организационную информацию, включая исходный код, бизнес-планы, данные клиентов, ценовую информацию и ноу-хау, раскрытую любой из Сторон в письменной, устной, электронной или иной форме, независимо от наличия отметки о конфиденциальности.",
            "Конфиденциальная информация не включает сведения, которые: (а) являются или становятся общедоступными не по вине Получающей стороны; (б) были правомерно известны Получающей стороне до раскрытия; (в) правомерно получены от третьего лица без нарушения обязательств о конфиденциальности; либо (г) разработаны самостоятельно без использования Конфиденциальной информации Раскрывающей стороны.",
          ]],
          ["Обязательства Получающей стороны", [
            `${cf.nondisclosure || "Получающая сторона обязуется сохранять строгую конфиденциальность полученной информации, использовать её исключительно в указанных целях и не раскрывать третьим лицам без предварительного письменного согласия Раскрывающей стороны."}`,
            "Получающая сторона обязуется ограничить доступ к Конфиденциальной информации сотрудниками, подрядчиками или консультантами, которым такой доступ необходим для указанных целей и которые связаны обязательствами о конфиденциальности не менее строгими, чем предусмотренные настоящим Соглашением.",
            "Получающая сторона обязуется применять как минимум ту же степень заботливости при защите Конфиденциальной информации, что и в отношении собственной конфиденциальной информации аналогичного характера, но в любом случае не ниже разумной степени.",
          ]],
          ["Защита персональных данных", [
            `${cf.dataProtection || "В случае, если Конфиденциальная информация включает персональные данные, каждая Сторона обрабатывает такие данные в соответствии с Законом Республики Узбекистан «О персональных данных» (с изменениями), включая требования о локализации биометрических, генетических данных и данных абонентов телекоммуникационных операторов граждан Узбекистана, и принимает разумные технические и организационные меры по защите от несанкционированного доступа, утраты или раскрытия."}`,
          ]],
          ["Обязательное раскрытие", ["В случае если Получающая сторона обязана раскрыть Конфиденциальную информацию в силу закона, нормативного акта либо требования компетентного государственного органа, она обязана, в допустимых законом пределах, незамедлительно уведомить Раскрывающую сторону и содействовать в принятии защитных мер до раскрытия."]],
          ["Срок действия", [
            `Настоящее Соглашение действует в течение ${cf.ndaDuration || "трёх (3) лет"} с даты подписания.`,
            `${cf.privacy || "Обязательства по конфиденциальности, предусмотренные настоящим Соглашением, сохраняют силу в течение указанного срока независимо от прекращения деловых отношений между Сторонами."}`,
          ]],
          ["Возврат или уничтожение материалов", ["По письменному требованию Раскрывающей стороны либо по завершении переговоров между Сторонами, Получающая сторона обязана незамедлительно возвратить либо уничтожить все материалы, содержащие Конфиденциальную информацию, и подтвердить это в письменной форме, за исключением случаев, когда хранение требуется применимым законодательством."]],
          ["Отсутствие лицензии", ["Ничто в настоящем Соглашении не может рассматриваться как предоставление Получающей стороне какой-либо лицензии или права в отношении патентов, авторских прав, товарных знаков либо иной интеллектуальной собственности Раскрывающей стороны, за исключением ограниченного права использования Конфиденциальной информации в указанных целях."]],
          ["Средства правовой защиты", ["Стороны признают, что несанкционированное раскрытие Конфиденциальной информации может причинить непоправимый вред, для устранения которого денежная компенсация может оказаться недостаточной, в связи с чем Раскрывающая сторона вправе требовать применения обеспечительных либо иных мер судебной защиты в дополнение к иным средствам правовой защиты."]],
          ["Применимое право и споры", ["Настоящее Соглашение регулируется законодательством Республики Узбекистан. Любой спор, возникающий из настоящего Соглашения либо в связи с ним, подлежит урегулированию путём переговоров, а при недостижении согласия в течение тридцати (30) календарных дней — передаётся в компетентный экономический суд Республики Узбекистан."]],
          ["Заключительные положения", ["Настоящее Соглашение составляет полное понимание Сторон в отношении конфиденциальности описанного предмета и может быть изменено только в письменной форме за подписью обеих Сторон. Настоящий документ является профессиональным шаблоном и не является юридической консультацией; Сторонам рекомендуется передать его на проверку лицензированному юристу."]],
        ],
        signContractorTitle: "РАСКРЫВАЮЩАЯ СТОРОНА",
        signClientTitle: "ПОЛУЧАЮЩАЯ СТОРОНА",
      },
      uz: {
        title: "Maxfiylik shartnomasi (NDA)",
        subtitle: `№ ${state.meta.contractNumber}`,
        toc: "Mundarija",
        preamble: `Ushbu Maxfiylik shartnomasi (keyingi o'rinlarda — «Shartnoma») Toshkent shahrida, O'zbekiston Respublikasida, ${state.meta.dateDisplay} kuni, bir tomondan ${co.name || "[Oshkor qiluvchi tomon]"} nomidan ${co.director || "[Direktor]"} («Oshkor qiluvchi tomon»), ikkinchi tomondan ${cl.name || "[Qabul qiluvchi tomon]"} nomidan ${cl.director || cl.name || "[Vakil]"} («Qabul qiluvchi tomon») o'rtasida «${pr.name || "Loyiha"}» bo'yicha mumkin bo'lgan hamkorlik munosabatlari yuzasidan tuzildi.`,
        clauses: [
          ["Shartnomaning maqsadi", ["Taraflar Loyiha bo'yicha hamkorlik munosabatlarini muhokama qilish yoki amalga oshirishni istaydilar va shu munosabat bilan bir-birlariga ruxsatsiz foydalanish yoki oshkor etilishidan himoyalashni istagan maxfiy va tijorat ma'lumotlarini oshkor qilishlari mumkin."]],
          ["Maxfiy ma'lumot ta'rifi", [
            "«Maxfiy ma'lumot» — har qanday Taraf tomonidan yozma, og'zaki, elektron yoki boshqa shaklda, maxfiy deb belgilangan yoki belgilanmaganidan qat'i nazar oshkor qilingan texnik, tijorat, moliyaviy, strategik yoki tashkiliy ma'lumotni, jumladan manba kodi, biznes-rejalar, mijozlar ma'lumotlari, narxlar va nou-xauni anglatadi.",
            "Maxfiy ma'lumot quyidagilarni o'z ichiga olmaydi: (a) Qabul qiluvchi tomonning aybisiz ommaga oshkor bo'lgan yoki bo'ladigan; (b) oshkor qilishdan oldin Qabul qiluvchi tomonga qonuniy ma'lum bo'lgan; (v) maxfiylik majburiyatini buzmasdan uchinchi shaxsdan qonuniy olingan; yoki (g) Oshkor qiluvchi tomonning Maxfiy ma'lumotidan foydalanmasdan mustaqil ishlab chiqilgan ma'lumot.",
          ]],
          ["Qabul qiluvchi tomonning majburiyatlari", [
            `${cf.nondisclosure || "Qabul qiluvchi tomon Maxfiy ma'lumotni qat'iy maxfiy saqlashni, uni faqat yuqorida ko'rsatilgan maqsadda ishlatishni va Oshkor qiluvchi tomonning oldindan yozma roziligisiz uchinchi shaxslarga oshkor etmaslikni o'z zimmasiga oladi."}`,
            "Qabul qiluvchi tomon Maxfiy ma'lumotga kirishni faqat ko'rsatilgan maqsad uchun zarur bo'lgan va ushbu Shartnomada belgilangandan kam bo'lmagan maxfiylik majburiyatlari bilan bog'langan xodimlar, pudratchilar yoki maslahatchilar bilan cheklaydi.",
            "Qabul qiluvchi tomon Maxfiy ma'lumotni himoya qilishda kamida o'zining shunga o'xshash maxfiy ma'lumotini himoya qilishda qo'llagan darajadagi, har holda oqilona darajadan kam bo'lmagan ehtiyotkorlikni qo'llaydi.",
          ]],
          ["Ma'lumotlarni himoya qilish", [
            `${cf.dataProtection || "Agar Maxfiy ma'lumot shaxsga doir ma'lumotlarni o'z ichiga olsa, har bir Taraf bunday ma'lumotlarni «Shaxsga doir ma'lumotlar to'g'risida»gi Qonunga (o'zgartirishlar bilan) muvofiq, jumladan O'zbekiston fuqarolarining biometrik, genetik va telekommunikatsiya abonentlik ma'lumotlariga nisbatan lokalizatsiya talablarini hisobga olgan holda qayta ishlaydi va ruxsatsiz kirish, yo'qotish yoki oshkor etilishidan himoya qilish uchun oqilona texnik va tashkiliy choralarni ko'radi."}`,
          ]],
          ["Majburiy oshkor qilish", ["Qabul qiluvchi tomon qonun, me'yoriy hujjat yoki vakolatli davlat organi talabi bilan Maxfiy ma'lumotni oshkor qilishga majbur bo'lgan taqdirda, qonun yo'l qo'ygan darajada, Oshkor qiluvchi tomonni zudlik bilan xabardor qilishi va oshkor etishdan oldin himoya choralarini ko'rishda hamkorlik qilishi lozim."]],
          ["Amal qilish muddati", [
            `Ushbu Shartnoma imzolangan kundan boshlab ${cf.ndaDuration || "uch (3) yil"} davomida amal qiladi.`,
            `${cf.privacy || "Ushbu Shartnomada belgilangan maxfiylik majburiyatlari Taraflar o'rtasidagi hamkorlik munosabatlari tugatilishidan qat'i nazar, yuqorida ko'rsatilgan muddat davomida saqlanib qoladi."}`,
          ]],
          ["Materiallarni qaytarish yoki yo'q qilish", ["Oshkor qiluvchi tomonning yozma so'rovi bo'yicha yoki Taraflar o'rtasidagi muzokaralar yakunlangach, Qabul qiluvchi tomon Maxfiy ma'lumotni o'z ichiga olgan barcha materiallarni zudlik bilan qaytarishi yoki yo'q qilishi hamda buni yozma ravishda tasdiqlashi lozim, bundan amaldagi qonunchilik talab qiladigan saqlash holatlari mustasno."]],
          ["Litsenziya berilmasligi", ["Ushbu Shartnomadagi hech narsa Qabul qiluvchi tomonga Oshkor qiluvchi tomonning patenti, mualliflik huquqi, tovar belgisi yoki boshqa intellektual mulkiga nisbatan, Maxfiy ma'lumotdan ko'rsatilgan maqsadda foydalanishning cheklangan huquqidan tashqari, biror litsenziya yoki huquq berish sifatida talqin etilmaydi."]],
          ["Himoya choralari", ["Taraflar Maxfiy ma'lumotning ruxsatsiz oshkor etilishi pul kompensatsiyasi yetarli bo'lmagan tuzatib bo'lmas zarar keltirishi mumkinligini tan oladilar, shu sababli Oshkor qiluvchi tomon boshqa huquqiy himoya vositalaridan tashqari sud tomonidan taqiqlash yoki boshqa adolatli choralar qo'llanilishini talab qilish huquqiga ega."]],
          ["Amal qiluvchi qonunchilik va nizolar", ["Ushbu Shartnoma O'zbekiston Respublikasi qonunchiligiga muvofiq tartibga solinadi. Ushbu Shartnomadan kelib chiqadigan yoki u bilan bog'liq har qanday nizo avvalo muzokaralar orqali hal qilinadi, o'ttiz (30) kalendar kuni ichida kelishuvga erishilmasa — O'zbekiston Respublikasining vakolatli iqtisodiy sudiga topshiriladi."]],
          ["Yakuniy qoidalar", ["Ushbu Shartnoma tavsiflangan predmetning maxfiyligi bo'yicha Taraflar o'rtasidagi to'liq kelishuvni tashkil etadi va faqat ikkala Tarafning yozma imzosi bilan o'zgartirilishi mumkin. Ushbu hujjat professional shablon bo'lib, yuridik maslahat emas; Taraflarga uni litsenziyalangan yurist tomonidan tekshirtirish tavsiya etiladi."]],
        ],
        signContractorTitle: "OSHKOR QILUVCHI TOMON",
        signClientTitle: "QABUL QILUVCHI TOMON",
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
    return W.buildDocument({ state, lang, t, docTitle: c.title, docSubtitle: c.subtitle, bodyChildren: body, includeTOC: false, tocTitle: c.toc, docSlug: "nda" });
  }

  return { generate, content };
})();
