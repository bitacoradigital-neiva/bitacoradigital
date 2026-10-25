// Configuración
const WHATSAPP_NUMBER = "573144321446";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktopMotion = window.matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)").matches;
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const contactForm = document.getElementById("contact-form");
const serviceSelect = document.getElementById("servicio");
const yearSpan = document.getElementById("year");
const navbar = document.querySelector(".navbar");
const progressBar = document.getElementById("scroll-progress-bar");


if (window.lucide) {
    window.lucide.createIcons();
}

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

function setMenuOpen(isOpen) {
    if (!menuToggle || !navMenu) return;
    navMenu.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    const icon = menuToggle.querySelector("[data-lucide]");
    if (icon) {
        icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        if (window.lucide) window.lucide.createIcons();
    }
}

menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
});

document.querySelectorAll(".service-card .btn-consultar").forEach((button) => {
    button.addEventListener("click", () => {
        const service = button.closest(".service-card")?.dataset.service;
        if (serviceSelect && service) {
            const matchingOption = Array.from(serviceSelect.options).find((option) => option.value === service);
            if (matchingOption) serviceSelect.value = service;
        }
        document.getElementById("contacto")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    });
});

const officeNote = document.querySelector(".office-note");
function updateOfficeNote() {
    if (!officeNote || !serviceSelect) return;
    const selectedService = serviceSelect.value.toLowerCase();
    const shouldShow = selectedService.includes("office") || selectedService === "formateo e instalación de sistemas operativos".toLowerCase();
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
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
});

const floatingWhatsApp = document.getElementById("float-whatsapp");
floatingWhatsApp?.addEventListener("click", (event) => {
    event.preventDefault();
    const message = "Hola, Bitácora Digital. Me gustaría solicitar información sobre sus servicios.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

// La animación de entrada y los efectos que siguen al puntero no se ejecutan si se reduce el movimiento.
if (window.AOS) {
    window.AOS.init({
        once: true,
        duration: reducedMotion ? 0 : 650,
        easing: "ease-out-cubic",
        offset: 70,
        disable: reducedMotion
    });
} else {
    document.querySelectorAll("[data-aos]").forEach((element) => element.removeAttribute("data-aos"));
}

if (!reducedMotion && desktopMotion && window.tsParticles) {
    window.tsParticles.load({
        id: "tsparticles",
        options: {
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            particles: {
                number: { value: 38, density: { enable: true, width: 900, height: 650 } },
                color: { value: ["#1685FF", "#48D7FF"] },
                opacity: { value: { min: 0.12, max: 0.38 } },
                size: { value: { min: 1, max: 2.4 } },
                links: { enable: true, distance: 135, color: "#48D7FF", opacity: 0.12, width: 1 },
                move: { enable: true, speed: 0.35, direction: "none", outModes: { default: "out" } }
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
            typeSpeed: 48,
            backSpeed: 28,
            backDelay: 1500,
            loop: true,
            smartBackspace: true
        });
    }
} else if (typedTarget) {
    typedTarget.textContent = "Soluciones digitales";
}

if (!reducedMotion && desktopMotion && window.VanillaTilt) {
    window.VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 5,
        speed: 500,
        glare: true,
        "max-glare": 0.12
    });
}

const counters = document.querySelectorAll(".counter");
if (counters.length) {
    const countUp = (counter) => {
        const target = Number(counter.dataset.count);
        if (!Number.isFinite(target)) return;
        if (reducedMotion) {
            counter.textContent = String(target);
            return;
        }
        const start = performance.now();
        const duration = 1200;
        const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = String(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    };

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.45 });
        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach(countUp);
    }
}

const processGrid = document.querySelector(".process-grid");
if (processGrid && "IntersectionObserver" in window) {
    const processObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            processGrid.classList.add("is-visible");
            observer.disconnect();
        }
    }, { threshold: 0.2 });
    processObserver.observe(processGrid);
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
}

let scrollQueued = false;
window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(() => {
        navbar?.classList.toggle("scrolled", window.scrollY > 24);
        if (progressBar) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        scrollQueued = false;
    });
}, { passive: true });

const hero = document.querySelector(".hero");
const cursorGlow = document.querySelector(".hero-cursor-glow");
if (!reducedMotion && desktopMotion && hero && cursorGlow) {
    hero.addEventListener("pointermove", (event) => {
        const bounds = hero.getBoundingClientRect();
        cursorGlow.style.transform = `translate(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px) translate(-50%, -50%)`;
    }, { passive: true });
}

const submitButton = contactForm?.querySelector(".btn-whatsapp");
submitButton?.addEventListener("click", (event) => {
    if (reducedMotion) return;
    const bounds = submitButton.getBoundingClientRect();
    submitButton.style.setProperty("--ripple-x", `${event.clientX - bounds.left}px`);
    submitButton.style.setProperty("--ripple-y", `${event.clientY - bounds.top}px`);
    submitButton.classList.remove("is-rippling");
    requestAnimationFrame(() => submitButton.classList.add("is-rippling"));
    window.setTimeout(() => submitButton.classList.remove("is-rippling"), 600);
});

if (floatingWhatsApp && !reducedMotion) {
    const tooltip = document.createElement("span");
    tooltip.className = "whatsapp-tooltip";
    tooltip.textContent = "¿Hablamos?";
    tooltip.setAttribute("aria-hidden", "true");
    floatingWhatsApp.append(tooltip);
    window.setTimeout(() => {
        floatingWhatsApp.classList.add("show-tooltip");
        window.setTimeout(() => floatingWhatsApp.classList.remove("show-tooltip"), 4500);
    }, 5000);
}
