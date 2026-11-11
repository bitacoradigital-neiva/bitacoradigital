# Bitácora Digital — Design System

## Product context
Bitácora Digital is a one-person tech studio in Neiva, Huila (Colombia). Services: computer repair & optimization (from $60.000 COP, 24 h), Windows & Office installation with original licenses, websites/landing pages (from $500.000 COP, 3–5 days), promotional videos for social media (from $180.000 COP, 3–4 days), remote support for all Colombia. Audience: local small-business owners and people with slow computers, mostly on mobile. Primary conversion: WhatsApp contact and the on-page quote builder ("Arma tu cotización"). Language: Spanish (Colombia), friendly and direct, "tú".

## Landing structure (keep this content and order)
1. Floating nav: logo + "Bitácora Digital", links Servicios / Proceso / Precios / Preguntas, blue "Cotizar" button.
2. Hero: headline "Tecnología y diseño. Sin complicaciones." + lead "Reparamos y optimizamos tus computadores, creamos páginas web para tu negocio y producimos sus videos publicitarios." + buttons "Configurar cotización" (primary) and "Hablar por WhatsApp" + quick facts (Diagnóstico inicial: Gratis · Configuración básica: Desde 24 horas · Cobertura: Neiva y toda Colombia). Hero visual: a professional photoreal 3D laptop (space-gray, open, Bitácora "B" logo glowing on screen) — use the supplied laptop render image.
3. Services "¿Qué necesitas resolver hoy?" — 5 services (Página web, Computador lento, Windows y Office, Videos publicitarios, Soporte remoto), each with a short video/visual, 4 deliverable chips, price and CTA.
4. Process "Así trabajamos." — 4 sequential steps (Escríbenos por WhatsApp → Diagnóstico sin costo → Tus archivos, primero → Entrega).
5. Commitments "Así cuido tu equipo, tu dinero y tu tiempo." — 6 promises.
6. Quote builder "Arma tu cotización." — list of selectable services with prices + sticky summary with total and WhatsApp button.
7. Coverage "Desde Neiva para toda Colombia." — 3D night Earth globe with arcs from Neiva.
8. FAQ "Preguntas frecuentes." — accordion.
9. Closing "¿Hablamos?" + CTAs. 10. Footer.

## Brand & color (hard constraint)
- Logo: the supplied Bitácora Digital "B" logo image (blue B with small pixel squares). Always use the exact image; never initials or invented marks.
- Base: pure black #000000; elevated surfaces #0b0b0d, #111113, #161617; hairlines rgba(255,255,255,0.10–0.14).
- Text: #f5f5f7 primary, #a1a1a6 secondary.
- Brand blue: #2997ff (accents, highlights, light), #0071e3 (primary buttons). Blue light/glow may be used sparingly as lighting on 3D objects.
- WhatsApp green #25d366 only for WhatsApp actions.
- No other hues (no purple, pink, orange, neon green gradients).

## Typography
- Body/UI: "Inter" (400/500/600), 17px base, line-height 1.5.
- Display headlines: ONE of these per direction — "Unbounded", "Space Grotesk", or "Inter Tight" (600–700), tight tracking (-0.03 to -0.045em), large sizes. Sentence case. No all-caps label rows, no monospace labels.

## Shape, depth, motion
- Generous negative space, asymmetric editorial layouts allowed (not everything centered).
- Radii: 24–32px large cards, 16–20px media, full pills for buttons and chips.
- Depth through layered dark surfaces, soft deep black shadows, subtle glass (backdrop blur) on floating UI.
- Motion intent (describe/suggest, it will be implemented with GSAP + Three.js): scroll-scrubbed 3D laptop opening, sticky stacked service cards, word-by-word headline reveals, magnetic buttons, custom cursor on desktop.
- Must work at 375px mobile width; mobile is the main audience.
