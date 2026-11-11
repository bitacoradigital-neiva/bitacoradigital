// Video del servicio "Videos publicitarios": una línea de tiempo de edición arma un reel
// que se ve en un celular vertical. Empieza y termina en negro para repetirse sin corte.
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./brand";

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Clips de la línea de tiempo (inicio y ancho en px)
const CLIPS = [
  { x: 0, w: 230, c: "#0071e3" },
  { x: 236, w: 170, c: "#2997ff" },
  { x: 412, w: 260, c: "#5aa9ff" },
  { x: 678, w: 190, c: "#0a4fa3" },
];
// Escenas del reel: cada una con su frase
const SCENES = [
  { from: 70, text: "Tu negocio", bg: "linear-gradient(160deg, #0071e3, #001a3d)" },
  { from: 104, text: "en video", bg: "linear-gradient(160deg, #2997ff, #00264f)" },
  { from: 138, text: "que vende", bg: "linear-gradient(160deg, #1f6fe0, #000)" },
];

export const ReelEdit: React.FC = () => {
  const frame = useCurrentFrame();
  const master = interpolate(frame, [0, 18, 192, 210], [0, 1, 1, 0], { ...clamp, easing: out });
  const head = interpolate(frame, [60, 180], [0, 868], clamp); // cabezal que recorre la línea de tiempo

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily, opacity: master, perspective: 1800 }}>
      {/* Editor */}
      <Interactive.Div
        name="Editor"
        style={{
          position: "absolute",
          left: 250,
          top: 330,
          width: 1000,
          height: 460,
          borderRadius: 30,
          background: C.surface,
          border: `1px solid ${C.line}`,
          padding: "40px 44px",
          display: "flex",
          flexDirection: "column",
          gap: 26,
          rotate: interpolate(frame, [0, 70], ["0 1 0 12deg", "0 1 0 6deg"], { ...clamp, easing: out }),
          scale: interpolate(frame, [0, 30], [0.93, 1], { ...clamp, easing: out, output: "perceptual-scale" }),
        }}
      >
        <div style={{ color: C.ink, fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>Editando tu reel</div>
        {/* Pistas: video, texto y música */}
        {[0, 1, 2].map((track) => (
          <div key={track} style={{ position: "relative", height: track === 0 ? 92 : 56, borderRadius: 14, background: C.surface2, overflow: "hidden" }}>
            {track === 0 &&
              CLIPS.map((cl, i) => (
                <div key={i} style={{ position: "absolute", top: 8, bottom: 8, left: cl.x + 8, width: cl.w, borderRadius: 10, background: cl.c, translate: interpolate(frame, [18 + i * 8, 44 + i * 8], ["0px 120px", "0px 0px"], { ...clamp, easing: out }) }} />
              ))}
            {track === 1 &&
              SCENES.map((s, i) => (
                <div key={i} style={{ position: "absolute", top: 8, bottom: 8, left: 8 + i * 290, width: 240, borderRadius: 10, background: "rgba(245,245,247,0.16)", border: "1px solid rgba(245,245,247,0.35)", color: C.ink, fontSize: 20, fontWeight: 600, display: "flex", alignItems: "center", paddingLeft: 14, opacity: interpolate(frame, [42 + i * 6, 52 + i * 6], [0, 1], clamp) }}>{s.text}</div>
              ))}
            {track === 2 && (
              <div style={{ position: "absolute", inset: 8, display: "flex", alignItems: "center", gap: 5, opacity: interpolate(frame, [50, 62], [0, 1], clamp) }}>
                {Array.from({ length: 70 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: 2, background: C.whatsapp, opacity: 0.7, height: `${30 + 60 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))}%` }} />
                ))}
              </div>
            )}
          </div>
        ))}
        {/* Cabezal de reproducción */}
        <div style={{ position: "absolute", left: 44 + 8 + head, top: 104, width: 4, height: 300, borderRadius: 2, background: C.ink, opacity: interpolate(frame, [56, 62], [0, 1], clamp) }}>
          <div style={{ position: "absolute", left: -9, top: -6, width: 22, height: 22, borderRadius: 11, background: C.ink }} />
        </div>
      </Interactive.Div>

      {/* Celular vertical con el reel */}
      <Interactive.Div
        name="Reel"
        style={{
          position: "absolute",
          left: 1255,
          top: 170,
          width: 400,
          height: 760,
          borderRadius: 56,
          background: "#0d0d0e",
          border: "10px solid #2a2a2c",
          overflow: "hidden",
          boxShadow: "0 50px 100px -30px rgba(0,0,0,0.95)",
          translate: interpolate(frame, [30, 64], ["0px 900px", "0px 0px"], { ...clamp, easing: out }),
          rotate: interpolate(frame, [30, 80], ["0 1 0 -24deg", "0 1 0 -10deg"], { ...clamp, easing: out }),
        }}
      >
        {SCENES.map((s, i) => {
          const end = i < SCENES.length - 1 ? SCENES[i + 1].from : 999;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", opacity: frame >= s.from && frame < end + 6 ? 1 : 0, clipPath: `inset(${interpolate(frame, [s.from, s.from + 10], [100, 0], { ...clamp, easing: out })}% 0 0 0)` }}>
              <div style={{ color: "#fff", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", textAlign: "center", translate: interpolate(frame, [s.from + 2, s.from + 16], ["0px 50px", "0px 0px"], { ...clamp, easing: out }), opacity: interpolate(frame, [s.from + 2, s.from + 12], [0, 1], clamp) }}>{s.text}</div>
            </div>
          );
        })}
        {/* Barra de progreso del reel */}
        <div style={{ position: "absolute", left: 24, right: 24, top: 22, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.25)" }}>
          <div style={{ height: "100%", borderRadius: 3, background: "#fff", width: `${interpolate(frame, [70, 180], [0, 100], clamp)}%` }} />
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Listo"
        style={{
          position: "absolute",
          left: 290,
          top: 190,
          padding: "22px 34px",
          borderRadius: 999,
          background: C.blueDeep,
          color: "#fff",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.85)",
          opacity: interpolate(frame, [168, 176], [0, 1], clamp),
          scale: interpolate(frame, [168, 186], [0.6, 1], { ...clamp, easing: Easing.spring({ damping: 12 }), output: "perceptual-scale" }),
          rotate: interpolate(frame, [168, 186], ["-6deg", "-3deg"], { ...clamp, easing: out }),
        }}
      >
        Listo en 3 a 4 días
      </Interactive.Div>
    </AbsoluteFill>
  );
};
