/**
 * contracts/it-service-agreement.js
 * Generates the primary IT Service Agreement — the most comprehensive of the
 * six templates. Legal text is authored natively in each language (not
 * machine translated) so that phrasing reads naturally to a reviewing lawyer.
 */
const ContractITService = (() => {
  const W = WordGen;

  function money(state, amount) {
    if (!amount) return "—";
    const n = Number(amount);
    if (Number.isNaN(n)) return amount;
    return `${n.toLocaleString("en-US")} ${state.payment.currency || "UZS"}`;
  }

  function content(state, lang) {
    const co = state.company, cl = state.client, pr = state.project, pay = state.payment, ip = state.ip, cf = state.confidentiality, ac = state.acceptance;
    const partyContractor = { en: "the Contractor", ru: "Исполнитель", uz: "Ijrochi" }[lang];
    const partyClient = { en: "the Client", ru: "Заказчик", uz: "Buyurtmachi" }[lang];

    const T = {
      en: {
        title: "IT Service Agreement",
        subtitle: `No. ${state.meta.contractNumber}`,
        toc: "Table of Contents",
        preamble: `This IT Service Agreement (the "Agreement") is entered into in Tashkent, the Republic of Uzbekistan, on ${state.meta.dateDisplay}, by and between ${co.name || "[Contractor name]"}, represented by ${co.director || "[Director]"} acting as ${co.position || "Director"} (hereinafter referred to as "${partyContractor}"), on the one part, and ${cl.name || "[Client name]"}, represented by ${cl.director || cl.name || "[Representative]"} (hereinafter referred to as "${partyClient}"), on the other part, jointly referred to as the "Parties," and individually as a "Party," regarding the software development and related IT services described herein.`,
        clauses: [
          ["General Provisions", [
            "This Agreement establishes the legal, technical, financial, and organizational framework under which the Contractor shall render information technology services to the Client, including without limitation software design, development, implementation, testing, and delivery.",
            "The Parties confirm that they possess full legal capacity to enter into this Agreement and that no restrictions under applicable law prevent them from assuming the obligations set out herein.",
            "This Agreement shall be governed by the Civil Code of the Republic of Uzbekistan, the Tax Code of the Republic of Uzbekistan, the Law of the Republic of Uzbekistan \"On Informatization,\" the Law \"On Copyright and Related Rights,\" the Law \"On Personal Data,\" and other applicable legislation of the Republic of Uzbekistan.",
          ]],
          ["Definitions", [
            "\"Services\" means the software development, consulting, integration, testing, deployment, and other IT-related services described in the Statement of Work (SOW) attached hereto as Annex 1.",
            "\"Deliverables\" means all software, source code, documentation, designs, and other work product created by the Contractor for the Client under this Agreement.",
            "\"Milestone\" means a defined stage of the Project the completion of which triggers acceptance procedures and/or payment obligations as specified in Annex 1.",
            "\"Confidential Information\" has the meaning given to it in Clause 13 (Confidentiality) of this Agreement.",
          ]],
          ["Scope of Services", [
            `The Contractor shall perform the Services necessary to design, develop, and deliver the project titled "${pr.name || "[Project Name]"}" (the "Project"), of the type: ${pr.type || "[Project Type]"}.`,
            `Project description: ${pr.description || "To be detailed in Annex 1 (Statement of Work)."}`,
            `Technologies to be used include, but are not limited to: ${pr.technologies || "as specified in Annex 1"}.`,
            "Any services not expressly described in Annex 1 shall be considered Additional Work under Clause 11 and shall require a separate written agreement as to scope, timeline, and price.",
          ]],
          ["Technical Specifications", [
            "The technical specification of the Project, including architecture, functional and non-functional requirements, integrations, and acceptance criteria, is set out in Annex 1 (Statement of Work), which forms an integral part of this Agreement.",
            "Any change to the technical specification shall be documented in a written change request signed by both Parties in accordance with Clause 12 (Change Requests).",
          ]],
          ["Responsibilities of the Contractor", [
            "Perform the Services with reasonable professional skill, care, and diligence consistent with generally accepted industry standards.",
            "Deliver the Deliverables in accordance with the timeline set out in Clause 8 (Timeline) and Annex 1.",
            "Promptly notify the Client of any circumstance that may affect the timeline, budget, or quality of the Project.",
            "Maintain the confidentiality of the Client's information in accordance with Clause 13.",
            "Provide progress reports at intervals agreed with the Client.",
          ]],
          ["Responsibilities of the Client", [
            "Provide timely access to information, materials, credentials, environments, and personnel reasonably required for the Contractor to perform the Services.",
            "Review and approve or reject Deliverables within the Acceptance Period specified in Clause 15.",
            "Make payments in accordance with the schedule set out in Clause 9 (Payment Terms).",
            "Designate an authorized representative empowered to make decisions regarding the Project on the Client's behalf.",
          ]],
          ["Project Management", [
            "Each Party shall appoint a project coordinator responsible for day-to-day communication and decision-making within the scope of this Agreement.",
            "Project status meetings shall be held at a frequency agreed by the Parties, and minutes of material decisions shall be kept in writing (including by email or messaging applications) and shall be binding once confirmed by both coordinators.",
          ]],
          ["Milestones and Timeline", [
            `The Project shall commence on ${pr.startDate || "[Start Date]"} and is targeted for completion on ${pr.endDate || "[End Date]"}, subject to any adjustments agreed under Clause 12.`,
            pr.milestones ? { label: "Milestones", text: pr.milestones.split("\n").filter(Boolean).join("; ") } : "Milestones are detailed in Annex 1 (Statement of Work).",
            `Estimated effort for the Project is ${pr.estimatedHours || "[Estimated Hours]"} person-hours; this figure is indicative and does not itself constitute a fixed-price commitment unless expressly stated in Annex 1.`,
          ]],
          ["Payment Terms", [
            `The total price of this Agreement is ${money(state, pay.price)}${pay.vatIncluded ? " (VAT included)" : " (VAT not included, to be added in accordance with applicable tax legislation)"}.`,
            `An advance payment of ${money(state, pay.advance)} shall be paid by the Client within five (5) business days of signing this Agreement.`,
            `The remaining balance of ${money(state, pay.remaining)} shall be paid in accordance with the milestone schedule set out in Annex 1, or otherwise upon final acceptance of the Deliverables.`,
            `Payment shall be made by ${pay.method || "bank transfer"} to the Contractor's settlement account specified in the signature block of this Agreement.`,
            "All amounts are exclusive of bank transfer fees, which shall be borne by the paying Party unless otherwise agreed.",
            "Where payment is made in a foreign currency or across borders, the Parties shall comply with the currency and banking legislation of the Republic of Uzbekistan applicable at the time of payment, including any requirements relating to settlement through licensed banks.",
          ]],
          ["Taxes", [
            "Each Party shall be responsible for its own tax obligations arising from this Agreement in accordance with the Tax Code of the Republic of Uzbekistan and other applicable legislation.",
            "Where the Contractor is required by law to withhold or account for any tax in connection with payments under this Agreement, it shall do so and shall provide the Client with confirming documentation upon request.",
          ]],
          ["Additional Work and Change Requests", [
            "Any work requested by the Client that falls outside the scope defined in Annex 1 shall be treated as Additional Work and shall be subject to a separate estimate of price and timeline.",
            "No Additional Work shall be deemed authorized, and no corresponding fee shall become payable, unless confirmed in writing (including by email) by an authorized representative of the Client.",
            "A change request affecting scope, price, or timeline shall be documented and signed by both Parties before implementation begins.",
          ]],
          ["Confidentiality", [
            `"Confidential Information" means any non-public technical, commercial, financial, or organizational information disclosed by either Party in connection with this Agreement, whether disclosed orally, in writing, or in electronic form.`,
            `${cf.nondisclosure || "Each Party undertakes not to disclose the other Party's Confidential Information to any third party without prior written consent, except to the extent required by applicable law or a competent state authority."}`,
            `This confidentiality obligation shall remain in effect for ${cf.ndaDuration || "three (3) years"} following the termination or expiration of this Agreement.`,
            `${cf.dataProtection ? cf.dataProtection : "Each Party shall process personal data disclosed under this Agreement in accordance with the Law of the Republic of Uzbekistan \"On Personal Data\" and shall implement reasonable technical and organizational measures to protect such data."}`,
            "Where the Contractor processes personal data of citizens of the Republic of Uzbekistan in performing the Services, it shall collect, systematize, and store such data on technical means registered in the State Register of Personal Data Bases, and shall not transfer such data outside the Republic of Uzbekistan except in accordance with the localization and cross-border transfer rules established by the Law \"On Personal Data\" (as amended) and any list of countries recognized as providing an adequate level of protection.",
          ]],
          ["Intellectual Property Rights", [
            `${ip.sourceCodeOwnership || "Upon full payment of the amounts due under this Agreement, all exclusive property rights to the source code developed specifically for the Project shall be transferred to the Client."}`,
            `${ip.repositoryOwnership || "Access to and ownership of the project's source code repository shall be transferred to the Client upon final acceptance and full payment."}`,
            `${ip.copyright || "Authorship rights (moral rights) of individual developers shall remain with such developers in accordance with the Law of the Republic of Uzbekistan \"On Copyright and Related Rights\"; economic (exclusive) rights necessary for commercial exploitation are assigned to the Client as set out above."}`,
            `Third-party and open-source components used in the Project (${ip.openSourceComponents || "as listed in Annex 1"}) remain governed by their respective original licenses and are not transferred as proprietary property of either Party.`,
            `${ip.commercialRights || "The Client shall be entitled to use, modify, sublicense, and commercially exploit the Deliverables without further consent from the Contractor, subject to the third-party license terms referenced above."}`,
            `License granted for any Contractor pre-existing tools, frameworks, or libraries embedded in the Deliverables: ${ip.license || "non-exclusive, worldwide, royalty-free, for the life of the Deliverables"}.`,
          ]],
          ["Acceptance Procedure", [
            `Upon completion of a Milestone or the Project, the Contractor shall deliver the relevant Deliverables to the Client together with a Project Acceptance Act.`,
            `The Client shall review the Deliverables within ${ac.acceptancePeriod || "5"} business days and either sign the Acceptance Act or provide a written, itemized list of deficiencies.`,
            "Should the Client fail to respond within the period specified above, and absent a reasoned written objection, the Deliverables shall be deemed accepted.",
          ]],
          ["Testing and Bug Classification", [
            { label: "Critical defects", text: `defects that render the system unusable or cause data loss shall be remedied within ${ac.bugCritical || "1"} business day(s).` },
            { label: "Major defects", text: `defects that materially impair core functionality shall be remedied within ${ac.bugMajor || "3"} business day(s).` },
            { label: "Minor defects", text: `defects with limited impact on functionality shall be remedied within ${ac.bugMinor || "7"} business day(s).` },
            { label: "Enhancement requests", text: `requests that fall outside the original specification shall be evaluated within ${ac.bugEnhancement || "10"} business day(s) and, if approved, treated as Additional Work.` },
          ]],
          ["Warranty", [
            `The Contractor warrants that the Deliverables will conform to the agreed specification for a period of ${pr.warranty || "3 (three) months"} following final acceptance (the "Warranty Period").`,
            "During the Warranty Period, the Contractor shall remedy, at no additional cost, any defect attributable to the Contractor's development work, excluding defects arising from unauthorized modification, misuse, or third-party integrations not approved by the Contractor.",
          ]],
          ["Maintenance and Support", [
            `Following the Warranty Period, the Contractor may provide ongoing maintenance and support for ${pr.support || "an agreed period"}, on the terms of a separate Maintenance Agreement or as set out in Annex 1.`,
          ]],
          ["Termination", [
            "Either Party may terminate this Agreement by written notice if the other Party materially breaches this Agreement and fails to remedy such breach within fifteen (15) calendar days of receiving written notice describing the breach.",
            "The Client may terminate this Agreement for convenience upon thirty (30) calendar days' written notice, subject to payment for all Services rendered and Deliverables accepted up to the effective date of termination, together with any documented costs reasonably and unavoidably incurred by the Contractor.",
            "Upon termination, the Contractor shall deliver all completed and in-progress Deliverables to the Client against payment of amounts properly due.",
          ]],
          ["Force Majeure", [
            "Neither Party shall be liable for failure to perform its obligations where such failure results from circumstances beyond its reasonable control, including natural disasters, acts of state authorities, war, civil unrest, epidemic, or significant disruption of internet or power infrastructure.",
            "The affected Party shall notify the other Party in writing within five (5) business days of becoming aware of the force majeure event and shall use reasonable efforts to mitigate its effects.",
          ]],
          ["Liability and Penalties", [
            `In the event of unjustified delay in delivery attributable to the Contractor, the Contractor shall pay a penalty of ${pay.penaltyPercent || "0.1"}% of the value of the delayed Milestone per day of delay, up to a maximum of 10% of the total value of that Milestone.`,
            `In the event of delayed payment attributable to the Client, the Client shall pay a penalty of ${pay.penaltyPercent || "0.1"}% of the overdue amount per day of delay, up to a maximum of 10% of the overdue amount.`,
            `${pay.delayPenaltyNote || "The total aggregate liability of either Party under this Agreement shall not exceed the total price of the Agreement, except in cases of willful misconduct or gross negligence."}`,
          ]],
          ["Dispute Resolution", [
            "The Parties shall use reasonable efforts to resolve any dispute arising out of or in connection with this Agreement through good-faith negotiation.",
            "Should the Parties fail to reach an amicable resolution within thirty (30) calendar days, the dispute shall be referred to the economic court of the Republic of Uzbekistan having jurisdiction over the Contractor's registered address, unless the Parties agree in writing to refer the matter to arbitration.",
          ]],
          ["Notices", [
            "All notices under this Agreement shall be made in writing and delivered by hand, courier, registered mail, or email to the addresses specified in the signature block, and shall be deemed received on the date of confirmed delivery or, for email, on the next business day following transmission absent a bounce notification.",
          ]],
          ["Electronic Document Circulation and Signatures", [
            "This Agreement, its Annexes, and any acceptance acts, invoices, or change requests issued under it may be executed and exchanged in electronic form, including by way of a scanned handwritten signature or an electronic digital signature (EDS) issued in accordance with the Law of the Republic of Uzbekistan \"On Electronic Digital Signature,\" and shall have the same legal force as a document executed on paper, in accordance with the Law \"On Electronic Document Circulation.\"",
            "Each Party shall bear sole responsibility for the confidentiality and proper use of its own electronic signature keys and email accounts used for the purposes of this Agreement.",
          ]],
          ["Governing Law", [
            "This Agreement, including its formation, validity, and interpretation, shall be governed by the laws of the Republic of Uzbekistan.",
          ]],
          ["Final Provisions", [
            "This Agreement, together with its Annexes, constitutes the entire understanding between the Parties with respect to its subject matter and supersedes all prior negotiations, representations, or agreements, whether oral or written.",
            "This Agreement is executed in two original counterparts, one for each Party, both having equal legal force. Where executed in more than one language, the parties shall agree in the signature block which language version prevails in case of discrepancy.",
            "Any amendment to this Agreement shall be valid only if made in writing and signed by authorized representatives of both Parties.",
            "This document is a professionally structured contract template. It does not constitute legal advice, and the Parties are encouraged to have it reviewed by a licensed lawyer prior to execution.",
          ]],
        ],
        annexTitle: "Annex 1 — Project Summary Table",
        signContractorTitle: "CONTRACTOR",
        signClientTitle: "CLIENT",
      },
      ru: {
        title: "Договор оказания IT-услуг",
        subtitle: `№ ${state.meta.contractNumber}`,
        toc: "Содержание",
        preamble: `Настоящий Договор оказания IT-услуг (далее — «Договор») заключён в городе Ташкент, Республика Узбекистан, «${state.meta.dateDisplay}», между ${co.name || "[Наименование Исполнителя]"}, в лице ${co.director || "[Директор]"}, действующего на основании ${co.position || "Устава"} (далее — «Исполнитель»), с одной стороны, и ${cl.name || "[Наименование Заказчика]"}, в лице ${cl.director || cl.name || "[Представитель]"} (далее — «Заказчик»), с другой стороны, именуемые совместно «Стороны», а по отдельности «Сторона», о нижеследующем.`,
        clauses: [
          ["Общие положения", [
            "Настоящий Договор определяет правовые, технические, финансовые и организационные условия, на которых Исполнитель оказывает Заказчику услуги в сфере информационных технологий, включая разработку, внедрение, тестирование и передачу программного обеспечения.",
            "Стороны подтверждают наличие у них полной право- и дееспособности для заключения настоящего Договора и отсутствие ограничений, препятствующих принятию на себя обязательств, предусмотренных настоящим Договором.",
            "Настоящий Договор регулируется Гражданским кодексом Республики Узбекистан, Налоговым кодексом Республики Узбекистан, Законом Республики Узбекистан «Об информатизации», Законом «Об авторском праве и смежных правах», Законом «О персональных данных» и иным применимым законодательством Республики Узбекистан.",
          ]],
          ["Термины и определения", [
            "«Услуги» — разработка программного обеспечения, консультирование, интеграция, тестирование, внедрение и иные IT-услуги, описанные в Техническом задании (Приложение № 1).",
            "«Результаты работ» — программное обеспечение, исходный код, документация, дизайн и иные результаты интеллектуальной деятельности, созданные Исполнителем для Заказчика в рамках настоящего Договора.",
            "«Этап» — определённая стадия Проекта, завершение которой влечёт процедуру приёмки и/или возникновение обязательства по оплате согласно Приложению № 1.",
            "«Конфиденциальная информация» имеет значение, указанное в разделе 13 (Конфиденциальность) настоящего Договора.",
          ]],
          ["Предмет и объём услуг", [
            `Исполнитель обязуется выполнить Услуги по разработке и передаче проекта «${pr.name || "[Название проекта]"}» (далее — «Проект») типа: ${pr.type || "[Тип проекта]"}.`,
            `Описание проекта: ${pr.description || "подлежит детализации в Приложении № 1 (Техническое задание)."}`,
            `Используемые технологии, включая, помимо прочего: ${pr.technologies || "указаны в Приложении № 1"}.`,
            "Любые работы, прямо не предусмотренные в Приложении № 1, рассматриваются как Дополнительные работы согласно разделу 11 и требуют отдельного письменного согласования объёма, сроков и стоимости.",
          ]],
          ["Технические спецификации", [
            "Техническая спецификация Проекта, включая архитектуру, функциональные и нефункциональные требования, интеграции и критерии приёмки, изложена в Приложении № 1, являющемся неотъемлемой частью настоящего Договора.",
            "Любое изменение технической спецификации оформляется письменным запросом на изменение, подписанным обеими Сторонами в соответствии с разделом 12.",
          ]],
          ["Обязанности Исполнителя", [
            "Оказывать Услуги с разумной профессиональной квалификацией, тщательностью и добросовестностью в соответствии с общепринятыми отраслевыми стандартами.",
            "Передавать Результаты работ в соответствии со сроками, установленными в разделе 8 и Приложении № 1.",
            "Незамедлительно уведомлять Заказчика об обстоятельствах, способных повлиять на сроки, бюджет или качество Проекта.",
            "Обеспечивать конфиденциальность информации Заказчика в соответствии с разделом 13.",
            "Предоставлять отчёты о ходе выполнения работ с периодичностью, согласованной Сторонами.",
          ]],
          ["Обязанности Заказчика", [
            "Своевременно предоставлять доступ к информации, материалам, учётным данным, средам и персоналу, разумно необходимым Исполнителю для оказания Услуг.",
            "Рассматривать и принимать либо отклонять Результаты работ в течение срока приёмки, указанного в разделе 15.",
            "Производить оплату в соответствии с графиком, установленным в разделе 9.",
            "Назначить уполномоченного представителя, имеющего полномочия принимать решения по Проекту от имени Заказчика.",
          ]],
          ["Управление проектом", [
            "Каждая Сторона назначает координатора проекта, ответственного за текущее взаимодействие и принятие решений в рамках настоящего Договора.",
            "Совещания по статусу Проекта проводятся с периодичностью, согласованной Сторонами; протоколы существенных решений фиксируются в письменной форме (в том числе по электронной почте или в мессенджерах) и являются обязательными после подтверждения обоими координаторами.",
          ]],
          ["Этапы и сроки", [
            `Проект начинается ${pr.startDate || "[дата начала]"} и подлежит завершению ${pr.endDate || "[дата окончания]"} с учётом изменений, согласованных в порядке раздела 12.`,
            pr.milestones ? { label: "Этапы", text: pr.milestones.split("\n").filter(Boolean).join("; ") } : "Этапы детализированы в Приложении № 1.",
            `Ориентировочная трудоёмкость Проекта составляет ${pr.estimatedHours || "[кол-во часов]"} человеко-часов; данная величина носит ориентировочный характер и не является фиксированным обязательством, если иное прямо не указано в Приложении № 1.`,
          ]],
          ["Условия оплаты", [
            `Общая стоимость настоящего Договора составляет ${money(state, pay.price)}${pay.vatIncluded ? " (с учётом НДС)" : " (без учёта НДС, начисляется дополнительно в соответствии с налоговым законодательством)"}.`,
            `Авансовый платёж в размере ${money(state, pay.advance)} уплачивается Заказчиком в течение пяти (5) рабочих дней с даты подписания настоящего Договора.`,
            `Оставшаяся сумма в размере ${money(state, pay.remaining)} уплачивается в соответствии с графиком этапов, указанным в Приложении № 1, либо по факту окончательной приёмки Результатов работ.`,
            `Оплата производится посредством ${pay.method || "банковского перевода"} на расчётный счёт Исполнителя, указанный в реквизитах Сторон.`,
            "Все суммы указаны без учёта комиссий банковского перевода, которые несёт плательщик, если Сторонами не согласовано иное.",
            "При осуществлении оплаты в иностранной валюте либо в трансграничном порядке Стороны обязуются соблюдать валютное и банковское законодательство Республики Узбекистан, действующее на момент платежа, включая требования об осуществлении расчётов через уполномоченные банки.",
          ]],
          ["Налоги", [
            "Каждая Сторона самостоятельно несёт ответственность по своим налоговым обязательствам, возникающим в связи с настоящим Договором, в соответствии с Налоговым кодексом Республики Узбекистан и иным применимым законодательством.",
            "Если законодательство обязывает Исполнителя удерживать либо учитывать какой-либо налог в связи с платежами по настоящему Договору, Исполнитель осуществляет это и по запросу предоставляет Заказчику подтверждающие документы.",
          ]],
          ["Дополнительные работы и изменения", [
            "Любые работы, запрошенные Заказчиком и выходящие за пределы объёма, определённого в Приложении № 1, рассматриваются как Дополнительные работы и подлежат отдельной оценке стоимости и сроков.",
            "Дополнительные работы считаются согласованными, а соответствующее вознаграждение подлежащим уплате, только при письменном подтверждении (в том числе по электронной почте) уполномоченным представителем Заказчика.",
            "Запрос на изменение, затрагивающий объём, стоимость или сроки, оформляется в письменной форме и подписывается обеими Сторонами до начала его реализации.",
          ]],
          ["Конфиденциальность", [
            "«Конфиденциальная информация» означает любую непубличную техническую, коммерческую, финансовую или организационную информацию, раскрытую любой из Сторон в связи с настоящим Договором в устной, письменной или электронной форме.",
            `${cf.nondisclosure || "Каждая Сторона обязуется не раскрывать Конфиденциальную информацию другой Стороны третьим лицам без предварительного письменного согласия, за исключением случаев, предусмотренных применимым законодательством либо требованием компетентного государственного органа."}`,
            `Обязательство о конфиденциальности сохраняет силу в течение ${cf.ndaDuration || "трёх (3) лет"} после прекращения или истечения срока действия настоящего Договора.`,
            `${cf.dataProtection ? cf.dataProtection : "Каждая Сторона обрабатывает персональные данные, раскрытые в рамках настоящего Договора, в соответствии с Законом Республики Узбекистан «О персональных данных» и принимает разумные технические и организационные меры для их защиты."}`,
            "В случае обработки Исполнителем персональных данных граждан Республики Узбекистан при оказании Услуг, сбор, систематизация и хранение таких данных осуществляются на технических средствах, зарегистрированных в Государственном реестре баз персональных данных; передача таких данных за пределы Республики Узбекистан допускается только с соблюдением правил локализации и трансграничной передачи, установленных Законом «О персональных данных» (с изменениями), и перечня государств, обеспечивающих надлежащий уровень защиты.",
          ]],
          ["Права интеллектуальной собственности", [
            `${ip.sourceCodeOwnership || "После полной оплаты сумм, причитающихся по настоящему Договору, все исключительные имущественные права на исходный код, разработанный специально для Проекта, переходят к Заказчику."}`,
            `${ip.repositoryOwnership || "Доступ к репозиторию исходного кода Проекта и право собственности на него передаются Заказчику после окончательной приёмки и полной оплаты."}`,
            `${ip.copyright || "Личные неимущественные (авторские) права отдельных разработчиков сохраняются за такими разработчиками в соответствии с Законом «Об авторском праве и смежных правах»; имущественные (исключительные) права, необходимые для коммерческого использования, передаются Заказчику в порядке, указанном выше."}`,
            `Компоненты третьих лиц и с открытым исходным кодом, использованные в Проекте (${ip.openSourceComponents || "перечислены в Приложении № 1"}), продолжают регулироваться условиями их первоначальных лицензий и не передаются в собственность какой-либо из Сторон.`,
            `${ip.commercialRights || "Заказчик вправе использовать, модифицировать, сублицензировать и коммерчески эксплуатировать Результаты работ без дополнительного согласия Исполнителя, с учётом условий лицензий третьих лиц, указанных выше."}`,
            `Лицензия на используемые в Результатах работ ранее существовавшие инструменты, фреймворки или библиотеки Исполнителя: ${ip.license || "неисключительная, всемирная, безвозмездная, на срок использования Результатов работ"}.`,
          ]],
          ["Порядок приёмки", [
            "По завершении Этапа либо Проекта Исполнитель передаёт Заказчику соответствующие Результаты работ вместе с Актом приёма-передачи.",
            `Заказчик обязан рассмотреть Результаты работ в течение ${ac.acceptancePeriod || "5"} рабочих дней и либо подписать Акт, либо предоставить письменный мотивированный перечень замечаний.`,
            "В случае непредставления ответа Заказчиком в указанный срок и при отсутствии мотивированных письменных возражений Результаты работ считаются принятыми.",
          ]],
          ["Тестирование и классификация ошибок", [
            { label: "Критические ошибки", text: `ошибки, делающие систему неработоспособной либо приводящие к потере данных, устраняются в течение ${ac.bugCritical || "1"} рабочего(-их) дня(-ей).` },
            { label: "Серьёзные ошибки", text: `ошибки, существенно нарушающие основной функционал, устраняются в течение ${ac.bugMajor || "3"} рабочих дней.` },
            { label: "Незначительные ошибки", text: `ошибки с ограниченным влиянием на функциональность устраняются в течение ${ac.bugMinor || "7"} рабочих дней.` },
            { label: "Запросы на улучшение", text: `запросы, выходящие за пределы первоначальной спецификации, рассматриваются в течение ${ac.bugEnhancement || "10"} рабочих дней и, в случае одобрения, оформляются как Дополнительные работы.` },
          ]],
          ["Гарантия", [
            `Исполнитель гарантирует соответствие Результатов работ согласованной спецификации в течение ${pr.warranty || "3 (трёх) месяцев"} с момента окончательной приёмки («Гарантийный период»).`,
            "В течение Гарантийного периода Исполнитель безвозмездно устраняет любые дефекты, возникшие по вине Исполнителя, за исключением дефектов, вызванных несанкционированным изменением, неправильной эксплуатацией либо интеграциями третьих лиц, не согласованными с Исполнителем.",
          ]],
          ["Техническое обслуживание и поддержка", [
            `По истечении Гарантийного периода Исполнитель вправе оказывать услуги технического обслуживания и поддержки в течение ${pr.support || "согласованного срока"} на условиях отдельного Договора технического обслуживания либо согласно Приложению № 1.`,
          ]],
          ["Расторжение договора", [
            "Любая из Сторон вправе расторгнуть настоящий Договор путём письменного уведомления в случае существенного нарушения его условий другой Стороной, если такое нарушение не устранено в течение пятнадцати (15) календарных дней с момента получения письменного уведомления.",
            "Заказчик вправе расторгнуть настоящий Договор в одностороннем порядке, направив письменное уведомление за тридцать (30) календарных дней, с оплатой всех оказанных Услуг и принятых Результатов работ на дату расторжения, а также документально подтверждённых обоснованных расходов Исполнителя.",
            "При расторжении Договора Исполнитель передаёт Заказчику все завершённые и незавершённые Результаты работ при условии оплаты причитающихся сумм.",
          ]],
          ["Форс-мажор", [
            "Ни одна из Сторон не несёт ответственности за неисполнение обязательств, если такое неисполнение вызвано обстоятельствами вне разумного контроля Стороны, включая стихийные бедствия, действия государственных органов, военные действия, гражданские беспорядки, эпидемии либо существенные сбои в работе интернета или энергоснабжения.",
            "Пострадавшая Сторона обязана уведомить другую Сторону в письменной форме в течение пяти (5) рабочих дней с момента наступления форс-мажорных обстоятельств и предпринять разумные усилия для смягчения их последствий.",
          ]],
          ["Ответственность и неустойка", [
            `В случае необоснованной просрочки передачи Результатов работ по вине Исполнителя, Исполнитель уплачивает неустойку в размере ${pay.penaltyPercent || "0.1"}% от стоимости просроченного Этапа за каждый день просрочки, но не более 10% от стоимости данного Этапа.`,
            `В случае просрочки оплаты по вине Заказчика, Заказчик уплачивает неустойку в размере ${pay.penaltyPercent || "0.1"}% от просроченной суммы за каждый день просрочки, но не более 10% от указанной суммы.`,
            `${pay.delayPenaltyNote || "Совокупная ответственность каждой из Сторон по настоящему Договору не превышает общей стоимости Договора, за исключением случаев умысла или грубой неосторожности."}`,
          ]],
          ["Разрешение споров", [
            "Стороны обязуются прилагать разумные усилия для урегулирования любого спора, возникающего из настоящего Договора или в связи с ним, путём переговоров в духе доброй воли.",
            "В случае недостижения согласия в течение тридцати (30) календарных дней спор передаётся на рассмотрение экономического суда Республики Узбекистан по месту регистрации Исполнителя, если Стороны письменно не договорились о передаче спора в арбитраж.",
          ]],
          ["Уведомления", [
            "Все уведомления по настоящему Договору направляются в письменной форме нарочным, курьером, заказным письмом либо по электронной почте на адреса, указанные в реквизитах Сторон, и считаются полученными на дату подтверждённой доставки, а для электронной почты — на следующий рабочий день после отправки при отсутствии уведомления о недоставке.",
          ]],
          ["Электронный документооборот и подписи", [
            "Настоящий Договор, его Приложения, а также акты приёмки, счета и запросы на изменение, оформляемые в его рамках, могут исполняться и передаваться в электронной форме, в том числе посредством отсканированной собственноручной подписи либо электронной цифровой подписи (ЭЦП), выданной в соответствии с Законом Республики Узбекистан «Об электронной цифровой подписи», и имеют такую же юридическую силу, как и документ, составленный на бумажном носителе, в соответствии с Законом «Об электронном документообороте».",
            "Каждая Сторона несёт самостоятельную ответственность за конфиденциальность и надлежащее использование собственных ключей электронной подписи и адресов электронной почты, используемых для целей настоящего Договора.",
          ]],
          ["Применимое право", [
            "Настоящий Договор, включая вопросы его заключения, действительности и толкования, регулируется законодательством Республики Узбекистан.",
          ]],
          ["Заключительные положения", [
            "Настоящий Договор вместе с Приложениями составляет полное соглашение Сторон по своему предмету и заменяет собой все предыдущие переговоры, заявления либо договорённости, устные или письменные.",
            "Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой Стороны. При составлении на нескольких языках Стороны согласовывают в реквизитах, какой языковой вариант имеет преимущественную силу при расхождениях.",
            "Любое изменение настоящего Договора действительно только в письменной форме и при подписании уполномоченными представителями обеих Сторон.",
            "Настоящий документ является профессионально составленным шаблоном договора. Он не является юридической консультацией; Сторонам рекомендуется передать его на проверку лицензированному юристу до подписания.",
          ]],
        ],
        annexTitle: "Приложение № 1 — Сводная таблица проекта",
        signContractorTitle: "ИСПОЛНИТЕЛЬ",
        signClientTitle: "ЗАКАЗЧИК",
      },
      uz: {
        title: "IT xizmatlarni ko'rsatish shartnomasi",
        subtitle: `№ ${state.meta.contractNumber}`,
        toc: "Mundarija",
        preamble: `Ushbu IT xizmatlarni ko'rsatish shartnomasi (keyingi o'rinlarda — «Shartnoma») Toshkent shahrida, O'zbekiston Respublikasida, ${state.meta.dateDisplay} kuni, bir tomondan ${co.name || "[Ijrochi nomi]"} nomidan ${co.position || "Direktor"} lavozimida faoliyat yurituvchi ${co.director || "[Direktor]"} (keyingi o'rinlarda — «Ijrochi»), ikkinchi tomondan ${cl.name || "[Buyurtmachi nomi]"} nomidan ${cl.director || cl.name || "[Vakil]"} (keyingi o'rinlarda — «Buyurtmachi») o'rtasida, birgalikda «Taraflar», alohida holda «Taraf» deb ataluvchi shaxslar o'rtasida quyidagilar to'g'risida tuzildi.`,
        clauses: [
          ["Umumiy qoidalar", [
            "Ushbu Shartnoma Ijrochi tomonidan Buyurtmachiga dasturiy ta'minotni ishlab chiqish, joriy etish, sinovdan o'tkazish va topshirishni o'z ichiga olgan axborot texnologiyalari sohasidagi xizmatlar ko'rsatilishining huquqiy, texnik, moliyaviy va tashkiliy asoslarini belgilaydi.",
            "Taraflar ushbu Shartnomani tuzish uchun to'liq huquq va muomala layoqatiga ega ekanliklarini hamda ushbu Shartnoma bo'yicha majburiyatlarni qabul qilishga to'sqinlik qiluvchi cheklovlar mavjud emasligini tasdiqlaydilar.",
            "Ushbu Shartnoma O'zbekiston Respublikasining Fuqarolik kodeksi, Soliq kodeksi, «Axborotlashtirish to'g'risida»gi Qonuni, «Mualliflik huquqi va turdosh huquqlar to'g'risida»gi Qonuni, «Shaxsga doir ma'lumotlar to'g'risida»gi Qonuni hamda amaldagi boshqa qonunchilik hujjatlari asosida tartibga solinadi.",
          ]],
          ["Asosiy tushunchalar", [
            "«Xizmatlar» — ushbu Shartnomaga 1-ilova sifatida biriktirilgan Texnik topshiriqda (SOW) tavsiflangan dasturiy ta'minotni ishlab chiqish, konsalting, integratsiya, sinovdan o'tkazish va boshqa IT xizmatlarini anglatadi.",
            "«Natijalar» — Ijrochi tomonidan ushbu Shartnoma doirasida Buyurtmachi uchun yaratilgan dasturiy ta'minot, manba kodi, hujjatlar, dizayn va boshqa ish natijalarini anglatadi.",
            "«Bosqich» — yakunlanishi 1-ilovada belgilangan qabul qilish tartib-taomillari va/yoki to'lov majburiyatlarini keltirib chiqaruvchi Loyihaning belgilangan davri.",
            "«Maxfiy ma'lumot» ushbu Shartnomaning 13-bandida (Maxfiylik) berilgan ma'noga ega.",
          ]],
          ["Xizmatlar doirasi", [
            `Ijrochi «${pr.name || "[Loyiha nomi]"}» nomli loyihani (keyingi o'rinlarda — «Loyiha»), turi: ${pr.type || "[Loyiha turi]"}, ishlab chiqish va topshirish uchun zarur Xizmatlarni bajaradi.`,
            `Loyiha tavsifi: ${pr.description || "1-ilovada (Texnik topshiriq) batafsil ko'rsatiladi."}`,
            `Qo'llaniladigan texnologiyalar, jumladan: ${pr.technologies || "1-ilovada ko'rsatilgan"}.`,
            "1-ilovada aniq ko'rsatilmagan har qanday ishlar 11-bandga muvofiq Qo'shimcha ishlar deb hisoblanadi va ularning hajmi, muddati hamda narxi bo'yicha alohida yozma kelishuvni talab qiladi.",
          ]],
          ["Texnik topshiriq", [
            "Loyihaning texnik topshirig'i, jumladan arxitektura, funksional va nofunksional talablar, integratsiyalar hamda qabul qilish mezonlari ushbu Shartnomaning ajralmas qismi bo'lgan 1-ilovada keltirilgan.",
            "Texnik topshiriqqa har qanday o'zgartirish 12-bandga muvofiq ikkala Taraf tomonidan imzolangan yozma o'zgartirish so'rovi orqali rasmiylashtiriladi.",
          ]],
          ["Ijrochining majburiyatlari", [
            "Xizmatlarni umumiy qabul qilingan tarmoq standartlariga mos ravishda oqilona professional mahorat va e'tibor bilan bajarish.",
            "Natijalarni 8-bandda va 1-ilovada belgilangan muddatlarga muvofiq topshirish.",
            "Loyihaning muddati, byudjeti yoki sifatiga ta'sir qilishi mumkin bo'lgan har qanday holat haqida Buyurtmachini zudlik bilan xabardor qilish.",
            "Buyurtmachi ma'lumotlarining maxfiyligini 13-bandga muvofiq ta'minlash.",
            "Taraflar kelishgan davriylik bilan ish jarayoni bo'yicha hisobotlar taqdim etish.",
          ]],
          ["Buyurtmachining majburiyatlari", [
            "Ijrochiga Xizmatlarni bajarish uchun oqilona zarur bo'lgan ma'lumot, materiallar, kirish ma'lumotlari, muhitlar va xodimlarga o'z vaqtida kirish imkoniyatini berish.",
            "Natijalarni 15-bandda ko'rsatilgan qabul qilish muddati ichida ko'rib chiqish hamda qabul qilish yoki rad etish.",
            "9-bandda belgilangan jadvalga muvofiq to'lovlarni amalga oshirish.",
            "Loyiha bo'yicha Buyurtmachi nomidan qaror qabul qilish vakolatiga ega bo'lgan vakilni tayinlash.",
          ]],
          ["Loyihani boshqarish", [
            "Har bir Taraf ushbu Shartnoma doirasida kundalik muloqot va qarorlar qabul qilish uchun mas'ul bo'lgan loyiha koordinatorini tayinlaydi.",
            "Loyiha holati bo'yicha yig'ilishlar Taraflar kelishgan davriylik bilan o'tkaziladi; muhim qarorlar bayonnomalari yozma shaklda (shu jumladan elektron pochta yoki messenjerlar orqali) qayd etiladi va ikkala koordinator tomonidan tasdiqlangandan so'ng majburiy hisoblanadi.",
          ]],
          ["Bosqichlar va muddatlar", [
            `Loyiha ${pr.startDate || "[boshlanish sanasi]"} kunidan boshlanadi va 12-bandga muvofiq kelishilgan o'zgartirishlarni hisobga olgan holda ${pr.endDate || "[tugash sanasi]"} kunigacha yakunlanishi kerak.`,
            pr.milestones ? { label: "Bosqichlar", text: pr.milestones.split("\n").filter(Boolean).join("; ") } : "Bosqichlar 1-ilovada batafsil ko'rsatilgan.",
            `Loyihaning taxminiy mehnat sarfi ${pr.estimatedHours || "[soatlar soni]"} kishi-soatni tashkil etadi; ushbu ko'rsatkich taxminiy xususiyatga ega bo'lib, agar 1-ilovada aniq ko'rsatilmagan bo'lsa, qat'iy majburiyat hisoblanmaydi.`,
          ]],
          ["To'lov shartlari", [
            `Ushbu Shartnomaning umumiy narxi ${money(state, pay.price)}ni tashkil etadi${pay.vatIncluded ? " (QQS qo'shilgan holda)" : " (QQS qo'shilmagan, amaldagi soliq qonunchiligiga muvofiq qo'shimcha hisoblanadi)"}.`,
            `${money(state, pay.advance)} miqdoridagi avans to'lovi Buyurtmachi tomonidan ushbu Shartnoma imzolangan kundan boshlab besh (5) ish kuni ichida to'lanadi.`,
            `Qolgan ${money(state, pay.remaining)} summasi 1-ilovada ko'rsatilgan bosqichlar jadvaliga muvofiq yoki Natijalar yakuniy qabul qilingandan so'ng to'lanadi.`,
            `To'lov Ijrochining Taraflar rekvizitlarida ko'rsatilgan hisob raqamiga ${pay.method || "bank o'tkazmasi"} orqali amalga oshiriladi.`,
            "Barcha summalar bank o'tkazmasi komissiyalarisiz ko'rsatilgan bo'lib, Taraflar boshqacha kelishmagan bo'lsa, ularni to'lovchi Taraf o'z zimmasiga oladi.",
            "To'lov chet el valyutasida yoki chegaralararo tartibda amalga oshirilganda, Taraflar to'lov amalga oshirilayotgan vaqtda amaldagi O'zbekiston Respublikasi valyuta va bank qonunchiligiga, jumladan hisob-kitoblarni vakolatli banklar orqali amalga oshirish talablariga rioya qiladilar.",
          ]],
          ["Soliqlar", [
            "Har bir Taraf ushbu Shartnoma bilan bog'liq holda yuzaga keladigan soliq majburiyatlari uchun O'zbekiston Respublikasi Soliq kodeksi va amaldagi boshqa qonunchilikka muvofiq mustaqil javobgar bo'ladi.",
            "Agar qonunchilik Ijrochidan ushbu Shartnoma bo'yicha to'lovlar bilan bog'liq biror soliqni ushlab qolish yoki hisobga olishni talab qilsa, Ijrochi buni amalga oshiradi va so'rov bo'yicha Buyurtmachiga tasdiqlovchi hujjatlarni taqdim etadi.",
          ]],
          ["Qo'shimcha ishlar va o'zgartirish so'rovlari", [
            "Buyurtmachi tomonidan so'ralgan va 1-ilovada belgilangan doiradan tashqarida bo'lgan har qanday ish Qo'shimcha ish deb hisoblanadi va narx hamda muddat bo'yicha alohida baholashga bo'ysunadi.",
            "Qo'shimcha ish Buyurtmachining vakolatli vakili tomonidan yozma shaklda (shu jumladan elektron pochta orqali) tasdiqlanmaguncha kelishilgan deb hisoblanmaydi va tegishli to'lov talab qilinmaydi.",
            "Doira, narx yoki muddatga ta'sir qiluvchi o'zgartirish so'rovi amalga oshirilishidan oldin yozma shaklda rasmiylashtirilib, ikkala Taraf tomonidan imzolanadi.",
          ]],
          ["Maxfiylik", [
            "«Maxfiy ma'lumot» — har qanday Taraf tomonidan ushbu Shartnoma bilan bog'liq holda og'zaki, yozma yoki elektron shaklda oshkor qilingan nooshkor texnik, tijorat, moliyaviy yoki tashkiliy ma'lumotni anglatadi.",
            `${cf.nondisclosure || "Har bir Taraf, amaldagi qonunchilik yoki vakolatli davlat organi talabi bilan bog'liq holatlar bundan mustasno, ikkinchi Tarafning Maxfiy ma'lumotini uchinchi shaxslarga oldindan yozma rozilikisiz oshkor etmaslikni o'z zimmasiga oladi."}`,
            `Ushbu maxfiylik majburiyati ushbu Shartnoma bekor qilingan yoki muddati tugagandan so'ng ${cf.ndaDuration || "uch (3) yil"} davomida saqlanadi.`,
            `${cf.dataProtection ? cf.dataProtection : "Har bir Taraf ushbu Shartnoma doirasida oshkor qilingan shaxsga doir ma'lumotlarni «Shaxsga doir ma'lumotlar to'g'risida»gi Qonunga muvofiq qayta ishlaydi va ularni himoya qilish uchun oqilona texnik hamda tashkiliy choralarni ko'radi."}`,
            "Agar Ijrochi Xizmatlarni ko'rsatish jarayonida O'zbekiston Respublikasi fuqarolarining shaxsga doir ma'lumotlarini qayta ishlasa, bunday ma'lumotlarni to'plash, tizimlashtirish va saqlash Shaxsga doir ma'lumotlar bazalarining davlat reyestrida ro'yxatdan o'tgan texnik vositalarda amalga oshiriladi; bunday ma'lumotlarni O'zbekiston Respublikasi hududidan tashqariga uzatish faqat «Shaxsga doir ma'lumotlar to'g'risida»gi Qonun (o'zgartirishlar bilan) va tegishli himoya darajasini ta'minlaydigan davlatlar ro'yxatida belgilangan lokalizatsiya va chegaralararo uzatish qoidalariga muvofiq amalga oshirilishi mumkin.",
          ]],
          ["Intellektual mulk huquqlari", [
            `${ip.sourceCodeOwnership || "Ushbu Shartnoma bo'yicha to'lanishi lozim bo'lgan summalar to'liq to'langandan so'ng, Loyiha uchun maxsus ishlab chiqilgan manba kodiga oid barcha mutlaq mulkiy huquqlar Buyurtmachiga o'tadi."}`,
            `${ip.repositoryOwnership || "Loyihaning manba kodi repozitoriyasiga kirish huquqi va uning egaligi yakuniy qabul va to'liq to'lovdan so'ng Buyurtmachiga o'tkaziladi."}`,
            `${ip.copyright || "Alohida dasturchilarning muallifllik (shaxsiy nomulkiy) huquqlari «Mualliflik huquqi va turdosh huquqlar to'g'risida»gi Qonunga muvofiq ushbu dasturchilarda saqlanib qoladi; tijorat maqsadida foydalanish uchun zarur bo'lgan mulkiy (mutlaq) huquqlar yuqorida ko'rsatilgan tartibda Buyurtmachiga beriladi."}`,
            `Loyihada foydalanilgan uchinchi tomon va ochiq manbali komponentlar (${ip.openSourceComponents || "1-ilovada ro'yxati keltirilgan"}) o'zlarining asl litsenziyalari bilan tartibga solinishda davom etadi va Taraflarning birortasiga mulk sifatida o'tkazilmaydi.`,
            `${ip.commercialRights || "Buyurtmachi yuqorida ko'rsatilgan uchinchi tomon litsenziya shartlarini hisobga olgan holda, Ijrochining qo'shimcha roziligisiz Natijalardan foydalanish, ularni o'zgartirish, sublitsenziya berish va tijorat maqsadida foydalanish huquqiga ega."}`,
            `Natijalarga kiritilgan Ijrochining oldindan mavjud vositalari, freymvorklari yoki kutubxonalariga litsenziya: ${ip.license || "noeksklyuziv, butun dunyo bo'ylab, royaltisiz, Natijalardan foydalanish muddati davomida"}.`,
          ]],
          ["Qabul qilish tartibi", [
            "Bosqich yoki Loyiha yakunlangach, Ijrochi tegishli Natijalarni Loyihani Qabul qilish dalolatnomasi bilan birga Buyurtmachiga topshiradi.",
            `Buyurtmachi Natijalarni ${ac.acceptancePeriod || "5"} ish kuni ichida ko'rib chiqishi va Dalolatnomani imzolashi yoki kamchiliklarning yozma, batafsil ro'yxatini taqdim etishi lozim.`,
            "Agar Buyurtmachi yuqorida ko'rsatilgan muddat ichida javob bermasa va asoslangan yozma e'tirozlar mavjud bo'lmasa, Natijalar qabul qilingan hisoblanadi.",
          ]],
          ["Sinovdan o'tkazish va xatoliklar tasnifi", [
            { label: "Kritik xatoliklar", text: `tizimni ishlashga yaroqsiz qiladigan yoki ma'lumotlar yo'qolishiga olib keladigan xatoliklar ${ac.bugCritical || "1"} ish kuni ichida bartaraf etiladi.` },
            { label: "Jiddiy xatoliklar", text: `asosiy funksionallikka sezilarli ta'sir qiluvchi xatoliklar ${ac.bugMajor || "3"} ish kuni ichida bartaraf etiladi.` },
            { label: "Kichik xatoliklar", text: `funksionallikka cheklangan ta'sir ko'rsatuvchi xatoliklar ${ac.bugMinor || "7"} ish kuni ichida bartaraf etiladi.` },
            { label: "Yaxshilash so'rovlari", text: `dastlabki texnik topshiriq doirasidan tashqaridagi so'rovlar ${ac.bugEnhancement || "10"} ish kuni ichida ko'rib chiqiladi va tasdiqlangan taqdirda Qo'shimcha ish sifatida rasmiylashtiriladi.` },
          ]],
          ["Kafolat", [
            `Ijrochi Natijalarning kelishilgan spesifikatsiyaga yakuniy qabuldan keyingi ${pr.warranty || "3 (uch) oy"} davomida («Kafolat muddati») mos kelishini kafolatlaydi.`,
            "Kafolat muddati davomida Ijrochi Ijrochining aybi bilan yuzaga kelgan har qanday nuqsonni qo'shimcha haq olmasdan bartaraf etadi; bundan ruxsatsiz o'zgartirish, noto'g'ri foydalanish yoki Ijrochi tomonidan tasdiqlanmagan uchinchi tomon integratsiyalari natijasida yuzaga kelgan nuqsonlar mustasno.",
          ]],
          ["Texnik xizmat ko'rsatish va qo'llab-quvvatlash", [
            `Kafolat muddati tugagach, Ijrochi alohida Texnik xizmat ko'rsatish shartnomasi shartlari yoki 1-ilovaga muvofiq ${pr.support || "kelishilgan muddat"} davomida doimiy texnik xizmat va qo'llab-quvvatlash ko'rsatishi mumkin.`,
          ]],
          ["Shartnomani bekor qilish", [
            "Ikkinchi Taraf ushbu Shartnomani jiddiy ravishda buzgan va yozma bildirishnoma olingan kundan boshlab o'n besh (15) kalendar kuni ichida bunday buzilishni bartaraf etmagan taqdirda, har qanday Taraf yozma bildirishnoma orqali ushbu Shartnomani bekor qilishi mumkin.",
            "Buyurtmachi o'ttiz (30) kalendar kuni oldin yozma bildirishnoma yuborish orqali ushbu Shartnomani bir tomonlama bekor qilishi mumkin, bunda bekor qilish sanasigacha ko'rsatilgan barcha Xizmatlar va qabul qilingan Natijalar, shuningdek Ijrochining hujjatlashtirilgan asosli xarajatlari to'lanishi shart.",
            "Shartnoma bekor qilinganda, Ijrochi tegishli summalar to'langan taqdirda barcha yakunlangan va jarayondagi Natijalarni Buyurtmachiga topshiradi.",
          ]],
          ["Fors-major holatlari", [
            "Har qanday Taraf o'zining oqilona nazorati doirasidan tashqaridagi holatlar, jumladan tabiiy ofatlar, davlat organlarining harakatlari, urush, fuqarolik tartibsizliklari, epidemiya yoki internet va elektr ta'minotidagi jiddiy uzilishlar sababli majburiyatlarini bajara olmagani uchun javobgar bo'lmaydi.",
            "Zarar ko'rgan Taraf fors-major holati yuzaga kelganini bilgan kundan boshlab besh (5) ish kuni ichida ikkinchi Tarafni yozma ravishda xabardor qiladi va uning oqibatlarini yumshatish uchun oqilona harakatlar qiladi.",
          ]],
          ["Javobgarlik va jarimalar", [
            `Ijrochining aybi bilan asossiz kechiktirish yuz bergan taqdirda, Ijrochi kechiktirilgan Bosqich qiymatining ${pay.penaltyPercent || "0.1"}% miqdorida, har bir kechikkan kun uchun, ammo ushbu Bosqich qiymatining 10%idan oshmagan holda jarima to'laydi.`,
            `Buyurtmachining aybi bilan to'lov kechiktirilgan taqdirda, Buyurtmachi kechiktirilgan summaning ${pay.penaltyPercent || "0.1"}% miqdorida, har bir kechikkan kun uchun, ammo ushbu summaning 10%idan oshmagan holda jarima to'laydi.`,
            `${pay.delayPenaltyNote || "Har bir Tarafning ushbu Shartnoma bo'yicha umumiy javobgarligi qasddan qilingan harakat yoki qo'pol beparvolik holatlari bundan mustasno, Shartnomaning umumiy qiymatidan oshmaydi."}`,
          ]],
          ["Nizolarni hal qilish", [
            "Taraflar ushbu Shartnomadan kelib chiqadigan yoki u bilan bog'liq har qanday nizoni yaxshi niyat asosida muzokaralar orqali hal qilish uchun oqilona harakatlar qiladilar.",
            "Agar o'ttiz (30) kalendar kuni ichida kelishuvga erishilmasa, Taraflar nizoni arbitrajga topshirish to'g'risida yozma kelishuvga erishmagan bo'lsa, nizo Ijrochi ro'yxatdan o'tgan manzil bo'yicha O'zbekiston Respublikasining iqtisodiy sudiga topshiriladi.",
          ]],
          ["Bildirishnomalar", [
            "Ushbu Shartnoma bo'yicha barcha bildirishnomalar yozma shaklda, qo'lda topshirish, kuryer, buyurtma xat yoki Taraflar rekvizitlarida ko'rsatilgan elektron pochta orqali yuboriladi va tasdiqlangan yetkazib berish sanasida, elektron pochta uchun esa jo'natish sanasidan keyingi ish kunida (agar yetkazib berilmaganligi to'g'risida xabar bo'lmasa) qabul qilingan deb hisoblanadi.",
          ]],
          ["Elektron hujjat aylanishi va imzolar", [
            "Ushbu Shartnoma, uning ilovalari, shuningdek uning doirasida tuziladigan qabul qilish dalolatnomalari, hisob-fakturalar va o'zgartirish so'rovlari elektron shaklda, jumladan skanerlangan qo'lyozma imzo yoki O'zbekiston Respublikasining «Elektron raqamli imzo to'g'risida»gi Qonuniga muvofiq berilgan elektron raqamli imzo (ERI) orqali imzolanishi va almashinishi mumkin va «Elektron hujjat aylanishi to'g'risida»gi Qonunga muvofiq qog'ozda tuzilgan hujjat bilan bir xil yuridik kuchga ega bo'ladi.",
            "Har bir Taraf ushbu Shartnoma maqsadlarida foydalanilayotgan o'z elektron imzo kalitlari va elektron pochta manzillarining maxfiyligi va tegishli tarzda foydalanilishi uchun mustaqil javobgar bo'ladi.",
          ]],
          ["Amal qiluvchi qonunchilik", [
            "Ushbu Shartnoma, shu jumladan uning tuzilishi, haqiqiyligi va talqin etilishi masalalari O'zbekiston Respublikasi qonunchiligiga muvofiq tartibga solinadi.",
          ]],
          ["Yakuniy qoidalar", [
            "Ushbu Shartnoma o'z ilovalari bilan birgalikda Taraflar o'rtasidagi predmet bo'yicha to'liq kelishuvni tashkil etadi va oldingi barcha og'zaki yoki yozma muzokaralar, bayonotlar yoki kelishuvlarni bekor qiladi.",
            "Shartnoma har bir Taraf uchun bir nusxadan, teng yuridik kuchga ega ikkita asl nusxada tuziladi. Bir necha tilda tuzilgan taqdirda, Taraflar rekvizitlarda qaysi til varianti nomuvofiqliklar yuzaga kelganda ustuvor bo'lishini kelishib oladilar.",
            "Ushbu Shartnomaga har qanday o'zgartirish faqat yozma shaklda va ikkala Tarafning vakolatli vakillari tomonidan imzolangan taqdirdagina haqiqiy hisoblanadi.",
            "Ushbu hujjat professional tuzilgan shartnoma shabloni hisoblanadi. U yuridik maslahat emas; Taraflarga imzolashdan oldin uni litsenziyalangan yurist tomonidan tekshirtirish tavsiya etiladi.",
          ]],
        ],
        annexTitle: "1-ilova — Loyiha bo'yicha umumlashtirilgan jadval",
        signContractorTitle: "IJROCHI",
        signClientTitle: "BUYURTMACHI",
      },
    };
    return T[lang] || T.en;
  }

  function annexTable(state, lang, t) {
    const pr = state.project, pay = state.payment;
    const rows = [
      [t("field.projectName"), pr.name || "—"],
      [t("field.projectType"), pr.type || "—"],
      [t("field.technologies"), pr.technologies || "—"],
      [t("field.startDate"), pr.startDate || "—"],
      [t("field.endDate"), pr.endDate || "—"],
      [t("field.estimatedHours"), pr.estimatedHours || "—"],
      [t("field.warranty"), pr.warranty || "—"],
      [t("field.support"), pr.support || "—"],
      [t("field.price"), money(state, pay.price)],
      [t("field.advance"), money(state, pay.advance)],
      [t("field.remaining"), money(state, pay.remaining)],
    ];
    return W.infoTable(rows);
  }

  function generate(state, lang, t) {
    const c = content(state, lang);
    const body = [];
    body.push(W.para(c.preamble, { indentFirstLine: false }));
    body.push(W.spacer(200));

    c.clauses.forEach((entry, idx) => {
      const [title, paragraphs] = entry;
      body.push(...W.clause(idx + 1, title, paragraphs));
    });

    body.push(W.pageBreak());
    body.push(W.heading1(c.annexTitle));
    body.push(W.spacer(150));
    body.push(annexTable(state, lang, t));
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

    return W.buildDocument({
      state, lang, t,
      docTitle: c.title,
      docSubtitle: c.subtitle,
      bodyChildren: body,
      includeTOC: true,
      tocTitle: c.toc,
    });
  }

  return { generate };
})();
