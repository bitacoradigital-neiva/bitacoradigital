# Seguridad de Bitácora Digital

Responsabilidad en este trabajo: Codex mantiene las protecciones y sus pruebas; los cambios de diseño deben conservarlas. No hay un servicio de vigilancia automática ni acceso concedido a las cuentas del propietario.

## Protecciones implementadas

- `vercel.json`: CSP, bloqueo de incrustación (`frame-ancestors 'none'` y `X-Frame-Options: DENY`), `nosniff`, ausencia de Referer y restricción de cámara, micrófono, geolocalización, pagos y USB.
- Meta CSP y referrer en las cuatro páginas HTML: protecciones del contenido también con servidores locales que no interpreten `vercel.json`. La protección contra incrustación requiere las cabeceras HTTP, no puede hacerse mediante meta.
- Scripts ejecutables únicamente del mismo origen. GSAP y ScrollTrigger 3.13.0 están en `assets/vendor/gsap-3.13.0/`, con sus avisos de licencia originales y SRI verificado. No se habilitan `unsafe-inline` ni `unsafe-eval` para JavaScript.
- Se permite `style-src 'unsafe-inline'` porque el diseño utiliza estilos inline y el motor inserta su CSS. Es una concesión limitada a estilos, no a scripts. Los videos del recorrido requieren `media-src blob:`.
- El botón del formulario nace deshabilitado. `script.js` lo habilita después de registrar el manejador que prepara el mensaje para WhatsApp. Si no puede hacerlo, queda un enlace directo de contacto.
- `assets/security/bootstrap.js` impide el envío tradicional de ese formulario incluso si falla otro script. `form-action 'none'` bloquea también envíos forzados que omitan los eventos. `method="post"` evita el fallback GET con datos en la URL si una versión sin CSP se abre sin JavaScript.
- `.vercelignore` excluye herramientas, producción, documentación, pruebas y patrones de credenciales del envío a Vercel. No elimina archivos locales y no sustituye la revisión del artefacto publicado.

## Reglas para cambios de diseño

1. Mantener el script `assets/security/bootstrap.js`, las meta CSP, el atributo `disabled` inicial del botón y las cabeceras de `vercel.json`.
2. Escribir código ejecutable en archivos JS locales. No introducir `onclick`, `onerror`, `javascript:`, `eval`, `new Function` ni scripts inline. Los bloques `application/ld+json` son datos estructurados, no código ejecutable.
3. No ampliar la CSP con comodines o permisos para scripts inline para resolver un error visual. Revisar primero el recurso bloqueado y su necesidad.
4. No agregar scripts, rastreadores, widgets ni formularios externos sin revisar su origen, destino de datos y compatibilidad con CSP.
5. No insertar contenido de usuarios con `innerHTML`. Usar `textContent`, atributos seguros y destinos validados. Los templates actuales proceden de datos locales controlados.
6. No poner claves, contraseñas, tokens ni archivos de cuentas en HTML, JS, JSON o assets públicos. Todo archivo entregado al navegador puede ser leído por el visitante.
7. Mantener `noopener noreferrer` al abrir WhatsApp y el destino fijo con `encodeURIComponent` para el texto.
8. Ejecutar las pruebas de seguridad tras modificar scripts, formularios, cabeceras o dependencias. Se debe preservar también la accesibilidad y el movimiento reducido.

## Pruebas

Requieren Node.js, Playwright y Chromium. No instalan paquetes automáticamente, no envían mensajes, no publican y utilizan datos ficticios sobre un servidor temporal local.

Si Playwright y Chromium están instalados normalmente:

```sh
node tests/security.cjs
```

Con instalaciones temporales de esta sesión:

```sh
BITACORA_PLAYWRIGHT=/tmp/bitacora-qa/node_modules/playwright \
BITACORA_CHROME=/tmp/bitacora-browsers/chromium-1254/chrome-linux64/chrome \
node tests/security.cjs
```

Comprobado el 12 de noviembre de 2026:
- Escritorio (1440 px) y móvil (390 px): CSP sin violaciones en el uso normal, librerías locales, cotizador y formulario.
- JavaScript desactivado, script principal bloqueado y todos los scripts bloqueados: botón deshabilitado, alternativa visible, sin envío por Enter ni datos en la URL.
- CSP: bloquea un script inline de prueba, un envío forzado del formulario y la incrustación en iframe.
- Videos iniciales mediante blob, scroll, páginas legales y redirección del cotizador funcionan con la política.

## Publicación y límites

Las pruebas aplican localmente las cabeceras de `vercel.json`; no prueban que ya estén publicadas. Después de desplegar, comprobar la respuesta HTTP de la portada, términos y privacidad. La configuración requiere el proyecto Vercel correcto y su directorio raíz apuntando a esta carpeta. Revisar también que los archivos excluidos no aparezcan en el artefacto final.

El propietario debe revisar MFA, sesiones, miembros, tokens y permisos en Vercel y el repositorio. La configuración de WAF, límites de consumo, alertas y registros depende de esa cuenta. Si una cuenta o el dispositivo están comprometidos, estas defensas del navegador no impiden a un atacante autorizado sustituir los archivos.

No se ha desplegado esta modificación ni se han cambiado cuentas. El código no tiene un panel de autenticación administrativo. Recargar la página no concede permisos.

Fuentes de configuración:
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/deployments/vercel-ignore
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
