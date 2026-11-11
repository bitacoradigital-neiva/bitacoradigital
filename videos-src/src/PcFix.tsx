// Video del servicio "Tu computador va lento o se bloquea":
// el diagnóstico encuentra amenazas, las elimina y el medidor de velocidad sube.
// Empieza y termina en negro para repetirse sin corte.
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./brand";

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RED = "#ff5f57";
const GREEN = C.whatsapp;

const ITEMS = ["Malware en el inicio", "Programas basura", "Archivos temporales", "Controladores viejos"];

// Arco del medidor: 240° de recorrido
const R = 150;
const ARC = (2 * Math.PI * R * 240) / 360;

export const PcFix: React.FC = () => {
  const frame = useCurrentFrame();
  const master = interpolate(frame, [0, 18, 192, 210], [0, 1, 1, 0], { ...clamp, easing: out });
  const scan = interpolate(frame, [24, 96], [0, 100], clamp);
  const speed = interpolate(frame, [118, 168], [0.12, 0.94], { ...clamp, easing: out });
  const boot = Math.round(interpolate(frame, [118, 168], [220, 18], { ...clamp, easing: out }));
  const bootText = boot >= 60 ? `${Math.floor(boot / 60)} min ${String(boot % 60).padStart(2, "0")} s` : `${boot} s`;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily, opacity: master, perspective: 1800 }}>
      <Interactive.Div
        name="Ventana"
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
          display: "flex",
          rotate: interpolate(frame, [0, 70], ["1 0 0 8deg", "1 0 0 2deg"], { ...clamp, easing: out }),
          scale: interpolate(frame, [0, 30], [0.93, 1], { ...clamp, easing: out, output: "perceptual-scale" }),
        }}
      >
        {/* Medidor de velocidad */}
        <div style={{ width: 560, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ position: "relative", width: 380, height: 340 }}>
            <svg width="380" height="380" viewBox="0 0 380 380" style={{ position: "absolute", inset: 0 }}>
              <circle cx="190" cy="190" r={R} fill="none" stroke={C.surface2} strokeWidth="26" strokeLinecap="round" strokeDasharray={`${ARC} 9999`} transform="rotate(150 190 190)" />
              <circle cx="190" cy="190" r={R} fill="none" stroke={speed < 0.4 ? RED : C.blue} strokeWidth="26" strokeLinecap="round" strokeDasharray={`${ARC * speed} 9999`} transform="rotate(150 190 190)" />
            </svg>
            {/* Aguja */}
            <div style={{ position: "absolute", left: 186, top: 70, width: 8, height: 124, borderRadius: 4, background: C.ink, transformOrigin: "50% 120px", rotate: `${-120 + 240 * speed}deg` }} />
            <div style={{ position: "absolute", left: 172, top: 172, width: 36, height: 36, borderRadius: 18, background: C.ink }} />
          </div>
          <div style={{ color: C.ink2, fontSize: 30, fontWeight: 500, marginTop: -30 }}>Tiempo de encendido</div>
          <div style={{ color: speed < 0.4 ? RED : C.ink, fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{bootText}</div>
        </div>

        {/* Diagnóstico */}
        <div style={{ flex: 1, padding: "60px 64px", display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ color: C.ink, fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em" }}>
            {frame < 100 ? "Revisando tu equipo…" : "Equipo limpio"}
          </div>
          <div style={{ height: 14, borderRadius: 7, background: C.surface2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${scan}%`, borderRadius: 7, background: frame < 100 ? C.blue : GREEN }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
            {ITEMS.map((txt, i) => {
              const found = 34 + i * 14;
              const fixed = 100 + i * 7;
              const isFixed = frame >= fixed;
              return (
                <div
                  key={txt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                    padding: "22px 26px",
                    borderRadius: 20,
                    background: C.surface2,
                    border: `1px solid ${C.line}`,
                    opacity: interpolate(frame, [found, found + 10], [0, 1], clamp),
                    translate: interpolate(frame, [found, found + 16], ["40px 0px", "0px 0px"], { ...clamp, easing: out }),
                  }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: isFixed ? GREEN : RED, scale: interpolate(frame, [fixed, fixed + 4, fixed + 10], [1, 1.5, 1], clamp) }} />
                  <div style={{ flex: 1, color: C.ink, fontSize: 32, fontWeight: 600, textDecoration: isFixed ? "line-through" : "none", textDecorationColor: C.ink2, opacity: isFixed ? 0.55 : 1 }}>{txt}</div>
                  <div style={{ color: isFixed ? GREEN : RED, fontSize: 26, fontWeight: 600 }}>{isFixed ? "Eliminado" : "Encontrado"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Interactive.Div>

      {/* Sello final */}
      <Interactive.Div
        name="Listo"
        style={{
          position: "absolute",
          left: 1250,
          top: 96,
          padding: "22px 34px",
          borderRadius: 999,
          background: C.blueDeep,
          color: "#fff",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.85)",
          opacity: interpolate(frame, [166, 174], [0, 1], clamp),
          scale: interpolate(frame, [166, 184], [0.6, 1], { ...clamp, easing: Easing.spring({ damping: 12 }), output: "perceptual-scale" }),
          rotate: interpolate(frame, [166, 184], ["-8deg", "-4deg"], { ...clamp, easing: out }),
        }}
      >
        Listo en 24 horas
      </Interactive.Div>
    </AbsoluteFill>
  );
};
