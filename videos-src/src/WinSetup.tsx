// Video del servicio "Windows y Office": el sistema se instala, aparecen los programas
// y la licencia queda activada. Empieza y termina en negro para repetirse sin corte.
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./brand";

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = Easing.spring({ damping: 13 });

// Programas genéricos (sin logos de marcas)
const APPS = [
  { name: "Documentos", bg: C.blueDeep, glyph: "Aa" },
  { name: "Tablas", bg: "#0a4fa3", glyph: "∑" },
  { name: "Presentaciones", bg: C.blue, glyph: "▶" },
  { name: "Navegador", bg: "#1f6fe0", glyph: "◎" },
  { name: "Lector PDF", bg: "#3a3a3d", glyph: "PDF" },
  { name: "Antivirus", bg: "#2a2a2c", glyph: "✓" },
];

const R = 120;
const CIRC = 2 * Math.PI * R;

export const WinSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const master = interpolate(frame, [0, 18, 192, 210], [0, 1, 1, 0], { ...clamp, easing: out });
  const progress = interpolate(frame, [14, 70], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) });
  const done = frame >= 70;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily, opacity: master, perspective: 1800 }}>
      <Interactive.Div
        name="Pantalla"
        style={{
          position: "absolute",
          left: 300,
          top: 150,
          width: 1320,
          height: 780,
          borderRadius: 32,
          background: C.surface,
          border: `1px solid ${C.line}`,
          overflow: "hidden",
          rotate: interpolate(frame, [0, 70], ["0 1 0 -8deg", "0 1 0 -2deg"], { ...clamp, easing: out }),
          scale: interpolate(frame, [0, 30], [0.93, 1], { ...clamp, easing: out, output: "perceptual-scale" }),
        }}
      >
        {/* Anillo de instalación: al terminar se corre a la izquierda */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 520,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            left: interpolate(frame, [72, 100], [400, 40], { ...clamp, easing: out }),
          }}
        >
          <div style={{ position: "relative", width: 280, height: 280 }}>
            <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: "absolute", inset: 0, rotate: "-90deg" }}>
              <circle cx="140" cy="140" r={R} fill="none" stroke={C.surface2} strokeWidth="18" />
              <circle cx="140" cy="140" r={R} fill="none" stroke={done ? C.whatsapp : C.blue} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${CIRC * progress} ${CIRC}`} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, fontSize: done ? 96 : 64, fontWeight: 700, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
              {done ? "✓" : `${Math.round(progress * 100)}%`}
            </div>
          </div>
          <div style={{ color: C.ink, fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{done ? "Sistema instalado" : "Instalando sistema"}</div>
          <div style={{ color: C.ink2, fontSize: 28, fontWeight: 500 }}>Con controladores oficiales</div>
        </div>

        {/* Programas que aparecen */}
        <div style={{ position: "absolute", left: 620, top: 110, width: 620, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {APPS.map((a, i) => {
            const t = 96 + i * 6;
            return (
              <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(frame, [t, t + 8], [0, 1], clamp), scale: interpolate(frame, [t, t + 18], [0.4, 1], { ...clamp, easing: pop, output: "perceptual-scale" }) }}>
                <div style={{ width: 132, height: 132, borderRadius: 32, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: a.glyph.length > 2 ? 38 : a.glyph.length > 1 ? 50 : 60, fontWeight: 700, boxShadow: "0 20px 40px -18px rgba(0,0,0,0.8)" }}>{a.glyph}</div>
                <div style={{ color: C.ink, fontSize: 24, fontWeight: 600 }}>{a.name}</div>
              </div>
            );
          })}
        </div>

        {/* Licencia activada */}
        <div
          style={{
            position: "absolute",
            left: 640,
            bottom: 70,
            width: 580,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "24px 30px",
            borderRadius: 24,
            background: C.surface2,
            border: `1px solid rgba(37,211,102,0.35)`,
            opacity: interpolate(frame, [140, 150], [0, 1], clamp),
            translate: interpolate(frame, [140, 160], ["0px 40px", "0px 0px"], { ...clamp, easing: out }),
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 28, background: C.whatsapp, display: "flex", alignItems: "center", justifyContent: "center", color: "#04150a", fontSize: 32, fontWeight: 800, scale: interpolate(frame, [148, 162], [0, 1], { ...clamp, easing: pop }) }}>✓</div>
          <div>
            <div style={{ color: C.ink, fontSize: 32, fontWeight: 700 }}>Licencia original activada</div>
            <div style={{ color: C.ink2, fontSize: 24, fontWeight: 500 }}>A tu nombre, o LibreOffice sin costo</div>
          </div>
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Listo"
        style={{
          position: "absolute",
          left: 1210,
          top: 96,
          padding: "22px 34px",
          borderRadius: 999,
          background: C.blueDeep,
          color: "#fff",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.85)",
          opacity: interpolate(frame, [168, 176], [0, 1], clamp),
          scale: interpolate(frame, [168, 186], [0.6, 1], { ...clamp, easing: pop, output: "perceptual-scale" }),
          rotate: interpolate(frame, [168, 186], ["-8deg", "-4deg"], { ...clamp, easing: out }),
        }}
      >
        Listo desde 24 horas
      </Interactive.Div>
    </AbsoluteFill>
  );
};
