// Logo "B" de Bitácora Digital en 3D: metal azul con bordes de luz, rodeado de partículas.
// Gira solo, se inclina hacia el mouse y da media vuelta con el scroll.
// Lo carga index.html solo en equipos que lo aguantan; en el resto queda la imagen fija del logo.
import * as THREE from "./three.module.min.js";

// Contorno de la "B" (unidades libres, eje Y hacia arriba)
function bShape() {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(14, 0);
    s.absarc(14, 9.25, 9.25, -Math.PI / 2, Math.PI / 2, false); // panza de abajo
    s.lineTo(12.5, 18.5);
    s.absarc(13, 26.75, 8.25, -Math.PI / 2, Math.PI / 2, false); // panza de arriba
    s.lineTo(0, 35);
    s.lineTo(0, 0);
    const hole = (y0, y1) => {
        const h = new THREE.Path();
        const r = (y1 - y0) / 2;
        h.moveTo(7, y0);
        h.lineTo(13, y0);
        h.absarc(13, y0 + r, r, -Math.PI / 2, Math.PI / 2, false);
        h.lineTo(7, y1);
        h.lineTo(7, y0);
        return h;
    };
    s.holes.push(hole(6, 12.5), hole(22.5, 31));
    return s;
}

export function start(host, { quality = "high" } = {}) {
    const canvas = host.querySelector("canvas");
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === "high", alpha: true, powerPreference: quality === "high" ? "high-performance" : "low-power" });
    } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === "high" ? 2 : 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
    camera.position.set(0, 0, 128);

    // Logo extruido con bisel suave
    const geo = new THREE.ExtrudeGeometry(bShape(), { depth: 7, bevelEnabled: true, bevelThickness: 1.4, bevelSize: 1.1, bevelSegments: quality === "high" ? 6 : 3, curveSegments: quality === "high" ? 40 : 20 });
    geo.center();
    const metal = new THREE.MeshStandardMaterial({ color: 0x0a3a8c, metalness: 0.75, roughness: 0.28, emissive: 0x061a3d, emissiveIntensity: 0.6 });
    const logo = new THREE.Mesh(geo, metal);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 28), new THREE.LineBasicMaterial({ color: 0x7cc4ff, transparent: true, opacity: 0.85 }));
    logo.add(edges);

    // Los dos "píxeles" del logo, a la izquierda
    const cubeGeo = new THREE.BoxGeometry(3.4, 3.4, 3.4);
    [[-16, 4], [-12, 10.5]].forEach(([x, y]) => {
        const c = new THREE.Mesh(cubeGeo, metal);
        c.position.set(x, y, 0);
        c.add(new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeo), edges.material));
        logo.add(c);
    });

    const pivot = new THREE.Group();
    pivot.add(logo);
    scene.add(pivot);

    // Luces: una blanca de frente, dos azules que giran alrededor para que el metal brille
    scene.add(new THREE.AmbientLight(0x8fb8ff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-30, 40, 60);
    scene.add(key);
    const blueA = new THREE.PointLight(0x2997ff, 900, 0, 1.6);
    const blueB = new THREE.PointLight(0x5ab0ff, 600, 0, 1.6);
    scene.add(blueA, blueB);

    // Campo de partículas en una cáscara esférica
    const N = quality === "high" ? 1600 : 600;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const r = 34 + Math.random() * 26, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        pos[i * 3 + 2] = r * Math.cos(ph);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x9ccfff, size: quality === "high" ? 0.32 : 0.42, transparent: true, opacity: 0.7, depthWrite: false }));
    scene.add(dust);

    // Mouse y scroll
    let tx = 0, ty = 0, cx = 0, cy = 0, scrollP = 0, sp = 0;
    const onMove = (e) => { tx = (e.clientY / window.innerHeight - 0.5) * 0.5; ty = (e.clientX / window.innerWidth - 0.5) * 0.8; };
    if (window.matchMedia("(pointer: fine)").matches) window.addEventListener("pointermove", onMove, { passive: true });

    function size() {
        const w = host.clientWidth, h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    size();
    const ro = "ResizeObserver" in window ? new ResizeObserver(size) : null;
    if (ro) ro.observe(host);

    let running = false, raf = 0, t0 = 0, born = 0;
    function frame(now) {
        raf = requestAnimationFrame(frame);
        if (!t0) t0 = now;
        if (!born) born = now;
        const t = (now - t0) / 1000;
        const intro = Math.min(1, (now - born) / 1600); // el logo llega girando la primera vez
        const e = 1 - Math.pow(1 - intro, 3);
        cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06; sp += (scrollP - sp) * 0.1;

        pivot.rotation.x = cx + Math.sin(t * 0.6) * 0.06;
        pivot.rotation.y = cy + Math.sin(t * 0.4) * 0.35 + sp * Math.PI + (1 - e) * -2.4;
        pivot.position.y = Math.sin(t * 0.9) * 1.2;
        pivot.scale.setScalar(0.6 + 0.4 * e);

        blueA.position.set(Math.cos(t * 0.7) * 40, 18, Math.sin(t * 0.7) * 40);
        blueB.position.set(Math.cos(t * 0.5 + 2) * -36, -20, Math.sin(t * 0.5 + 2) * 36);
        dust.rotation.y = t * 0.03 + sp * 0.6;
        dust.rotation.x = t * 0.015;

        renderer.render(scene, camera);
    }
    const io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !running) { running = true; t0 = 0; raf = requestAnimationFrame(frame); }
        else if (!en.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(host);
    host.classList.add("is-live");

    return {
        setScroll(p) { scrollP = p; },
        stop() {
            running = false; cancelAnimationFrame(raf); io.disconnect(); if (ro) ro.disconnect();
            window.removeEventListener("pointermove", onMove);
            renderer.dispose();
            host.classList.remove("is-live");
        }
    };
}
