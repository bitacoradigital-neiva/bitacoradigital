# Components (vanilla HTML/CSS, single file)

Stack: static site, no framework. One page `index.html` with inline `<style>` and `<script>`; GSAP 3 + ScrollTrigger + Lenis from CDN; Three.js (vendored `js/three.module.min.js`) for `js/globe.js` and `js/logo3d.js`.

## Button (`index.html`, CSS `.btn`)
```css
.btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:48px; padding:0 24px; border-radius:980px; font-size:1.0625rem; font-weight:500; }
.btn-primary { background:#0071e3; color:#fff; }
.btn-whatsapp { background:#25d366; color:#04150a; }
.btn-glass { /* dark glass pill */ background:rgba(22,22,24,.62); border:1px solid rgba(255,255,255,.12); color:#f5f5f7; backdrop-filter: blur(20px) saturate(180%); }
```
## Service card (`.svc`)
Two-column card (text + 16:9 looping motion-graphic video), radius 28px, gradient #121214→#0c0c0d, 1px rgba(255,255,255,.08) border, category label in #2997ff, title in Unbounded, 4 pill chips, footer with price + "Ver precios" pill. Cards stack (position: sticky) on scroll.
## Promise card (`.promise`)
Tall dark card with a large thin-line blue icon (no box), title at bottom (Unbounded), muted paragraph. Horizontal scroll strip.
## Service row (quote builder `.service-row`)
Checkbox circle + name/desc + price/ETA; selected = 2px #2997ff inset ring.
