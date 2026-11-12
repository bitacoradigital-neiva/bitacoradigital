/* ==========================================================================
   Bitácora Digital · interacción y movimiento
   ========================================================================== */
"use strict";

const WHATSAPP = "573144321446";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const saveData = !!(navigator.connection && navigator.connection.saveData);

// Gama del dispositivo: alta = todo · media = sin los efectos más finos · baja = solo fundidos
const GAMA = (() => {
    if (reduceMotion) return "baja";
    const cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
    const net = (navigator.connection && navigator.connection.effectiveType) || "";
    const apple = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (saveData || /2g/.test(net) || cores <= 2 || mem <= 2) return "baja";
    if (apple) return "alta";
    return cores <= 4 || mem <= 4 ? "media" : "alta";
})();
document.documentElement.dataset.gama = GAMA;
$("#year").textContent = String(new Date().getFullYear());

/* ---------- Navegación: enlace activo y menú ---------- */
const navLinks = $$(".nav-links a");
const sections = navLinks.map((a) => $(a.getAttribute("href")));
let navTick = false;
function syncNav() {
    navTick = false;
    const mid = window.scrollY + window.innerHeight * 0.4;
    let active = -1;
    sections.forEach((sec, i) => { if (sec && sec.getBoundingClientRect().top + window.scrollY <= mid) active = i; });
    navLinks.forEach((a, i) => a.classList.toggle("is-active", i === active));
    syncFloating();
}
window.addEventListener("scroll", () => { if (!navTick) { navTick = true; requestAnimationFrame(syncNav); } }, { passive: true });

const navToggle = $("#nav-toggle"), navSheet = $("#nav-sheet");
function setMenu(open, focusBack = false) {
    navSheet.hidden = !open;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (!open && focusBack) navToggle.focus();
}
navToggle.addEventListener("click", () => setMenu(navSheet.hidden));
navSheet.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("click", (e) => { if (!navSheet.hidden && !navSheet.contains(e.target) && !navToggle.contains(e.target)) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !navSheet.hidden) setMenu(false, true); });

/* ---------- Videos: solo se reproducen mientras se ven ---------- */
if (!reduceMotion && !saveData && "IntersectionObserver" in window) {
    $$("video[data-autoplay]").forEach((video) => {
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { video.preload = "auto"; const p = video.play(); if (p) p.catch(() => {}); }
            else video.pause();
        }, { threshold: 0.2 }).observe(video);
    });
}

