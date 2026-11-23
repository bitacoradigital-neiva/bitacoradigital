/* ==========================================================================
   Bitácora Digital · interacción y movimiento
   ========================================================================== */
"use strict";

const WHATSAPP = "573144321446";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const touchScroll = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
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

/* ---------- Posiciones en caché ----------
   Medir posiciones (getBoundingClientRect) en cada cuadro del scroll obligaba al navegador a recalcular
   toda la página una y otra vez, y eso trababa el inicio en celulares. Ahora se mide una vez (y de nuevo
   solo si cambia el tamaño de la página) y en cada cuadro se compara contra window.scrollY. */
const LAYOUT = { valid: false, tops: new Map() };
function docTop(el) {
    if (!el) return 0;
    if (!LAYOUT.valid) { LAYOUT.tops.clear(); LAYOUT.valid = true; }
    if (!LAYOUT.tops.has(el)) LAYOUT.tops.set(el, el.getBoundingClientRect().top + window.scrollY);
    return LAYOUT.tops.get(el);
}
function invalidateLayout() { LAYOUT.valid = false; }
window.addEventListener("resize", invalidateLayout, { passive: true });
window.addEventListener("load", invalidateLayout);
if ("ResizeObserver" in window) new ResizeObserver(invalidateLayout).observe(document.documentElement);
if (document.fonts) document.fonts.ready.then(invalidateLayout);

/* ---------- Navegación: enlace activo y menú ---------- */
const navLinks = $$(".nav-links a");
const sections = navLinks.map((a) => $(a.getAttribute("href")));
let navTick = false;
function syncNav() {
    navTick = false;
    const mid = window.scrollY + window.innerHeight * 0.4;
    let active = -1;
    sections.forEach((sec, i) => { if (sec && docTop(sec) <= mid) active = i; });
    navLinks.forEach((a, i) => { if (a.classList.contains("is-active") !== (i === active)) a.classList.toggle("is-active", i === active); });
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

/* ---------- Botón flotante de WhatsApp ---------- */
const fab = $("#fab");
function syncFloating() {
    const showFab = window.scrollY > window.innerHeight * 0.7;
    if (fab.classList.contains("is-visible") !== showFab) fab.classList.toggle("is-visible", showFab);
}

/* ---------- Elige tu servicio: cada tarjeta abre la ficha del servicio ---------- */
function initPicker() {
    const light = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    $$(".svc-dlg").forEach((dlg) => {
        const v = dlg.querySelector("video");
        if (light && v) $$("source", v).forEach((src) => { src.src = src.getAttribute("src").replace(/\.mp4$/, "-m.mp4"); });
        dlg.addEventListener("close", () => { if (v) v.pause(); document.documentElement.classList.remove("dlg-open"); });
        // Tocar fuera de la ficha la cierra
        dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
        dlg.querySelector(".dlg-x").addEventListener("click", () => dlg.close());
    });
    // Videos de las tarjetas: solo se reproducen los que están a la vista (en gama baja queda la imagen fija)
    const pv = $$(".pick video");
    // Las tarjetas miden ~600 px: la versión de 960 px se ve igual de nítida y pesa la mitad (4 a la vez no traban)
    pv.forEach((v) => $$("source", v).forEach((src) => { src.src = src.getAttribute("src").replace(/\.mp4$/, "-m.mp4"); }));
    // En celulares y tablets las tarjetas muestran la imagen fija (4 videos a la vez traban el scroll); el video va en la ficha
    if (!light && pv.length && "IntersectionObserver" in window && !reduceMotion && !saveData && GAMA !== "baja") {
        // Se preparan una pantalla antes de llegar (la carga no coincide con el scroll) y arrancan uno tras otro
        const warm = new IntersectionObserver((entries) => entries.forEach((en) => {
            if (!en.isIntersecting) return; const v = en.target; warm.unobserve(v);
            if (v.preload !== "auto") { v.preload = "auto"; try { v.load(); } catch (e) {} }
        }), { rootMargin: "100% 0px 100% 0px" });
        let queue = Promise.resolve();
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
            const v = en.target;
            if (en.isIntersecting && !document.documentElement.classList.contains("dlg-open")) {
                queue = queue.then(() => new Promise((r) => setTimeout(() => { if (v._vis) { const pr = v.play(); if (pr) pr.catch(() => {}); } r(); }, 220)));
                v._vis = true;
            } else { v._vis = false; if (!v.paused) v.pause(); }
        }), { threshold: 0.5 });
        pv.forEach((v) => { warm.observe(v); io.observe(v); });
    }
    $$(".pick").forEach((btn) => btn.addEventListener("click", () => {
        const dlg = document.getElementById(btn.dataset.dlg);
        if (!dlg || typeof dlg.showModal !== "function") return;
        dlg.showModal();
        document.documentElement.classList.add("dlg-open");
        const v = dlg.querySelector("video");
        if (v && !reduceMotion && !saveData) { v.preload = "auto"; const pr = v.play(); if (pr) pr.catch(() => {}); }
    }));
}

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
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});
["name", "message"].forEach((n) => contactFields[n].addEventListener("input", () => {
    const f = contactFields[n].closest(".field");
    if (f.classList.contains("has-error")) { f.classList.remove("has-error"); contactFields[n].removeAttribute("aria-invalid"); f.querySelector(".field-error").textContent = ""; }
}));

