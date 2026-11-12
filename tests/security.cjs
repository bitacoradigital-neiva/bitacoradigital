// Run: BITACORA_PLAYWRIGHT=/path/to/playwright BITACORA_CHROME=/path/to/chrome node tests/security.cjs
const { chromium } = require(process.env.BITACORA_PLAYWRIGHT || 'playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json')));
const securityHeaders = config.headers.find(rule => rule.source === '/(.*)').headers;
const policy = securityHeaders.find(h => h.key === 'Content-Security-Policy').value;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.svg': 'image/svg+xml' };
const requests = [];
const server = http.createServer((req, res) => {
    requests.push({ method: req.method, url: req.url });
    if (!req.url.startsWith('/no-headers/')) securityHeaders.forEach(h => res.setHeader(h.key, h.value));
    const pathname = new URL(req.url, 'http://localhost').pathname.replace(/^\/no-headers/, '');
    if (pathname === '/frame-test') { res.setHeader('Content-Type', 'text/html'); return res.end('<iframe src="/index.html"></iframe>'); }
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
});
(async () => {
    assert(policy.includes("script-src 'self';"));
    assert(!policy.includes("script-src 'self' 'unsafe-inline'"));
    assert(!policy.includes('unsafe-eval'));
    assert(policy.includes("form-action 'none'"));
    assert(policy.includes("frame-ancestors 'none'"));
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    for (const [, src, sri] of html.matchAll(/<script[^>]*src="([^"]+)"[^>]*integrity="([^"]+)"/g)) {
        assert(!src.startsWith('http'));
        assert.equal('sha384-' + crypto.createHash('sha384').update(fs.readFileSync(path.join(root, src))).digest('base64'), sri);
    }
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ executablePath: process.env.BITACORA_CHROME || undefined, headless: true, args: ['--no-sandbox'] });
    try {
        for (const width of [1440, 390]) {
            const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
            const page = await context.newPage(); const errors = []; const external = [];
            page.on('pageerror', e => errors.push(e.message));
            await context.route('**/*', route => { const url = route.request().url(); if (url.startsWith(base) || url.startsWith('blob:')) return route.continue(); external.push(url); return route.abort(); });
            await page.addInitScript(() => { window.cspViolations = []; document.addEventListener('securitypolicyviolation', e => window.cspViolations.push(e.effectiveDirective)); window.open = url => { window.testOutgoing = url; return null; }; });
            await page.goto(base + '/index.html');
            await page.waitForSelector('#services-target input');
            assert.equal(await page.evaluate(() => window.gsap.version), '3.13.0');
            assert(await page.locator('#contact-form button[type=submit]').isEnabled());
            await page.locator('[data-id="wb2"] input').check(); await page.locator('[data-id="vd1"] input').check();
            assert((await page.locator('#total-val').innerText()).includes('990.000'));
            assert(new URL(await page.locator('#btn-wa-quote').getAttribute('href')).searchParams.get('text').includes('por cotizar'));
            const payload = '<img src=x onerror="window.securityCanary=1">';
            await page.locator('#cf-name').fill(payload); await page.locator('#cf-msg').fill(payload);
            await page.locator('#contact-form button[type=submit]').click();
            const outgoing = new URL(await page.evaluate(() => window.testOutgoing)); assert.equal(outgoing.origin, 'https://wa.me'); assert(outgoing.searchParams.get('text').includes(payload));
            assert.equal(await page.locator('img[onerror]').count(), 0);
            assert.equal(await page.evaluate(() => window.securityCanary), undefined);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
            assert.deepEqual(await page.evaluate(() => window.cspViolations), []);
            assert.deepEqual(errors, []); assert.deepEqual(external, []);
            for (const file of ['terminos.html', 'privacidad.html', 'cotizador.html']) { await page.goto(base + '/' + file); if (file === 'cotizador.html') await page.waitForURL('**/index.html#cotizador'); }
            assert.deepEqual(await page.evaluate(() => window.cspViolations), []);
            console.log(`PASS ${width}px: CSP, librerías locales, cotizador, formulario, páginas legales y redirección.`);
            await context.close();
        }
        // Fail-closed incluso sin las cabeceras del alojamiento (Live Server local).
        for (const scenario of ['no-js', 'main-blocked', 'all-scripts-blocked']) {
            const context = await browser.newContext({ javaScriptEnabled: scenario !== 'no-js', reducedMotion: 'reduce' });
            if (scenario !== 'no-js') await context.route('**/*', route => {
                const url = route.request().url();
                if ((scenario === 'main-blocked' && url.endsWith('/script.js')) || (scenario === 'all-scripts-blocked' && route.request().resourceType() === 'script')) return route.abort();
                return route.continue();
            });
            const page = await context.newPage(); await page.goto(base + '/no-headers/index.html');
            assert(await page.locator('#contact-form button[type=submit]').isDisabled());
            assert(await page.locator('#contact-fallback').isVisible());
            await page.locator('#cf-name').fill('Nombre de prueba'); await page.locator('#cf-msg').fill('Dato privado de prueba');
            const before = requests.length; await page.locator('#cf-name').press('Enter'); await page.waitForTimeout(150);
            assert.equal(new URL(page.url()).search, ''); assert(!requests.slice(before).some(r => r.method === 'POST' || r.url.includes('message=')));
            console.log(`PASS ${scenario}: no envío por Enter, sin datos en URL y alternativa WhatsApp visible.`); await context.close();
        }
        const page = await browser.newPage({ reducedMotion: 'reduce' });
        await page.addInitScript(() => { window.cspViolations = []; document.addEventListener('securitypolicyviolation', e => window.cspViolations.push(e.effectiveDirective)); });
        await page.goto(base + '/index.html');
        await page.evaluate(() => { const script = document.createElement('script'); script.textContent = 'window.injectedCodeExecuted=true'; document.body.append(script); document.querySelector('#contact-form').submit(); });
        await page.waitForTimeout(150);
        assert.equal(await page.evaluate(() => window.injectedCodeExecuted), undefined);
        const violations = await page.evaluate(() => window.cspViolations); assert(violations.includes('script-src-elem')); assert(violations.includes('form-action'));
        assert(!requests.some(r => r.method === 'POST' || r.url.includes('message=')));
        await page.goto(base + '/no-headers/frame-test'); await page.waitForTimeout(200);
        assert(await page.locator('iframe').evaluate(el => !el.contentDocument || !el.contentDocument.querySelector('#contact-form')));
        console.log('PASS CSP bloquea script inline, envío forzado e incrustación en iframe.');
        // La política debe permitir videos blob y el motor real, con movimiento activado.
        const motion = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await motion.addInitScript(() => { window.cspViolations = []; document.addEventListener('securitypolicyviolation', e => window.cspViolations.push(e.effectiveDirective)); });
        await motion.goto(base + '/index.html'); await motion.waitForSelector('.sw-scene');
        await motion.waitForFunction(() => [...document.querySelectorAll('.sw-scene video')].some(v => v.readyState >= 2), { timeout: 30000 });
        await motion.locator('#svc-web').scrollIntoViewIfNeeded(); await motion.waitForTimeout(150);
        assert.deepEqual(await motion.evaluate(() => window.cspViolations), []);
        console.log('PASS videos iniciales y scroll con CSP activa, sin violaciones.');
    } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
