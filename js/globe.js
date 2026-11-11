// Globo 3D de cobertura: la Tierra de noche (foto de la NASA), Neiva al frente y líneas que salen hacia las ciudades.
// Se carga solo cuando la sección se acerca y solo en equipos que lo aguantan (lo decide index.html).
import * as THREE from "./three.module.min.js";

const NEIVA = [2.93, -75.28];
const CITIES = [
    ["Bogotá", 4.71, -74.07], ["Medellín", 6.24, -75.58], ["Cali", 3.45, -76.53],
    ["Barranquilla", 10.96, -74.8], ["Cartagena", 10.39, -75.48], ["Bucaramanga", 7.12, -73.12],
    ["Pereira", 4.81, -75.69], ["Pasto", 1.21, -77.28], ["Villavicencio", 4.14, -73.63],
    ["Cúcuta", 7.89, -72.5], ["Santa Marta", 11.24, -74.2], ["Leticia", -4.2, -69.94]
];
const BLUE = 0x2997ff;

function toVec(lat, lon, r = 1) {
    const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

export function start(host, { quality = "high", texture = "img/tierra-noche.webp" } = {}) {
    const canvas = host.querySelector("canvas");
    const label = host.querySelector(".globe-label");
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === "high", alpha: true, powerPreference: "low-power" });
    } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === "high" ? 2 : 1.25));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
    camera.position.set(0, 0, 3.7);

    const globe = new THREE.Group();
    const spin = new THREE.Group(); // gira suave; "globe" orienta Neiva hacia la cámara
    spin.add(globe);
    scene.add(spin);

    // Planeta: la Tierra de noche con las luces de las ciudades (NASA Black Marble, dominio público).
    // El globo aparece solo cuando la foto ya cargó, para que nunca se vea una esfera vacía.
    const tex = new THREE.TextureLoader().load(texture, () => host.classList.add("is-live"));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), new THREE.MeshBasicMaterial({ map: tex })));

    // Atmósfera: un borde azul tenue alrededor del planeta, más fuerte en el contorno (como se ve desde el espacio)
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.07, 64, 64), new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: "varying vec3 vN; void main(){ float i = pow(max(0.0, 0.66 - dot(vN, vec3(0.0, 0.0, 1.0))), 2.6); gl_FragColor = vec4(0.16, 0.59, 1.0, 1.0) * i * 1.4; }"
    })));

    // Líneas desde Neiva: arcos que suben más mientras más lejos queda la ciudad
    const from = toVec(...NEIVA);
    const arcs = [];
    const arcMat = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.8 });
    const pulseGeo = new THREE.SphereGeometry(0.0065, 10, 10);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cityMat = new THREE.PointsMaterial({ color: 0xf5f5f7, size: 0.028, depthWrite: false });
    const cityPts = [];
    CITIES.forEach(([, lat, lon], i) => {
        const to = toVec(lat, lon);
        const lift = 1 + 0.04 + from.distanceTo(to) * 2.4;
        const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(lift);
        const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), arcMat);
        line.geometry.setDrawRange(0, 0); // se dibuja de a poco al aparecer
        globe.add(line);
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        pulse.visible = false;
        globe.add(pulse);
        arcs.push({ curve, line, pulse, offset: i * 0.37, delay: i * 0.12 });
        cityPts.push(to.x * 1.002, to.y * 1.002, to.z * 1.002);
    });
    const cityGeo = new THREE.BufferGeometry();
    cityGeo.setAttribute("position", new THREE.Float32BufferAttribute(cityPts, 3));
    globe.add(new THREE.Points(cityGeo, cityMat));

    // Neiva: punto blanco y un anillo que late
    const neivaDot = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    neivaDot.position.copy(from);
    globe.add(neivaDot);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.026, 48), new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    ring.position.copy(from).multiplyScalar(1.003);
    ring.lookAt(from.clone().multiplyScalar(2));
    globe.add(ring);

    // Neiva mirando a la cámara, un poco arriba y a la izquierda del centro
    globe.quaternion.setFromUnitVectors(from.clone().normalize(), new THREE.Vector3(0, 0, 1));
    spin.rotation.set(0.18, -0.32, 0);

    // Mouse: el globo se inclina un poco hacia el puntero
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e) => {
        const r = host.getBoundingClientRect();
        tx = ((e.clientY - r.top) / r.height - 0.5) * 0.35;
        ty = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
    };
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

    const tmp = new THREE.Vector3();
    let running = false, raf = 0, t0 = 0, born = 0;
    function frame(now) {
        raf = requestAnimationFrame(frame);
        if (!t0) { t0 = now; born = now; }
        const t = (now - t0) / 1000, age = (now - born) / 1000;
        cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
        spin.rotation.x = 0.18 + cx + Math.sin(t * 0.25) * 0.03;
        spin.rotation.y = -0.32 + cy + Math.sin(t * 0.18) * 0.08;

        arcs.forEach((a) => {
            const grow = Math.min(1, Math.max(0, (age - a.delay) / 1.1));
            a.line.geometry.setDrawRange(0, Math.round(grow * 49));
            if (grow < 1) { a.pulse.visible = false; return; }
            const p = ((t * 0.32 + a.offset) % 1);
            a.pulse.visible = true;
            a.curve.getPoint(p, tmp);
            a.pulse.position.copy(tmp);
        });
        const beat = (t * 0.8) % 1;
        ring.scale.setScalar(1 + beat * 1.6);
        ring.material.opacity = 0.9 * (1 - beat);

        renderer.render(scene, camera);

        // Etiqueta "Neiva" (HTML) pegada al punto
        if (label) {
            neivaDot.getWorldPosition(tmp).project(camera);
            const x = (tmp.x * 0.5 + 0.5) * host.clientWidth, y = (-tmp.y * 0.5 + 0.5) * host.clientHeight;
            label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        }
    }
    const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; t0 = 0; raf = requestAnimationFrame(frame); }
        else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(host);
    return {
        stop() {
            running = false; cancelAnimationFrame(raf); io.disconnect(); if (ro) ro.disconnect();
            window.removeEventListener("pointermove", onMove);
            renderer.dispose();
            host.classList.remove("is-live");
        }
    };
}
