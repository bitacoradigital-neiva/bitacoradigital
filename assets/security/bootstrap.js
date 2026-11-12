"use strict";
// Se ejecuta antes del código de diseño; CSP permite únicamente scripts locales.
document.documentElement.classList.add("js");
// Defensa adicional si otro script falla: jamás enviar estos datos al alojamiento.
document.addEventListener("submit", (event) => {
    if (event.target instanceof HTMLFormElement && event.target.id === "contact-form") {
        event.preventDefault();
    }
}, true);