/* ---------- Cotizador ---------- */
const servicesList = [
    { id: "wb1", short: "Landing page", cat: "Landing pages", name: "Landing page comercial", desc: "Una página enfocada en presentar tu producto o servicio y llevar al cliente a tu WhatsApp", cop: 500000, usd: 125, eta: "Una sola página" },
    { id: "wb2", short: "Sitio web llave en mano", cat: "Páginas web", name: "Sitio web llave en mano", desc: "Hasta 4 páginas, diseño adaptable a celular, WhatsApp, formulario y 2 rondas de ajustes. Dominio .com, hosting y SSL por 1 año. El cliente entrega textos, logo y fotografías", cop: 990000, usd: 247.5, from: true, eta: "Alcance básico" },
    { id: "wb3", short: "Sitio web corporativo", cat: "Páginas web", name: "Sitio web corporativo", desc: "Hasta 7 páginas, presentación de servicios, blog administrable básico, formulario y 3 rondas de ajustes. Dominio .com, hosting y SSL por 1 año. El cliente entrega textos, logo y fotografías", cop: 1490000, usd: 372.5, from: true, eta: "Alcance básico" },
    { id: "vd1", short: "Video publicitario", cat: "Producción audiovisual", name: "Video publicitario digital", desc: "Desde $50.000 COP como referencia. El precio final se cotiza según la calidad de producción, complejidad y alcance que necesitas", cop: 50000, usd: 12.5, from: true, customQuote: true, eta: "Según el proyecto" },
    { id: "vd2", short: "Motion graphics o video explicativo", cat: "Producción audiovisual", name: "Motion graphics o video explicativo", desc: "Desde $100.000 COP como referencia. El precio final se cotiza según la calidad de producción, complejidad y alcance que necesitas", cop: 100000, usd: 25, from: true, customQuote: true, eta: "Según el proyecto" },
    { id: "sw1", short: "Windows y programas", cat: "Instalación de software", name: "Instalación de Windows y programas", desc: "Instalación y configuración. La compra de una licencia oficial se cotiza y paga por separado, con tu aprobación previa", cop: null, usd: null, eta: "Según el equipo" },
    { id: "sw2", short: "Microsoft Office", cat: "Instalación de software", name: "Instalación de Microsoft Office", desc: "Instalación y activación con licencia oficial. Si necesitas comprarla, te informamos su valor y la adquirimos con tu aprobación y pago previo", cop: null, usd: null, eta: "Licencia aparte" }
];
const ICONS = {
    wb1: '<path d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M11 18h2"/>',
    wb2: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    wb3: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M7 6h.01M10 6h.01M8 21h8M12 18v3"/>',
    vd1: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>',
    vd2: '<path d="M4 18 9 9l4 6 3-4 4 7z"/><circle cx="17" cy="6" r="2"/>'
};
ICONS.sw1 = ICONS.wb3;
ICONS.sw2 = ICONS.wb3;
const formatters = {
    COP: new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }),
    USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })
};
let currency = "COP";
const selected = new Set();
const ledger = $("#services-target");
const summaryItems = $("#summary-items");
const totalEl = $("#total-val");
const totalLabel = $("#total-label");
const waBtn = $("#btn-wa-quote");
const terms = $("#agree-terms");
const waReason = $("#wa-reason");
const quoteBar = $("#quote-bar");
const barTotal = $("#quote-bar-total");
const barCount = $("#quote-bar-count");
const fab = $("#fab");
const price = (s) => s.cop == null ? "A cotizar" : (s.from ? "Desde " : "") + formatters[currency].format(s[currency.toLowerCase()]);

ledger.innerHTML = servicesList.map((s) => `
    <label class="service-row" data-id="${s.id}">
        <span class="svc-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[s.id]}</svg></span>
        <input class="check" type="checkbox" value="${s.id}" aria-label="${s.name}" aria-describedby="desc-${s.id}">
        <span class="svc-body-q">
            <span class="service-cat">${s.cat}</span><span class="service-name">${s.short}</span>
            <span class="service-price"><span class="p-val"></span><span class="service-eta">${s.eta}</span></span>
            <span class="service-desc" id="desc-${s.id}"><span>${s.desc}</span></span>
        </span>
    </label>`).join("") + `
    <a class="service-row svc-other" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, Bitácora Digital. Necesito algo que no está en el cotizador:")}" target="_blank" rel="noopener noreferrer">
        <svg class="icon" aria-hidden="true"><use href="#i-whatsapp"/></svg>
        <span class="service-name">¿Necesitas algo distinto?</span>
        <span class="svc-other-text">Cuéntanos y te cotizamos.</span>
    </a>`;

