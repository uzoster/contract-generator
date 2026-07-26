/**
 * script.js
 * Application state, view routing, i18n rendering, form binding, draft
 * persistence, and document-generation orchestration for the Uzbekistan IT
 * Contract Generator. Vanilla JS, no build step, no backend.
 */
(() => {
  "use strict";

  // ---------------------------------------------------------------------
  // Default state
  // ---------------------------------------------------------------------
  function defaultState() {
    return {
      meta: {
        contractNumber: nextContractNumber(),
        language: localStorage.getItem("ucg_lang") || "uz",
        dateDisplay: new Date().toLocaleDateString("en-CA"),
        defaultVat: Number(localStorage.getItem("ucg_default_vat") || 12),
      },
      company: {
        name: "", director: "", position: "", tin: "", bank: "", account: "", mfo: "",
        address: "", phone: "", email: "", website: "", logo: "", stamp: "", signature: "",
      },
      client: { type: "company", name: "", director: "", passport: "", tin: "", phone: "", email: "", address: "" },
      project: {
        name: "", type: "Website", description: "", technologies: "", startDate: "", endDate: "",
        warranty: "", support: "", milestones: "", estimatedHours: "",
      },
      payment: {
        currency: localStorage.getItem("ucg_default_currency") || "UZS", price: "", advance: "", remaining: "",
        vatIncluded: false, method: "", penaltyPercent: "0.1", delayPenaltyNote: "", invoiceDueDate: "",
      },
      ip: { sourceCodeOwnership: "", repositoryOwnership: "", copyright: "", license: "", commercialRights: "", openSourceComponents: "" },
      confidentiality: { ndaDuration: "3 years", nondisclosure: "", dataProtection: "", privacy: "" },
      acceptance: { acceptancePeriod: "5", bugCritical: "1", bugMajor: "3", bugMinor: "7", bugEnhancement: "10" },
      maintenance: { tier: "Standard", responseTime: "", resolutionTime: "", monthlyFee: "" },
      invoiceItems: [{ desc: "", qty: 1, price: "" }],
      history: [],
    };
  }

  function nextContractNumber() {
    const year = new Date().getFullYear();
    const key = `ucg_counter_${year}`;
    let n = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, String(n));
    return `IT-${year}-${String(n).padStart(6, "0")}`;
  }

  let state = loadAutosave() || defaultState();

  function loadAutosave() {
    try {
      const raw = localStorage.getItem("ucg_autosave");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return deepMergeDefaults(defaultState(), parsed);
    } catch (e) { return null; }
  }

  function deepMergeDefaults(base, override) {
    const out = Array.isArray(base) ? [...base] : { ...base };
    if (!override) return out;
    Object.keys(override).forEach(k => {
      if (override[k] && typeof override[k] === "object" && !Array.isArray(override[k]) && base[k]) {
        out[k] = deepMergeDefaults(base[k], override[k]);
      } else {
        out[k] = override[k];
      }
    });
    return out;
  }

  function autosave() {
    try { localStorage.setItem("ucg_autosave", JSON.stringify(state)); } catch (e) { /* quota etc */ }
  }

  function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function setPath(obj, path, value) {
    const parts = path.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = value;
  }

  // ---------------------------------------------------------------------
  // i18n
  // ---------------------------------------------------------------------
  function t(key) {
    const dict = I18N[state.meta.language] || I18N.uz;
    return dict[key] || I18N.en[key] || key;
  }

  function applyI18n() {
    document.documentElement.lang = state.meta.language;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.getElementById("langSwitcher").value = state.meta.language;
    const settingsSwitcher = document.getElementById("settingsLangSwitcher");
    if (settingsSwitcher) settingsSwitcher.value = state.meta.language;
  }

  // ---------------------------------------------------------------------
  // Section template injection
  // ---------------------------------------------------------------------
  const SECTION_TEMPLATES = {
    company: "tpl-company-section",
    client: "tpl-client-section",
    project: "tpl-project-section",
    payment: "tpl-payment-section",
    ip: "tpl-ip-section",
    confidentiality: "tpl-confidentiality-section",
    acceptance: "tpl-acceptance-section",
    generate: "tpl-generate-bar",
  };

  function injectSections() {
    document.querySelectorAll(".section-slots").forEach(slot => {
      const names = (slot.getAttribute("data-sections") || "").split(",").map(s => s.trim()).filter(Boolean);
      names.forEach(name => {
        const tplId = SECTION_TEMPLATES[name];
        if (!tplId) return;
        const tpl = document.getElementById(tplId);
        if (!tpl) return;
        const clone = tpl.content.cloneNode(true);
        slot.appendChild(clone);
      });
    });
    // Invoice view has its own generate bar container
    const invoiceBar = document.getElementById("invoiceGenerateBar");
    if (invoiceBar) {
      const tpl = document.getElementById("tpl-generate-bar");
      invoiceBar.appendChild(tpl.content.cloneNode(true));
    }
  }

  // ---------------------------------------------------------------------
  // Form binding: data-field / data-checkfield / data-imagefield
  // ---------------------------------------------------------------------
  function bindForm() {
    document.querySelectorAll("[data-field]").forEach(el => {
      const path = el.getAttribute("data-field");
      const val = getPath(state, path);
      if (val !== undefined && val !== null) el.value = val;
      el.addEventListener("input", () => {
        setPath(state, path, el.value);
        syncOtherInputs(path, el.value, el);
        autosave();
        if (path === "company.name" || path === "client.name") updateDashboardStats();
      });
      el.addEventListener("change", () => {
        setPath(state, path, el.value);
        syncOtherInputs(path, el.value, el);
        autosave();
      });
    });

    document.querySelectorAll("[data-checkfield]").forEach(el => {
      const path = el.getAttribute("data-checkfield");
      el.checked = !!getPath(state, path);
      el.addEventListener("change", () => {
        setPath(state, path, el.checked);
        document.querySelectorAll(`[data-checkfield="${path}"]`).forEach(other => { if (other !== el) other.checked = el.checked; });
        autosave();
      });
    });

    document.querySelectorAll("[data-imagefield]").forEach(el => {
      const path = el.getAttribute("data-imagefield");
      el.addEventListener("change", () => {
        const file = el.files && el.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          setPath(state, path, reader.result);
          document.querySelectorAll(`[data-preview="${path}"]`).forEach(img => { img.src = reader.result; img.style.opacity = 1; });
          autosave();
        };
        reader.readAsDataURL(file);
      });
    });

    // Restore image previews from state
    ["company.logo", "company.stamp", "company.signature"].forEach(path => {
      const val = getPath(state, path);
      if (val) document.querySelectorAll(`[data-preview="${path}"]`).forEach(img => { img.src = val; img.style.opacity = 1; });
    });
  }

  function syncOtherInputs(path, value, sourceEl) {
    document.querySelectorAll(`[data-field="${path}"]`).forEach(other => {
      if (other !== sourceEl) other.value = value;
    });
  }

  // ---------------------------------------------------------------------
  // Invoice line items
  // ---------------------------------------------------------------------
  function renderInvoiceItems() {
    const body = document.getElementById("invoiceItemsBody");
    if (!body) return;
    body.innerHTML = "";
    state.invoiceItems.forEach((item, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input value="${escapeHtml(item.desc)}" data-inv="desc" data-idx="${idx}" placeholder="Service description"></td>
        <td><input type="number" value="${item.qty}" data-inv="qty" data-idx="${idx}"></td>
        <td><input type="number" value="${item.price}" data-inv="price" data-idx="${idx}"></td>
        <td class="text-nowrap">${((Number(item.qty) || 0) * (Number(item.price) || 0)).toLocaleString("en-US")} ${state.payment.currency}</td>
        <td><button class="btn btn-sm btn-link text-danger p-0" data-removeinv="${idx}"><i class="bi bi-trash"></i></button></td>
      `;
      body.appendChild(tr);
    });
    body.querySelectorAll("[data-inv]").forEach(el => {
      el.addEventListener("input", () => {
        const idx = Number(el.getAttribute("data-idx"));
        const field = el.getAttribute("data-inv");
        state.invoiceItems[idx][field] = field === "desc" ? el.value : Number(el.value);
        autosave();
        renderInvoiceItems();
      });
    });
    body.querySelectorAll("[data-removeinv]").forEach(el => {
      el.addEventListener("click", () => {
        const idx = Number(el.getAttribute("data-removeinv"));
        state.invoiceItems.splice(idx, 1);
        if (state.invoiceItems.length === 0) state.invoiceItems.push({ desc: "", qty: 1, price: "" });
        autosave();
        renderInvoiceItems();
      });
    });
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------------------------------------------------------------------
  // View routing
  // ---------------------------------------------------------------------
  function showView(view) {
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(`view-${view}`);
    if (target) target.classList.add("active");
    document.querySelectorAll(".sidebar-nav .nav-link").forEach(l => l.classList.toggle("active", l.getAttribute("data-view") === view));
    document.getElementById("sidebar").classList.remove("open");
    if (view === "dashboard") updateDashboardStats();
  }

  function initNav() {
    document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
      link.addEventListener("click", () => showView(link.getAttribute("data-view")));
    });
    document.querySelectorAll("[data-view-jump]").forEach(el => {
      el.addEventListener("click", () => showView(el.getAttribute("data-view-jump")));
    });
    document.getElementById("btnToggleSidebar").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("open");
    });
  }

  // ---------------------------------------------------------------------
  // Theme
  // ---------------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ucg_theme", theme);
    const icon = document.querySelector("#btnToggleTheme i");
    if (icon) icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
    const sw = document.getElementById("darkModeSwitch");
    if (sw) sw.checked = theme === "dark";
  }

  function initTheme() {
    const saved = localStorage.getItem("ucg_theme") || "light";
    applyTheme(saved);
    document.getElementById("btnToggleTheme").addEventListener("click", () => {
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
    document.getElementById("darkModeSwitch").addEventListener("change", (e) => {
      applyTheme(e.target.checked ? "dark" : "light");
    });
  }

  // ---------------------------------------------------------------------
  // Toasts
  // ---------------------------------------------------------------------
  function toast(message, type = "info") {
    const stack = document.getElementById("toastStack");
    const el = document.createElement("div");
    el.className = `toast-item ${type}`;
    const icon = type === "success" ? "bi-check-circle-fill" : type === "error" ? "bi-x-circle-fill" : "bi-info-circle-fill";
    el.innerHTML = `<i class="bi ${icon}"></i><span>${escapeHtml(message)}</span>`;
    stack.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .3s"; setTimeout(() => el.remove(), 300); }, 3200);
  }

  // ---------------------------------------------------------------------
  // Dashboard stats
  // ---------------------------------------------------------------------
  function updateDashboardStats() {
    document.getElementById("statContracts").textContent = state.history.length;
    const uniqueClients = new Set(state.history.map(h => h.client).filter(Boolean));
    document.getElementById("statClients").textContent = uniqueClients.size || (state.client.name ? 1 : 0);
    const totalValue = state.history.reduce((s, h) => s + (Number(h.value) || 0), 0);
    document.getElementById("statValue").textContent = totalValue ? `${totalValue.toLocaleString("en-US")} ${state.payment.currency}` : "0";
    renderRecentList();
  }

  function renderRecentList() {
    const el = document.getElementById("recentList");
    if (!state.history.length) {
      el.innerHTML = `<div class="form-text-hint">${t("dashboard.none")}</div>`;
      return;
    }
    el.innerHTML = state.history.slice().reverse().slice(0, 8).map(h => `
      <div class="recent-item">
        <div class="r-icon"><i class="bi bi-file-earmark-word"></i></div>
        <div class="flex-fill">
          <div class="r-title">${escapeHtml(h.docTitle)} <span class="badge-soft ms-1">${escapeHtml(h.contractNumber)}</span></div>
          <div class="r-sub">${escapeHtml(h.client || "—")} · ${escapeHtml(h.date)}</div>
        </div>
      </div>
    `).join("");
  }

  function recordHistory(docTitle) {
    state.history.push({
      docTitle, contractNumber: state.meta.contractNumber, client: state.client.name,
      date: new Date().toLocaleDateString("en-CA"), value: state.payment.price || 0,
    });
    autosave();
    updateDashboardStats();
  }

  // ---------------------------------------------------------------------
  // Generation
  // ---------------------------------------------------------------------
  const GENERATORS = {
    itService: ContractITService, nda: ContractNDA, sow: ContractSOW,
    acceptance: ContractAcceptance, invoice: ContractInvoice, maintenance: ContractMaintenance,
  };
  const FILENAME_PREFIX = { itService: "IT-Service-Agreement", nda: "NDA", sow: "SOW", acceptance: "Acceptance-Act", invoice: "Invoice", maintenance: "Maintenance-Agreement" };

  function validate(docType) {
    if (!state.company.name || !state.client.name) {
      toast(t("toast.formIncomplete"), "error");
      return false;
    }
    return true;
  }

  async function generateDocument(docType) {
    if (!validate(docType)) return;
    const overlay = document.getElementById("genOverlay");
    overlay.style.display = "flex";
    try {
      state.meta.dateDisplay = new Date().toLocaleDateString("en-CA");
      const gen = GENERATORS[docType];
      await new Promise(r => setTimeout(r, 250)); // let overlay paint
      const doc = gen.generate(state, state.meta.language, t);
      const filename = `${FILENAME_PREFIX[docType]}-${state.meta.contractNumber}.docx`;
      await WordGen.saveDocument(doc, filename);
      recordHistory(document.querySelector(`#view-${docType} h1`)?.textContent?.trim() || docType);
      toast(t("toast.generated"), "success");
    } catch (e) {
      console.error(e);
      toast(t("toast.error") + ": " + e.message, "error");
    } finally {
      overlay.style.display = "none";
    }
  }

  function initGenerateButtons() {
    document.querySelectorAll('[data-action="generate"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const section = btn.closest(".view-section");
        const docType = section ? section.getAttribute("data-doctype") : null;
        if (docType) generateDocument(docType);
      });
    });
    document.querySelectorAll('[data-action="reset"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const modalEl = document.getElementById("confirmClearModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
        document.getElementById("btnConfirmClear").onclick = () => {
          const section = btn.closest(".view-section");
          const docType = section ? section.getAttribute("data-doctype") : null;
          resetSectionFields(section);
          modal.hide();
          toast(t("toast.cleared"), "info");
        };
      });
    });
    document.querySelectorAll('[data-action="preview"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const section = btn.closest(".view-section");
        renderPreview(section ? section.getAttribute("data-doctype") : null);
        bootstrap.Modal.getOrCreateInstance(document.getElementById("previewModal")).show();
      });
    });
    document.getElementById("btnGenerateFromPreview").addEventListener("click", () => {
      const active = document.querySelector(".view-section.active[data-doctype]");
      if (active) generateDocument(active.getAttribute("data-doctype"));
    });
  }

  function resetSectionFields(section) {
    if (!section) return;
    section.querySelectorAll("[data-field]").forEach(el => {
      const path = el.getAttribute("data-field");
      setPath(state, path, "");
      el.value = "";
      syncOtherInputs(path, "", el);
    });
    autosave();
  }

  function renderPreview(docType) {
    const container = document.getElementById("previewContent");
    const label = { itService: t("nav.itService"), nda: t("nav.nda"), sow: t("nav.sow"), acceptance: t("nav.acceptance"), invoice: t("nav.invoice"), maintenance: t("nav.maintenance") }[docType] || "";
    container.innerHTML = `
      <h3>${escapeHtml(label)}</h3>
      <p style="text-align:center;color:#666;">${escapeHtml(state.meta.contractNumber)} · ${escapeHtml(state.meta.dateDisplay)}</p>
      <hr>
      <h4>${escapeHtml(t("section.company"))}</h4>
      <p>${escapeHtml(state.company.name || "—")}<br>${escapeHtml(state.company.director || "")} ${escapeHtml(state.company.position ? "· " + state.company.position : "")}<br>${escapeHtml(state.company.address || "")}</p>
      <h4>${escapeHtml(t("section.client"))}</h4>
      <p>${escapeHtml(state.client.name || "—")}<br>${escapeHtml(state.client.address || "")}</p>
      ${state.project.name ? `<h4>${escapeHtml(t("section.project"))}</h4><p>${escapeHtml(state.project.name)} — ${escapeHtml(state.project.description || "")}</p>` : ""}
      ${state.payment.price ? `<h4>${escapeHtml(t("section.payment"))}</h4><p>${escapeHtml(String(state.payment.price))} ${escapeHtml(state.payment.currency)}</p>` : ""}
      <p style="color:#888;font-size:12px;text-align:center;margin-top:24px;">This is a simplified on-screen preview. Click "Generate Word document" for the fully formatted .docx.</p>
    `;
  }

  // ---------------------------------------------------------------------
  // Drafts & JSON import/export
  // ---------------------------------------------------------------------
  function initDraftControls() {
    document.getElementById("btnSaveDraft").addEventListener("click", () => {
      localStorage.setItem("ucg_draft", JSON.stringify(state));
      toast(t("toast.draftSaved"), "success");
    });
    document.getElementById("btnLoadDraft").addEventListener("click", () => {
      const raw = localStorage.getItem("ucg_draft");
      if (!raw) { toast(t("toast.error"), "error"); return; }
      state = deepMergeDefaults(defaultState(), JSON.parse(raw));
      rehydrateUI();
      toast(t("toast.draftLoaded"), "success");
    });

    const importInput = document.getElementById("draftFileInput");
    document.getElementById("btnExportJson").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      saveAs(blob, `contract-${state.meta.contractNumber}.json`);
      toast(t("toast.jsonExported"), "success");
    });
    document.getElementById("btnImportJson").addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", () => {
      const file = importInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          state = deepMergeDefaults(defaultState(), JSON.parse(reader.result));
          rehydrateUI();
          toast(t("toast.jsonImported"), "success");
        } catch (e) { toast(t("toast.error"), "error"); }
      };
      reader.readAsText(file);
    });
  }

  function rehydrateUI() {
    autosave();
    bindForm();
    renderInvoiceItems();
    applyI18n();
    document.getElementById("topbarContractNo").textContent = state.meta.contractNumber;
    updateDashboardStats();
  }

  // ---------------------------------------------------------------------
  // Settings: profile save, language, VAT/currency defaults
  // ---------------------------------------------------------------------
  function initSettings() {
    document.getElementById("btnSaveProfile").addEventListener("click", () => {
      autosave();
      toast(t("toast.profileSaved"), "success");
    });

    const defaultCurrency = document.getElementById("defaultCurrency");
    const defaultVat = document.getElementById("defaultVat");
    defaultCurrency.value = state.payment.currency || "UZS";
    defaultVat.value = state.meta.defaultVat;
    defaultCurrency.addEventListener("change", () => {
      localStorage.setItem("ucg_default_currency", defaultCurrency.value);
      if (!state.payment.currency) state.payment.currency = defaultCurrency.value;
      autosave();
    });
    defaultVat.addEventListener("input", () => {
      state.meta.defaultVat = Number(defaultVat.value);
      localStorage.setItem("ucg_default_vat", defaultVat.value);
      autosave();
    });

    function setLanguage(lang) {
      state.meta.language = lang;
      localStorage.setItem("ucg_lang", lang);
      applyI18n();
      renderInvoiceItems();
      autosave();
    }
    document.getElementById("langSwitcher").addEventListener("change", (e) => setLanguage(e.target.value));
    document.getElementById("settingsLangSwitcher").addEventListener("change", (e) => setLanguage(e.target.value));
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  function init() {
    injectSections();
    bindForm();
    renderInvoiceItems();
    initNav();
    initTheme();
    initGenerateButtons();
    initDraftControls();
    initSettings();
    applyI18n();
    document.getElementById("topbarContractNo").textContent = state.meta.contractNumber;
    document.getElementById("footerYear").textContent = new Date().getFullYear();
    document.getElementById("btnAddInvoiceRow").addEventListener("click", () => {
      state.invoiceItems.push({ desc: "", qty: 1, price: "" });
      autosave();
      renderInvoiceItems();
    });
    updateDashboardStats();
    autosave();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
