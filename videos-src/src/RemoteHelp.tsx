// Video del servicio "Soporte remoto": desde Neiva nos conectamos a tu computador,
// el cursor llega y el error queda solucionado. Empieza y termina en negro para repetirse sin corte.
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./brand";

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = Easing.spring({ damping: 13 });
const RED = "#ff5f57";

const Screen: React.FC<{ label: string; children?: React.ReactNode; style: React.CSSProperties }> = ({ label, children, style }) => (
  <div style={{ position: "absolute", width: 540, ...style }}>
    <div style={{ height: 360, borderRadius: 26, background: C.surface, border: `1px solid ${C.line}`, overflow: "hidden", position: "relative" }}>{children}</div>
    <div style={{ width: 610, height: 22, marginLeft: -35, borderRadius: "0 0 18px 18px", background: "#2a2a2c" }} />
    <div style={{ textAlign: "center", marginTop: 26, color: C.ink2, fontSize: 30, fontWeight: 600 }}>{label}</div>
  </div>
);

export const RemoteHelp: React.FC = () => {
  const frame = useCurrentFrame();
  const master = interpolate(frame, [0, 18, 192, 210], [0, 1, 1, 0], { ...clamp, easing: out });
  const linked = interpolate(frame, [40, 70], [0, 1], { ...clamp, easing: out });
  const fixed = frame >= 138;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily, opacity: master, perspective: 1800 }}>
      {/* Computador del técnico (Neiva) */}
      <Interactive.Div name="Neiva" style={{ position: "absolute", inset: 0, rotate: interpolate(frame, [0, 60], ["0 1 0 14deg", "0 1 0 8deg"], { ...clamp, easing: out }), opacity: interpolate(frame, [4, 20], [0, 1], clamp) }}>
        <Screen label="Bitácora Digital, en Neiva" style={{ left: 290, top: 300 }}>
          <div style={{ padding: 34, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ color: C.ink, fontSize: 32, fontWeight: 700 }}>Conectado</div>
            {[0.8, 0.6, 0.7].map((w, i) => <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: C.ink2, opacity: 0.45 }} />)}
            <div style={{ marginTop: 14, height: 150, borderRadius: 16, background: C.surface2, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.blue, fontSize: 26, fontWeight: 600 }}>Viendo tu pantalla</div>
          </div>
        </Screen>
      </Interactive.Div>

      {/* Línea de conexión con puntos que viajan */}
      <Interactive.Div name="Conexion" style={{ position: "absolute", left: 860, top: 470, width: 200, height: 40 }}>
        <div style={{ position: "absolute", left: 0, top: 18, height: 4, borderRadius: 2, background: C.blue, width: `${linked * 100}%` }} />
        {[0, 1, 2].map((i) => {
          const p = ((frame - 70 + i * 14) % 42) / 42;
          return <div key={i} style={{ position: "absolute", top: 12, left: `${p * 100}%`, width: 16, height: 16, borderRadius: 8, background: "#fff", opacity: frame > 72 ? 1 : 0 }} />;
        })}
        <div style={{ position: "absolute", left: "50%", top: -78, translate: "-50% 0", display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 999, background: C.surface2, border: `1px solid ${C.line}`, color: C.ink, fontSize: 24, fontWeight: 600, whiteSpace: "nowrap", opacity: interpolate(frame, [62, 74], [0, 1], clamp) }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.whatsapp} strokeWidth="2.4" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          Conexión segura
        </div>
      </Interactive.Div>

      {/* Computador del cliente */}
      <Interactive.Div name="Cliente" style={{ position: "absolute", inset: 0, rotate: interpolate(frame, [0, 60], ["0 1 0 -14deg", "0 1 0 -8deg"], { ...clamp, easing: out }), opacity: interpolate(frame, [10, 26], [0, 1], clamp) }}>
        <Screen label="Tu computador, en cualquier ciudad" style={{ left: 1090, top: 300 }}>
          {/* Ventana de error que se arregla */}
          <div style={{ position: "absolute", left: 40, top: 70, width: 460, padding: "28px 30px", borderRadius: 20, background: C.surface2, border: `1px solid ${fixed ? "rgba(37,211,102,0.45)" : "rgba(255,95,87,0.45)"}`, scale: interpolate(frame, [20, 36], [0.7, 1], { ...clamp, easing: pop, output: "perceptual-scale" }), opacity: interpolate(frame, [20, 30], [0, 1], clamp) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: fixed ? C.whatsapp : RED, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 800, scale: interpolate(frame, [138, 144, 152], [1, 1.35, 1], clamp) }}>{fixed ? "✓" : "!"}</div>
              <div style={{ color: C.ink, fontSize: 32, fontWeight: 700 }}>{fixed ? "Solucionado" : "Error al iniciar"}</div>
            </div>
            <div style={{ color: C.ink2, fontSize: 22, fontWeight: 500, marginTop: 14 }}>{fixed ? "Tu equipo quedó funcionando" : "El programa no responde"}</div>
            <div style={{ marginTop: 22, width: 170, height: 52, borderRadius: 26, background: fixed ? C.whatsapp : C.blueDeep, color: fixed ? "#04150a" : "#fff", fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", scale: interpolate(frame, [130, 134, 140], [1, 0.88, 1], clamp) }}>{fixed ? "Listo" : "Reparar"}</div>
          </div>
          {/* Cursor remoto con su etiqueta */}
          <div style={{ position: "absolute", left: 0, top: 0, opacity: interpolate(frame, [86, 94, 170, 180], [0, 1, 1, 0], clamp), translate: interpolate(frame, [86, 128], ["480px 320px", "160px 252px"], { ...clamp, easing: out }), scale: interpolate(frame, [128, 132, 138], [1, 0.85, 1], clamp) }}>
            <svg width="42" height="42" viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" fill={C.blue} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
            <div style={{ marginLeft: 30, marginTop: -6, padding: "6px 12px", borderRadius: 10, background: C.blue, color: "#fff", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>Técnico</div>
          </div>
        </Screen>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