// Solo habilitar el envío después de registrar el manejador que evita la navegación.
form.querySelector('button[type="submit"]').disabled = false;
$("#contact-fallback").hidden = true;

/* ---------- El recorrido Scroll World ----------
   Si existe assets/world/ia/manifest.json (lo escribe produccion/scroll-world/generar.sh) se usa la cadena
   generada con la skill (arquitectura A: piernas encadenadas, sin conectores). Si no, la versión gratuita
   con videos de stock. Cuando exista la cadena vertical nativa, el manifiesto trae "movilNativo": true. */
const WA_LINK = "https://wa.me/573144321446?text=" + encodeURIComponent("Hola, Bitácora Digital. Quiero información sobre sus servicios.");
const SCENES = [
    { id: "marca", label: "Bitácora Digital", free: "marca", scroll: 1.7, linger: 0.35,
      title: "Diseño, web y video para marcas que quieren verse profesionales.",
      body: "Páginas web, landing pages, videos publicitarios y software. Desde Neiva para toda Colombia.",
      tags: ["Páginas web", "Landing pages", "Video", "Software"] },
    { id: "web", label: "Páginas web", free: "web", linger: 0.3,
      title: "Sitios web con personalidad propia.",
      body: "Diseño a la medida, interfaces modernas y una presentación de marca que se adapta a cualquier pantalla.",
      tags: ["Diseño propio", "Celular primero"] },
    { id: "landing", label: "Landing pages", free: "landing", linger: 0.3,
      title: "Landing pages que llevan a la acción.",
      body: "Una estructura pensada para presentar tu producto y convertir visitas en mensajes de WhatsApp.",
      tags: ["Un objetivo claro", "Directo a WhatsApp"] },
    { id: "video", label: "Producción digital", free: "video", linger: 0.3,
      title: "Videos hechos con diseño, edición y animación.",
      body: "Publicidad, motion graphics y demos de páginas producidos en digital, sin cámaras ni estudio.",
      tags: ["Motion graphics", "Edición", "Redes sociales"] },
    { id: "software", label: "Software", free: "software", linger: 0.3,
      title: "Software que trabaja por ti.",
      body: "Reservas, pedidos o inventario en tiempo real, desde el celular o el computador.",
      tags: ["A tu medida", "Tiempo real"] },
    { id: "contacto", label: "Hablemos", free: "contacto", scroll: 1.5, linger: 0.4,
      title: "¿Creamos algo juntos?",
      body: "Cuéntanos tu idea y te enviamos una propuesta con precio.",
      cta: { primary: { label: "Elige tu servicio", href: "#cotizador" }, secondary: { label: "WhatsApp", href: WA_LINK } } }
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

/* ---------- Inicio en celulares y tablets: secciones normales (sin capas fijas) ----------
   En pantallas táctiles el recorrido con capas fijas (video detrás, textos encima, fundidos) trababa los
   teléfonos reales. Aquí cada escena es una sección más de la página: su video 3D arriba y su texto debajo,
   todo con el scroll nativo del teléfono. Los videos se reproducen solos al aparecer, uno a la vez. */
function mountStackedWorld(host) {
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const wide = window.innerWidth >= 700;
    const N = SCENES.length;
    host.innerHTML = '<div class="mw">' + SCENES.map((sc, i) => {
        const base = `assets/world/${sc.free}`;
        const src = wide ? `${base}-lite.mp4` : `${base}-m.mp4`;
        const poster = wide ? `${base}.webp` : `${base}-m.webp`;
        const cta = sc.cta ? `<div class="mw-cta"><a class="btn btn-light" href="${sc.cta.primary.href}">${esc(sc.cta.primary.label)}</a><a class="btn mw-ghost" href="${sc.cta.secondary.href}" target="_blank" rel="noopener noreferrer">${esc(sc.cta.secondary.label)}</a></div>` : "";
        return `<section class="mw-scene" aria-label="${esc(sc.label)}">
            <div class="mw-media"><video class="mw-video" muted loop playsinline preload="${i === 0 ? "metadata" : "none"}" ${i === 0 ? `poster="${poster}"` : `data-poster="${poster}"`} aria-hidden="true"><source src="${src}" type="video/mp4"></video></div>
            <div class="mw-copy wrap">
                <span class="mw-num">${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}</span>
                <h2 class="mw-title">${esc(sc.title)}</h2>
                <p class="mw-body">${esc(sc.body)}</p>
                ${sc.tags ? `<ul class="mw-tags">${sc.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
                ${cta}
            </div>
        </section>`;
    }).join("") + "</div>";
    document.documentElement.classList.add("mw-on");
    // Imágenes de espera bajo demanda: solo la primera escena carga de entrada; las demás al acercarse
    const lazyPosters = $$(".mw-video[data-poster]", host);
    if ("IntersectionObserver" in window) {
        const posterIO = new IntersectionObserver((entries) => entries.forEach((en) => {
            if (!en.isIntersecting) return;
            en.target.poster = en.target.dataset.poster; posterIO.unobserve(en.target);
        }), { rootMargin: "150% 0px 150% 0px" });
        lazyPosters.forEach((v) => posterIO.observe(v));
    } else lazyPosters.forEach((v) => { v.poster = v.dataset.poster; });
    const fallback = $("#world-fallback"); if (fallback) fallback.hidden = true;
    // Reproducción: solo el video que más se ve; en gama baja, ahorro de datos o movimiento reducido, solo la imagen
    if (reduceMotion || saveData || GAMA === "baja" || !("IntersectionObserver" in window)) return;
    const vids = $$(".mw-video", host), ratio = new Map();
    let current = null, pending = 0;
    const pick = () => {
        pending = 0;
        let best = null, bestR = 0.45;
        vids.forEach((v) => { const r = ratio.get(v) || 0; if (r > bestR) { best = v; bestR = r; } });
        if (best === current) return;
        if (current) current.pause();
        current = best;
        if (best) { best.preload = "auto"; const p = best.play(); if (p) p.catch(() => {}); }
    };
    const start = () => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => ratio.set(en.target, en.isIntersecting ? en.intersectionRatio : 0));
            if (!pending) pending = requestAnimationFrame(pick);
        }, { threshold: [0, 0.25, 0.45, 0.65, 0.85, 1] });
        vids.forEach((v) => io.observe(v));
    };
    // Los videos empiezan cuando la página ya cargó (mientras tanto se ve la imagen, igual a su primer cuadro)
    if (document.readyState === "complete") start(); else window.addEventListener("load", () => setTimeout(start, 150), { once: true });
}

async function mountWorld() {
    const host = $("#world");
    // Celulares con navegador moderno: el mismo recorrido que en computador, con fundidos y textos movidos por el
    // navegador (animaciones ligadas al scroll). Celulares sin ese soporte: secciones normales, para no trabarse.
    const touchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const scrollAnims = typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline: scroll()");
    if (host && touchDevice && (!scrollAnims || reduceMotion)) { mountStackedWorld(host); return; }
    if (!host || typeof mountScrollWorld !== "function") { document.documentElement.classList.add("no-world"); return; }
    // La cadena generada con IA (assets/world/ia/) solo se consulta si existe: poner MUNDO_IA = true cuando se genere.
    // Así no se gasta una consulta a la red al abrir la página, que retrasaba la aparición del recorrido.
    const MUNDO_IA = false;
    let ia = null;
    if (MUNDO_IA) { try { const r = await fetch("assets/world/ia/manifest.json", { cache: "no-store" }); if (r.ok) ia = await r.json(); } catch (e) { /* sin cadena generada */ } }
    const A = "#8EA4BF";
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
    const check = () => { t = false; const p = window.scrollY >= docTop(after) - 1; if (p !== past) { past = p; document.documentElement.classList.toggle("sw-past", p); } };
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
    // Full HD solo en computadores potentes; celulares, tablets y gama media reciben la versión 720p (mucho más liviana)
    const hd = GAMA === "alta" && window.innerWidth >= 1000 && !window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    reel.innerHTML = available.map((p, k) => {
        const real = ready[p.id];
        const media = real
            ? `<video class="piece-video" muted loop playsinline preload="none" poster="assets/reel/${p.id}${hd ? "" : "-720"}.webp" data-autoplay aria-label="${p.title}"><source src="assets/reel/${p.id}${hd ? "" : "-720"}.mp4" type="video/mp4"></video><button type="button" class="piece-play" aria-label="Reproducir ${p.title}"><span aria-hidden="true"></span></button>`
            : `<div class="piece-frame" aria-hidden="true"><span class="piece-letter">${p.tag}</span><span class="piece-bars"><i></i><i></i><i></i><i></i></span></div>`;
        return `<article class="piece${k === 0 || k === 3 ? " piece-wide" : ""}${real ? " has-video" : ""}">
            <div class="piece-media">${media}<span class="piece-badge">${real ? "Concepto demostrativo" : "Concepto en producción"}</span></div>
            <div class="piece-body"><p class="piece-format">${p.format}</p><h3>${p.title}</h3><p>${p.idea}</p></div>
        </article>`;
    }).join("");
    // En gama baja los videos de la galería no arrancan solos: se ven con su portada y se reproducen al tocar
    // Botón propio de reproducir/pausar (los controles del navegador recargaban la vista en el celular).
    // Al reproducirse un video, los demás se pausan.
    const allVids = [...reel.querySelectorAll("video.piece-video")];
    reel.querySelectorAll(".piece.has-video").forEach((art) => {
        const v = art.querySelector("video"), btn = art.querySelector(".piece-play");
        const title = v.getAttribute("aria-label");
        const sync = () => { art.classList.toggle("is-playing", !v.paused); btn.setAttribute("aria-label", (v.paused ? "Reproducir " : "Pausar ") + title); };
        v.addEventListener("play", () => { if (!hd) allVids.forEach((o) => { if (o !== v && !o.paused) o.pause(); }); sync(); });
        v.addEventListener("pause", sync);
        btn.addEventListener("click", () => { if (v.paused) { v.preload = "auto"; const pr = v.play(); if (pr) pr.catch(() => {}); } else v.pause(); });
    });
    // Solo se reproduce UN video a la vez (el que más se ve): varios videos a la vez trababan el celular
    if (!reduceMotion && !saveData && GAMA !== "baja" && "IntersectionObserver" in window) {
        const vids = [...reel.querySelectorAll("video[data-autoplay]")];
        const ratio = new Map();
        let current = null, pending = 0;
        // Computadores potentes: se reproducen todos los videos visibles. Resto: solo el que más se ve.
        const multi = hd;
        const pick = () => {
            pending = 0;
            if (multi) {
                vids.forEach((v) => {
                    const r = ratio.get(v) || 0;
                    if (r > 0.35 && v.paused) { v.preload = "auto"; const pr = v.play(); if (pr) pr.catch(() => {}); }
                    else if (r <= 0.05 && !v.paused) v.pause();
                });
                return;
            }
            let best = null, bestR = 0.55;
            vids.forEach((v) => { const r = ratio.get(v) || 0; if (r > bestR) { best = v; bestR = r; } });
            if (best === current) return;
            if (current) current.pause();
            current = best;
            if (best) { best.preload = "auto"; const pr = best.play(); if (pr) pr.catch(() => {}); }
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => ratio.set(en.target, en.isIntersecting ? en.intersectionRatio : 0));
            if (!pending) pending = requestAnimationFrame(pick);
        }, { threshold: [0, 0.3, 0.55, 0.75, 1] });
        vids.forEach((v) => io.observe(v));
        // Preparar cada video un poco antes de que llegue a la pantalla (el arranque del decodificador causaba
        // una pausa corta en celulares justo al entrar a la galería)
        warmUp(vids);
    }
}

/* ---------- Servicios: capítulos tipográficos con scroll nativo ---------- */
function initServiceChapters() {
    const chapters = $$(".service-chapter");
    if (!chapters.length || touchScroll) return;
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
        const firstTop = docTop(scenes[0].chapter), lastEnd = docTop(scenes[scenes.length - 1].chapter) + viewport * 3;
        if (window.scrollY + viewport < firstTop - viewport * 0.5 || window.scrollY > lastEnd) return;
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
    // La barra de avance es un elemento propio que se mueve con transform: así no se recalcula el estilo
    // de todos los pasos en cada cuadro (antes una variable heredada obligaba a hacerlo).
    const fill = document.createElement("span");
    fill.className = "process-fill"; fill.setAttribute("aria-hidden", "true");
    list.appendChild(fill);
    let shown = 1, frame = 0, lastFill = -1;
    const paint = () => {
        frame = 0;
        // 1) Primero se mide todo…
        const vh = window.innerHeight, top0 = docTop(list);
        if (window.scrollY + vh * 2 < top0 || window.scrollY > top0 + list.offsetHeight + vh) return;
        const line = vh * 0.5, r = list.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        const tops = items.map((li) => li.getBoundingClientRect().top);
        // 2) …y después se escribe (sin volver a medir en medio)
        const f = Math.round(Math.max(0, Math.min(1, (line - r.top) / r.height)) * 400) / 400;
        if (f !== lastFill) { lastFill = f; fill.style.transform = `scaleY(${f})`; }
        let active = 1;
        items.forEach((li, k) => {
            const lit = tops[k] < line;
            if (li.classList.contains("on") !== (lit || k === 0)) li.classList.toggle("on", lit || k === 0);
            if (lit) active = k + 1;
        });
        if (active !== shown) {
            shown = active;
            num.textContent = String(active).padStart(2, "0");
            num.classList.toggle("swap", false);
            requestAnimationFrame(() => num.classList.toggle("swap", true)); // reinicia la animación del número sin forzar un recálculo
        }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    paint();
}

/* ---------- Servicios: carrusel estilo portafolio ----------
   El desplazamiento lo hace el navegador (scroll horizontal con encaje): con el dedo es nativo y fluido.
   Las flechas y los puntos solo le indican a qué tarjeta ir. */
function initServicesCarousel() {
    const track = $("#svc-track");
    if (!track) return;
    const slides = $$(".svc-slide", track), dots = $$(".svc-dots button"), prev = $(".svc-prev"), next = $(".svc-next");
    let current = 0;
    // Celulares y tablets: videos livianos (854 px) para que el cambio de tarjeta no trabe
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        $$("video source", track).forEach((src) => { src.src = src.getAttribute("src").replace(/\.mp4$/, "-m.mp4"); });
        $$("video", track).forEach((v) => { try { v.load(); } catch (e) {} });
    }
    // El video de la tarjeta siguiente se prepara por adelantado (llega listo al cambiar)
    const warmNext = (i) => {
        const v = slides[(i + 1) % slides.length].querySelector("video");
        if (v && v.preload !== "auto") { v.preload = "auto"; try { v.load(); } catch (e) {} }
    };
    const go = (i) => {
        const k = Math.max(0, Math.min(slides.length - 1, i));
        track.scrollTo({ left: slides[k].offsetLeft - slides[0].offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    };
    const mark = (i) => {
        if (i === current && dots[i] && dots[i].getAttribute("aria-current") === "true") return;
        current = i;
        warmNext(i);
        dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === slides.length - 1;
    };
    prev && prev.addEventListener("click", () => go(current - 1));
    next && next.addEventListener("click", () => go(current + 1));
    dots.forEach((d, k) => d.addEventListener("click", () => go(k)));
    track.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
    });
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
            if (en.isIntersecting && en.intersectionRatio >= 0.6) mark(slides.indexOf(en.target));
        }), { root: track, threshold: [0.6] });
        slides.forEach((s) => io.observe(s));
    }
    mark(0);

    // Avance automático cada 6 s (vuelve a la primera tras la última). Se detiene mientras la persona
    // interactúa, cuando la sección no está en pantalla o la pestaña está oculta, y con "reducir movimiento".
    const carousel = track.closest(".svc-carousel");
    const DELAY = 6000;
    let timer = 0, inView = false, hover = false, pageScrollAt = 0;
    // Si la persona está desplazando la página, el carrusel espera (dos movimientos a la vez traban el celular)
    window.addEventListener("scroll", () => { pageScrollAt = performance.now(); }, { passive: true });
    const schedule = (wait = DELAY) => {
        clearTimeout(timer);
        if (reduceMotion || !inView || hover || document.hidden) return;
        timer = setTimeout(() => {
            if (performance.now() - pageScrollAt < 1200) { schedule(1500); return; }
            go(current >= slides.length - 1 ? 0 : current + 1); schedule();
        }, wait);
    };
    if ("IntersectionObserver" in window && carousel) {
        new IntersectionObserver(([en]) => { inView = en.isIntersecting && en.intersectionRatio >= 0.5; schedule(); }, { threshold: [0, 0.5] }).observe(carousel);
    }
    if (carousel) {
        carousel.addEventListener("mouseenter", () => { hover = true; schedule(); });
        carousel.addEventListener("mouseleave", () => { hover = false; schedule(); });
        // Tocar, deslizar o usar las flechas/puntos reinicia la cuenta (no cambia en medio de la interacción)
        ["pointerdown", "keydown", "wheel"].forEach((ev) => carousel.addEventListener(ev, () => schedule(), { passive: true }));
        track.addEventListener("scroll", () => { clearTimeout(timer); clearTimeout(track._st); track._st = setTimeout(() => schedule(), 400); }, { passive: true });
    }
    document.addEventListener("visibilitychange", () => schedule());
}

/* ---------- Servicios: los videos 3D se reproducen solo mientras se ven ---------- */
function initServiceVideos() {
    const vids = $$(".svc-video");
    if (!vids.length || !("IntersectionObserver" in window)) return;
    // En gama baja, ahorro de datos o movimiento reducido se queda la portada (la imagen fija)
    if (reduceMotion || saveData || GAMA === "baja") return;
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting && en.intersectionRatio >= 0.35) { v.preload = "auto"; const p = v.play(); if (p) p.catch(() => {}); }
        else if (!v.paused) v.pause();
    }), { threshold: [0, 0.35, 0.7] });
    vids.forEach((v) => io.observe(v));
    warmUp(vids);
}
// Precarga de videos cuando están a ~1 pantalla de distancia: llegan listos y el arranque no traba el scroll
function warmUp(vids) {
    // En celulares, cargar al entrar en pantalla evita preparar varios decodificadores durante el scroll.
    if (touchScroll || !("IntersectionObserver" in window)) return;
    const wio = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const v = en.target; wio.unobserve(v);
        if (v.preload !== "auto") { v.preload = "auto"; try { v.load(); } catch (e) {} }
    }), { rootMargin: "100% 0px 100% 0px" });
    vids.forEach((v) => wio.observe(v));
}

/* ---------- Movimiento del resto de la página ---------- */
// Lo que está debajo del recorrido se prepara cuando el navegador está libre: así el arranque (lo primero que
// se toca y se desliza) no compite con el armado de la galería, las animaciones de aparición y los servicios.
const whenIdle = (fn, timeout = 1500) => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout }) : setTimeout(fn, 400));
window.addEventListener("DOMContentLoaded", () => {
    mountWorld();
    whenIdle(syncNav, 800);   // medir el menú activo en un momento libre (al abrir obligaba a medir toda la página)
    whenIdle(initRest);
});
// Se prepara por partes, una en cada momento libre del navegador, para que ninguna congele la pantalla
// Las secciones de abajo empiezan sin calcular (content-visibility) para que el arranque sea liviano;
// aquí se calculan de a una en momentos libres. Si se toca un enlace del menú antes, se calculan todas y se salta.
function revealAllSections() { document.documentElement.classList.add("cv-off"); invalidateLayout(); }
const lazySections = () => $$(".after > section, .after > footer").map((sec) => () => { sec.classList.add("cv-on"); invalidateLayout(); });
document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || document.documentElement.classList.contains("cv-off")) return;
    const hash = a.getAttribute("href");
    if (!hash || hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    revealAllSections();
    requestAnimationFrame(() => requestAnimationFrame(() => { target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); history.pushState(null, "", a.getAttribute("href")); }));
}, true);
function initRest() {
    const steps = [initPicker, initServicesCarousel, buildReel, initServiceChapters, initProcessTimeline, initServiceVideos, initAnimations];
    const next = () => { const f = steps.shift(); if (f) { f(); if (steps.length) whenIdle(next, 1000); } };
    next();
}
/* ---------- Animaciones de aparición (sin librerías) ----------
   CSS + IntersectionObserver + animaciones nativas del navegador: las mueve la tarjeta gráfica y no miden la
   página al cargar. Antes GSAP/ScrollTrigger tardaba ~0,3 s en prepararse y trababa el inicio en celulares. */
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
function initAnimations() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    // Tarjetas de servicios y preguntas frecuentes aparecen al entrar en pantalla (filas y preguntas escalonadas)
    $$(".pick").forEach((el, k) => { el.classList.add("reveal-up", "reveal-sm"); el.style.transitionDelay = `${k * 60}ms`; });
    $$(".faq-item").forEach((el, k) => { el.classList.add("reveal-up", "reveal-sm"); el.style.transitionDelay = `${(k % 8) * 50}ms`; });
    document.documentElement.classList.add("reveal-on");
    const revealIO = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal-up").forEach((el) => revealIO.observe(el));

}
