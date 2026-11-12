"use strict";

const WHATSAPP_NUMBER = "573144321446";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const contactForm = document.getElementById("contact-form");
const serviceSelect = document.getElementById("servicio");
const yearSpan = document.getElementById("year");
const navbar = document.querySelector(".navbar");
const progressBar = document.getElementById("scroll-progress-bar");
const floatingWhatsApp = document.getElementById("float-whatsapp");

if (window.lucide?.createIcons) window.lucide.createIcons();
if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll("[data-aos], .hero-visual");
if (!reducedMotion && "IntersectionObserver" in window && revealElements.length) {
    const revealGroups = new Map();
    revealElements.forEach((element) => {
        const delay = Number(element.getAttribute("data-aos-delay"));
        let index = 0;
        if (element.hasAttribute("data-aos-delay") && Number.isFinite(delay)) {
            index = Math.round(delay / 70);
        } else {
            const parent = element.parentElement;
            index = revealGroups.get(parent) ?? 0;
            revealGroups.set(parent, index + 1);
        }
        element.style.setProperty("--i", String(index));
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target;
            element.classList.add("is-entering", "is-revealed");
            const finishReveal = (event) => {
                if (event.target !== element || event.propertyName !== "opacity") return;
                element.classList.remove("is-entering");
                element.removeEventListener("transitionend", finishReveal);
            };
            element.addEventListener("transitionend", finishReveal);
            observer.unobserve(element);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealElements.forEach((element) => revealObserver.observe(element));
    document.documentElement.classList.add("reveal-ready");
}

const serviceMarquee = document.querySelector(".service-marquee");
if (!reducedMotion) serviceMarquee?.classList.add("is-animated");

function setMenuOpen(isOpen, returnFocus = false) {
    if (!menuToggle || !navMenu) return;
    navMenu.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    if (!isOpen && returnFocus) menuToggle.focus();
}

menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false, true);
    }
});

document.addEventListener("click", (event) => {
    if (
        menuToggle?.getAttribute("aria-expanded") === "true"
        && !navMenu?.contains(event.target)
        && !menuToggle.contains(event.target)
    ) setMenuOpen(false);
});

window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) setMenuOpen(false);
});

document.querySelectorAll(".service-card .btn-consultar").forEach((button) => {
    button.addEventListener("click", () => {
        const service = button.closest(".service-card")?.dataset.service;
        if (serviceSelect && service) {
            const option = Array.from(serviceSelect.options).find((item) => item.value === service);
            if (option) serviceSelect.value = service;
            serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
        document.getElementById("contacto")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        window.setTimeout(() => document.getElementById("nombre")?.focus({ preventScroll: true }), reducedMotion ? 0 : 450);
    });
});

const officeNote = document.querySelector(".office-note");
function updateOfficeNote() {
    if (!officeNote || !serviceSelect) return;
    const selectedService = serviceSelect.value.toLowerCase();
    const shouldShow = selectedService.includes("office") || selectedService === "formateo e instalación de sistemas operativos";
    officeNote.classList.toggle("is-visible", shouldShow);
    officeNote.setAttribute("aria-hidden", String(!shouldShow));
}
serviceSelect?.addEventListener("change", updateOfficeNote);
updateOfficeNote();

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const name = document.getElementById("nombre")?.value.trim();
    const service = serviceSelect?.value;
    const description = document.getElementById("descripcion")?.value.trim();
    if (!name || !service) return;

    const asksAboutLicense = service.toLowerCase().includes("office") || service.toLowerCase() === "formateo e instalación de sistemas operativos";
    const licenseQuestion = asksAboutLicense ? "\n¿Ya cuento con licencia original? (Sí / No)" : "";
    const descriptionLine = description ? `\nDetalles de mi solicitud: ${description}` : "";
    const message = `Hola, Bitácora Digital. Mi nombre es ${name} y estoy interesado en el servicio de ${service}. Me gustaría conocer el precio y la disponibilidad.${descriptionLine}${licenseQuestion}\nGracias.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

floatingWhatsApp?.addEventListener("click", (event) => {
    event.preventDefault();
    const message = "Hola, Bitácora Digital. Me gustaría solicitar información sobre sus servicios.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) return;
        document.querySelectorAll(".faq-item").forEach((other) => {
            if (other !== item) other.open = false;
        });
    });
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const activeLink = Array.from(navLinks).find((link) => link.getAttribute("href") === `#${entry.target.id}`);
            if (!activeLink) return;
            navLinks.forEach((link) => {
                const isActive = link === activeLink;
                link.classList.toggle("is-active", isActive);
                if (isActive) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
}

let scrollQueued = false;
function updateScrollEffects() {
    navbar?.classList.toggle("scrolled", window.scrollY > 24);
    if (progressBar) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.transform = `scaleX(${Math.min(progress, 100) / 100})`;
    }
}

function queueScrollEffects() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(() => {
        updateScrollEffects();
        scrollQueued = false;
    });
}

window.addEventListener("scroll", queueScrollEffects, { passive: true });
window.addEventListener("resize", queueScrollEffects, { passive: true });
updateScrollEffects();