function renderPrices() {
    servicesList.forEach((s) => { ledger.querySelector(`[data-id="${s.id}"] .p-val`).textContent = price(s); });
}
function updateSummary(animate = false) {
    const active = servicesList.filter((s) => selected.has(s.id));
    const total = active.reduce((sum, s) => sum + (s.customQuote ? 0 : (s[currency.toLowerCase()] || 0)), 0);
    const pending = active.some((s) => s.cop == null || s.customQuote);
    const priced = active.some((s) => s.cop != null && !s.customQuote);
    const starting = active.some((s) => s.from && !s.customQuote);
    const totalText = pending && !priced ? "A cotizar" : (starting ? "Desde " : "") + formatters[currency].format(total) + (pending ? " + por cotizar" : "");
    summaryItems.innerHTML = active.map((s) => `<div class="summary-line"><span>${s.name}</span><span class="cost">${s.customQuote ? "A cotizar" : price(s)}</span></div>`).join("");
    const label = `${active.length} ${active.length === 1 ? "servicio" : "servicios"}`;
    totalLabel.textContent = active.length ? `Inversión estimada por ${label}` + (pending ? " (los servicios sin precio final y las licencias se cotizan aparte)" : "") : "Marca una o más opciones para calcular.";
    totalEl.textContent = barTotal.textContent = pending && !priced ? "A cotizar" : (starting ? "Desde " : "") + formatters[currency].format(total);
    barCount.textContent = label;
    if (animate && !reduceMotion && totalEl.animate) {
        totalEl.animate([{ opacity: 0.3, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    }
    const message = active.length
        ? "Hola, Bitácora Digital. He armado la siguiente cotización en su sitio web:\n\n" + active.map((s) => `• ${s.name}: ${price(s)}${s.customQuote ? " (referencia mínima; precio final por cotizar según calidad, complejidad y alcance)" : ""}`).join("\n") + `\n\nTotal estimado: ${totalText} ${currency}` + `\n¿Me confirman disponibilidad? Gracias.`
        : "Hola, Bitácora Digital. Me gustaría consultar por sus servicios.";
    waBtn.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
    syncFloating();
}
function setSelected(id, on) {
    const input = ledger.querySelector(`.check[value="${id}"]`);
    if (!input) return;
    input.checked = on;
    on ? selected.add(id) : selected.delete(id);
    input.closest(".service-row").classList.toggle("is-selected", on);
}
ledger.addEventListener("change", (e) => {
    const input = e.target.closest(".check");
    if (!input) return;
    setSelected(input.value, input.checked);
    updateSummary(true);
});
// Los botones "Cotizar" de cada servicio llegan con la opción ya marcada
$$("[data-pick]").forEach((btn) => btn.addEventListener("click", () => { setSelected(btn.dataset.pick, true); updateSummary(true); }));
$$("[data-currency]").forEach((btn) => {
    btn.addEventListener("click", () => {
        currency = btn.dataset.currency;
        $$("[data-currency]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        renderPrices();
        updateSummary(true);
    });
});
function setConsent(ok) { waBtn.setAttribute("aria-disabled", String(!ok)); waBtn.tabIndex = ok ? 0 : -1; waReason.hidden = ok; }
terms.addEventListener("change", () => setConsent(terms.checked));
waBtn.addEventListener("click", (e) => { if (!terms.checked) { e.preventDefault(); terms.focus(); } });

/* ---------- Botón flotante y barra de total ---------- */
let inQuote = false, summaryVisible = false;
function syncFloating() {
    const pastHero = window.scrollY > window.innerHeight * 0.7;
    const showBar = inQuote && selected.size > 0 && !summaryVisible;
    if (quoteBar.classList.contains("is-visible") !== showBar) {
        quoteBar.classList.toggle("is-visible", showBar);
        quoteBar.setAttribute("aria-hidden", String(!showBar));
        quoteBar.querySelector("a").tabIndex = showBar ? 0 : -1;
    }
    fab.classList.toggle("is-visible", pastHero && !showBar && !summaryVisible);
}
if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { inQuote = e.isIntersecting; syncFloating(); }, { rootMargin: "-20% 0px -20% 0px" }).observe($("#cotizador"));
    new IntersectionObserver(([e]) => { summaryVisible = e.isIntersecting; syncFloating(); }, { threshold: 0.35 }).observe($("#summary"));
}
renderPrices();
updateSummary();
setConsent(terms.checked);

/* ---------- Formulario de contacto: arma el mensaje y abre WhatsApp ---------- */
const form = $("#contact-form");
const contactFields = { name: form.elements.namedItem("name"), message: form.elements.namedItem("message"), service: form.elements.namedItem("service") };
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactFields.name.value.trim(), msg = contactFields.message.value.trim(), service = contactFields.service.value;
    const fields = [[contactFields.name, "cf-name-error", name.length >= 2, "Escribe tu nombre."], [contactFields.message, "cf-msg-error", msg.length >= 5, "Cuéntanos qué necesitas."]];
    let ok = true;
    fields.forEach(([input, errId, valid, text]) => {
        input.closest(".field").classList.toggle("has-error", !valid);
        input.setAttribute("aria-invalid", String(!valid));
        $("#" + errId).textContent = valid ? "" : text;
        if (!valid && ok) { input.focus(); ok = false; }
    });
    if (!ok) return;
    const text = `Hola, Bitácora Digital. Soy ${name}.\nNecesito: ${service}.\n\n${msg}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});
["name", "message"].forEach((n) => contactFields[n].addEventListener("input", () => {
    const f = contactFields[n].closest(".field");
    if (f.classList.contains("has-error")) { f.classList.remove("has-error"); contactFields[n].removeAttribute("aria-invalid"); f.querySelector(".field-error").textContent = ""; }
}));

/* ---------- El recorrido Scroll World ----------
   Si existe assets/world/ia/manifest.json (lo escribe produccion/scroll-world/generar.sh) se usa la cadena
   generada con la skill (arquitectura A: piernas encadenadas, sin conectores). Si no, la versión gratuita
   con videos de stock. Cuando exista la cadena vertical nativa, el manifiesto trae "movilNativo": true. */
const WA_LINK = "https://wa.me/573144321446?text=" + encodeURIComponent("Hola, Bitácora Digital. Quiero información sobre sus servicios.");
const SCENES = [
    { id: "marca", label: "Bitácora Digital", free: "laptop", scroll: 1.7, linger: 0.35,
      title: "Diseño, web y video para marcas que quieren verse profesionales.",
      body: "Páginas web, landing pages y producción audiovisual digital. Desde Neiva para toda Colombia.",
      tags: ["Páginas web", "Landing pages", "Video digital"] },
    { id: "web", label: "Páginas web", free: "web", linger: 0.3,
      title: "Sitios web con personalidad propia.",
      body: "Diseño a la medida, interfaces modernas y una presentación de marca que se adapta a cualquier pantalla.",
      tags: ["Desde $990.000", "Alcance según tu proyecto"] },
    { id: "landing", label: "Landing pages", free: "landing", linger: 0.3,
      title: "Landing pages que llevan a la acción.",
      body: "Una estructura pensada para presentar tu producto y convertir visitas en mensajes de WhatsApp.",
      tags: ["Desde $500.000", "Plazo a convenir"] },
    { id: "video", label: "Producción digital", free: "edicion", linger: 0.3,
      title: "Videos hechos con diseño, edición y animación.",
      body: "Publicidad, motion graphics y demos de páginas producidos en digital, sin cámaras ni estudio.",
      tags: ["Motion graphics", "Edición", "Redes sociales"] },
    { id: "contacto", label: "Hablemos", free: "cierre", scroll: 1.5, linger: 0.4,
      title: "¿Creamos algo juntos?",
      body: "Cuéntanos tu idea y te enviamos una propuesta con precio.",
      cta: { primary: { label: "Arma tu cotización", href: "#cotizador" }, secondary: { label: "WhatsApp", href: WA_LINK } } }
];
/* Vigilancia: si mientras se recorre el mundo los cuadros tardan de verdad (3 tandas seguidas),
   el recorrido pasa a modo económico (imágenes en vez de video) y se apagan efectos costosos. */
function watchWorld(host) {
    let n = 0, slow = 0, sum = 0, bad = 0, last = 0, raf = 0, lastScroll = 0, off = false;
    const tick = (t) => {
        const d = t - last; last = t;
        if (off || performance.now() - lastScroll > 250) { raf = 0; return; }
        if (!document.hidden && d < 250 && !document.documentElement.classList.contains("sw-past")) {
            n++; sum += d; if (d > 34) slow++;
            if (n >= 90) {
                bad = slow > 14 || sum / n > 30 ? bad + 1 : 0;
                n = 0; slow = 0; sum = 0;
                if (bad >= 3) {
                    off = true;
                    if (host.swLite) host.swLite();
                    document.documentElement.dataset.gama = "baja";
                }
            }
        }
        raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", () => { lastScroll = performance.now(); if (!raf && !off) { last = lastScroll; raf = requestAnimationFrame(tick); } }, { passive: true });
}

async function mountWorld() {
    const host = $("#world");
    if (!host || typeof mountScrollWorld !== "function") { document.documentElement.classList.add("no-world"); return; }
    // La cadena generada con IA (assets/world/ia/) solo se consulta si existe: poner MUNDO_IA = true cuando se genere.
    // Así no se gasta una consulta a la red al abrir la página, que retrasaba la aparición del recorrido.
    const MUNDO_IA = false;
    let ia = null;
    if (MUNDO_IA) { try { const r = await fetch("assets/world/ia/manifest.json", { cache: "no-store" }); if (r.ok) ia = await r.json(); } catch (e) { /* sin cadena generada */ } }
    const A = "#8295A3";
    // Calidad según el equipo: gama alta = video HD; gama media = versión "lite" (más liviana de decodificar);
    // gama baja o ahorro de datos = imágenes en alta calidad con acercamiento suave, sin video.
    const lite = GAMA === "baja";
    const deskSuffix = !ia && GAMA === "media" ? "-lite" : "";
    const sections = SCENES.map((sc) => {
        const base = ia ? `assets/world/ia/${sc.id}` : `assets/world/${sc.free}`;
        const mob = ia && ia.movilNativo ? `${base}-m9` : `${base}-m`;
        return { ...sc, accent: A, still: `${base}.webp`, stillMobile: `${mob}.webp`, clip: `${base}${deskSuffix}.mp4`, clipMobile: `${mob}.mp4` };
    });
    document.documentElement.dataset.mundo = ia ? "ia" : "gratis";
    mountScrollWorld(host, { nav: false, atmosphere: false, hint: "Desliza para recorrer", diveScroll: 1.25, crossfade: ia ? 0.08 : 0.16, sections, connectors: [], lite });
    watchWorld(host);
    const fallback = $("#world-fallback");
    if (fallback) fallback.hidden = true;
    const after = $(".after");
    let past = null, t = false;
    const check = () => { t = false; const p = after.getBoundingClientRect().top <= 0; if (p !== past) { past = p; document.documentElement.classList.toggle("sw-past", p); } };
    window.addEventListener("scroll", () => { if (!t) { t = true; requestAnimationFrame(check); } }, { passive: true });
    check();
    host.querySelectorAll('a[href^="https://wa.me"]').forEach((a) => { a.target = "_blank"; a.rel = "noopener noreferrer"; });
}

/* ---------- Galería de producción audiovisual (conceptos demostrativos) ----------
   Cada formato acepta un video real en assets/reel/<id>.mp4 (+ .webm opcional y <id>.webp de póster).
   Si el archivo no existe, la ficha muestra el guion visual y queda marcada "en producción". */
const REEL = [
    { id: "lanzamiento-web", tag: "A", title: "Lanzamiento de una página web", format: "Anuncio · 16:9 · 13 s",
      idea: "El sitio se presenta como un producto digital premium: la pantalla se enciende, la interfaz se arma por capas y el titular cierra con la marca." },
    { id: "anuncio-landing", tag: "B", title: "Publicidad de una landing page", format: "Anuncio vertical · 9:16 · 15 s",
      idea: "Ritmo rápido para redes: problema en una frase, la landing en el celular, el botón de WhatsApp como remate." },
    { id: "motion", tag: "C", title: "Motion graphics", format: "Animación tipográfica · 16:9 · 13 s",
      idea: "Tipografía cinética y formas geométricas que se ordenan al compás de la música hasta formar el mensaje." },
    { id: "demo-producto", tag: "D", title: "Presentación de un producto digital", format: "Demo de interfaz · 16:9 · 25 s",
      idea: "Un recorrido guiado por una interfaz real: desplazamientos suaves, acercamientos a los detalles y textos que explican cada paso." },
    { id: "comercial", tag: "E", title: "Publicidad comercial", format: "Anuncio cuadrado · 1:1 · 15 s",
      idea: "Cómo un negocio presenta sus productos con composición limpia, precios claros y una llamada a la acción final." },
    { id: "explicativo", tag: "F", title: "Video explicativo", format: "Video explicativo · 16:9 · 21 s",
      idea: "Gráficos, íconos animados y texto en pantalla para explicar un servicio en tres pasos." }
];
async function buildReel() {
    const reel = $("#reel");
    if (!reel) return;
    let ready = {};
    try { const r = await fetch("assets/reel/manifest.json", { cache: "no-store" }); if (r.ok) ready = await r.json(); } catch (e) { /* aún sin piezas */ }
    const available = REEL.filter((piece) => ready[piece.id]);
    if (!available.length) {
        reel.innerHTML = '<p class="lead">Consulta las muestras disponibles por <a href="https://wa.me/573144321446">WhatsApp</a>.</p>';
        return;
    }
    reel.innerHTML = available.map((p, k) => {
        const real = ready[p.id];
        const media = real
            ? `<video class="piece-video" controls muted loop playsinline preload="none" poster="assets/reel/${p.id}.webp" data-autoplay aria-label="${p.title}"><source src="assets/reel/${p.id}.mp4" type="video/mp4"></video>`
            : `<div class="piece-frame" aria-hidden="true"><span class="piece-letter">${p.tag}</span><span class="piece-bars"><i></i><i></i><i></i><i></i></span></div>`;
        return `<article class="piece${k === 0 || k === 3 ? " piece-wide" : ""}${real ? " has-video" : ""}">
            <div class="piece-media">${media}<span class="piece-badge">${real ? "Concepto demostrativo" : "Concepto en producción"}</span></div>
            <div class="piece-body"><p class="piece-format">${p.format}</p><h3>${p.title}</h3><p>${p.idea}</p></div>
        </article>`;
    }).join("");
    // En gama baja los videos de la galería no arrancan solos: se ven con su portada y se reproducen al tocar
    if (!reduceMotion && !saveData && GAMA !== "baja" && "IntersectionObserver" in window) {
        reel.querySelectorAll("video[data-autoplay]").forEach((v) => new IntersectionObserver(([en]) => {
            if (en.isIntersecting) { v.preload = "auto"; const pr = v.play(); if (pr) pr.catch(() => {}); } else v.pause();
        }, { threshold: 0.3 }).observe(v));
    }
}

/* ---------- Servicios: capítulos tipográficos con scroll nativo ---------- */
function initServiceChapters() {
    const chapters = $$(".service-chapter");
    if (!chapters.length) return;
    // Solo sostener una escena cuando todo su contenido cabe en la pantalla.
    const measure = () => chapters.forEach((chapter) => {
        const article = chapter.querySelector("article");
        const navHeight = $("#nav").getBoundingClientRect().height;
        chapter.classList.toggle("can-hold", article.offsetHeight + navHeight + 80 <= window.innerHeight);
    });
    measure();
    window.addEventListener("resize", measure, { passive: true });
    if ("ResizeObserver" in window) {
        const sizing = new ResizeObserver(measure);
        chapters.forEach((chapter) => sizing.observe(chapter.querySelector("article")));
    }
    // Mover cada composición completa conserva la alineación de todos sus textos.
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scenes = chapters.map((chapter) => ({ chapter, target: chapter.querySelector("article") }));
    const heading = $(".services-heading");
    if (heading) scenes.unshift({ chapter: heading, target: heading });
    scenes.forEach(({ target }) => target.classList.add("service-motion-target"));
    let frame = 0;
    function paintTitles() {
        frame = 0;
        if (motionPreference.matches) {
            scenes.forEach(({ target }) => { ["--r", "--p", "--s"].forEach((v) => target.style.removeProperty(v)); });
            return;
        }
        const viewport = window.innerHeight;
        const wide = window.innerWidth >= 1000 && viewport >= 760;
        // Leer todas las posiciones antes de escribir estilos.
        const positions = scenes.map(({ chapter, target }) => ({ target, rect: chapter.getBoundingClientRect() }));
        positions.forEach(({ target, rect }) => {
            if (rect.bottom < 0 || rect.top > viewport) return;
            const progress = Math.max(0, Math.min(1, (viewport * 0.85 - rect.top) / (rect.height + viewport * 0.35)));
            // --r destapa la imagen del portafolio (de abajo hacia arriba); --p mueve el brillo del título
            const reveal = Math.max(0, Math.min(1, progress * (wide ? 2.6 : 2.2)));
            target.style.setProperty("--r", (1 - Math.pow(1 - reveal, 3)).toFixed(3));
            target.style.setProperty("--p", progress.toFixed(3));
            // --s: la segunda imagen del portafolio sube y se apila sobre la primera
            const stack = Math.max(0, Math.min(1, (progress - 0.42) / 0.3));
            target.style.setProperty("--s", (stack * stack * (3 - 2 * stack)).toFixed(3));
        });
    }
    function scheduleTitles() {
        if (!frame) frame = requestAnimationFrame(paintTitles);
    }
    window.addEventListener("scroll", scheduleTitles, { passive: true });
    window.addEventListener("resize", scheduleTitles, { passive: true });
    window.addEventListener("load", scheduleTitles, { once: true });
    motionPreference.addEventListener("change", scheduleTitles);
    if (document.fonts) document.fonts.ready.then(scheduleTitles);
    scheduleTitles();
}

/* ---------- Proceso: línea de tiempo que avanza con el scroll ---------- */
function initProcessTimeline() {
    const list = $("#process-lines"), num = $("#pc-num");
    if (!list || !num) return;
    const items = $$("#process-lines li");
    let shown = 1, frame = 0;
    const paint = () => {
        frame = 0;
        const vh = window.innerHeight, line = vh * 0.5, r = list.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        list.style.setProperty("--fill", Math.max(0, Math.min(1, (line - r.top) / r.height)).toFixed(3));
        let active = 1;
        items.forEach((li, k) => {
            const lit = li.getBoundingClientRect().top < line;
            li.classList.toggle("on", lit || k === 0);
            if (lit) active = k + 1;
        });
        if (active !== shown) {
            shown = active;
            num.textContent = String(active).padStart(2, "0");
            num.classList.toggle("swap", false);
            void num.offsetWidth; // reinicia la animación del número
            num.classList.toggle("swap", true);
        }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    paint();
}

/* ---------- Movimiento del resto de la página ---------- */
window.addEventListener("DOMContentLoaded", () => {
    mountWorld();
    buildReel();
    initServiceChapters();
    initProcessTimeline();
    syncNav();
    const lines = $$("#process-lines li");

    const fallbackReveal = () => {
        lines.forEach((li) => li.classList.add("on"));
        if (reduceMotion || !("IntersectionObserver" in window)) return;
        document.documentElement.classList.add("reveal-on");
        const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        $$(".reveal-up").forEach((el) => io.observe(el));
    };
    if (!window.gsap || !window.ScrollTrigger || GAMA === "baja") { fallbackReveal(); return; }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    $$(".reveal-up").forEach((el) => gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
    // Los pasos se encienden en initProcessTimeline, sincronizados con la línea y el número
    gsap.from(ledger.querySelectorAll(".service-row"), { y: 26, autoAlpha: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: ledger, start: "top 85%", once: true } });
    gsap.from(".summary", { y: 30, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".summary", start: "top 90%", once: true } });
    gsap.from(".faq-item", { y: 20, autoAlpha: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: ".faq", start: "top 85%", once: true } });

    // La flecha del logo enseña una vez dónde tocar en el cotizador
    const firstCheck = ledger.querySelector(".service-row .check");
    if (firstCheck) {
        const guide = document.createElement("span"); guide.className = "tap-guide"; guide.setAttribute("aria-hidden", "true");
        guide.innerHTML = '<svg viewBox="0 0 28 28"><use href="#i-cursor"/></svg>';
        const ring = document.createElement("span"); ring.className = "tap-ring"; ring.setAttribute("aria-hidden", "true");
        ledger.append(ring, guide);
        ScrollTrigger.create({ trigger: ledger, start: "top 60%", once: true, onEnter: () => {
            if (selected.size) return;
            const lr = ledger.getBoundingClientRect(), cr = firstCheck.getBoundingClientRect();
            const x = cr.left - lr.left + cr.width / 2, y = cr.top - lr.top + cr.height / 2;
            gsap.set(ring, { x, y });
            gsap.timeline({ delay: 0.8 })
                .fromTo(guide, { x: x - 130, y: y + 80, autoAlpha: 0 }, { x: x - 8, y: y - 6, autoAlpha: 1, duration: 1, ease: "expo.out" })
                .to(guide, { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: "8px 4px" })
                .fromTo(ring, { scale: 0.3, autoAlpha: 0.9 }, { scale: 1.5, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, "<")
                .to(guide, { x: "-=26", y: "+=22", autoAlpha: 0, duration: 0.5, delay: 0.6 });
        } });
    }
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
});
