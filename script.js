"use strict";

const WHATSAPP_NUMBER = "573144321446";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktopMotion = window.matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)").matches;
const desktopParallax = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");
const desktopProcessLine = window.matchMedia("(min-width: 901px)");
if (!reducedMotion) document.documentElement.classList.add("motion-ready");
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

if (window.AOS?.init) {
    window.AOS.init({
        once: true,
        duration: reducedMotion ? 0 : 600,
        easing: "ease-out-cubic",
        offset: 55,
        disable: reducedMotion
    });
    if (!reducedMotion) document.documentElement.classList.add("aos-enabled");
} else {
    document.querySelectorAll("[data-aos]").forEach((element) => element.removeAttribute("data-aos"));
}

if (!reducedMotion && desktopMotion && window.tsParticles?.load) {
    window.tsParticles.load({
        id: "tsparticles",
        options: {
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            particles: {
                number: { value: 18, density: { enable: true, width: 900, height: 650 } },
                color: { value: ["#1685FF", "#48D7FF"] },
                opacity: { value: { min: 0.08, max: 0.2 } },
                size: { value: { min: 1, max: 2 } },
                links: { enable: true, distance: 150, color: "#48D7FF", opacity: 0.08, width: 1 },
                move: { enable: true, speed: 0.2, direction: "none", outModes: { default: "out" } }
            },
            detectRetina: true,
            interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } }
        }
    }).catch((error) => console.warn("No fue posible cargar el fondo de partículas.", error));
}

const typedTarget = document.getElementById("typed-service");
if (typedTarget && window.Typed) {
    if (reducedMotion) {
        typedTarget.textContent = "Soporte técnico";
    } else {
        new window.Typed(typedTarget, {
            strings: ["Soporte técnico", "Desarrollo web", "Diseño digital", "Instalación de programas"],
            typeSpeed: 45,
            backSpeed: 25,
            backDelay: 1400,
            loop: true,
            smartBackspace: true
        });
    }
} else if (typedTarget) {
    typedTarget.textContent = "Soporte técnico";
}

const processGrid = document.querySelector(".process-grid");
const processSteps = processGrid ? Array.from(processGrid.querySelectorAll(".process-step")) : [];
if (!reducedMotion && processGrid && processSteps.length) {
    processGrid.classList.add("is-scroll-animated");
    if ("IntersectionObserver" in window) {
        const processStepObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || desktopProcessLine.matches) return;
                entry.target.classList.add("is-reached");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.55, rootMargin: "0px 0px -15% 0px" });
        processSteps.forEach((step) => processStepObserver.observe(step));
    } else if (!desktopProcessLine.matches) {
        processSteps.forEach((step) => step.classList.add("is-reached"));
    }
}

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
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    if (!reducedMotion) {
        const hero = document.querySelector(".hero");
        const heroImage = document.querySelector(".hero-art-img");
        if (heroImage && !desktopParallax.matches) heroImage.style.transform = "";
        else if (hero && heroImage && hero.getBoundingClientRect().bottom > 0) {
            const parallaxOffset = Math.min(window.scrollY * 0.035, 26);
            heroImage.style.transform = `translate3d(0, ${-parallaxOffset.toFixed(2)}px, 0)`;
        }
    }
    if (!reducedMotion && processGrid && processSteps.length && desktopProcessLine.matches) {
        const gridTop = processGrid.getBoundingClientRect().top;
        const start = window.innerHeight * 0.82;
        const end = window.innerHeight * 0.42;
        const progress = Math.max(0, Math.min(1, (start - gridTop) / (start - end)));
        processGrid.style.setProperty("--process-progress", progress.toFixed(3));
        processSteps.forEach((step, index) => {
            const milestone = processSteps.length > 1 ? index / (processSteps.length - 1) : 0;
            if (progress >= milestone) step.classList.add("is-reached");
        });
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
