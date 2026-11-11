// Video del servicio "Página web para tu negocio":
// una ventana del navegador arma una página, entra el celular con el botón de WhatsApp
// y llega el mensaje de un cliente. Empieza y termina en negro para repetirse sin corte.
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./brand";

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const URL_TEXT = "tunegocio.com";

export const WebBuild: React.FC = () => {
  const frame = useCurrentFrame();
  // Entrada y salida generales (bucle sin corte)
  const master = interpolate(frame, [0, 18, 192, 210], [0, 1, 1, 0], { ...clamp, easing: out });
  const typed = Math.round(interpolate(frame, [14, 44], [0, URL_TEXT.length], clamp));

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily, opacity: master, perspective: 1800 }}>
      {/* Ventana del navegador */}
      <Interactive.Div
        name="Navegador"
        style={{
          position: "absolute",
          left: 330,
          top: 170,
          width: 1060,
          height: 700,
          borderRadius: 28,
          background: C.surface,
          border: `1px solid ${C.line}`,
          overflow: "hidden",
          boxShadow: "0 60px 120px -40px rgba(0,0,0,0.9)",
          rotate: interpolate(frame, [0, 60], ["0 1 0 10deg", "0 1 0 4deg"], { ...clamp, easing: out }),
          scale: interpolate(frame, [0, 30], [0.92, 1], { ...clamp, easing: out, output: "perceptual-scale" }),
        }}
      >
        {/* Barra superior */}
        <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `1px solid ${C.line}` }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.85 }} />
          ))}
          <div style={{ marginLeft: 24, flex: 1, height: 36, borderRadius: 18, background: C.surface2, display: "flex", alignItems: "center", padding: "0 18px", color: C.ink2, fontSize: 20, fontWeight: 500 }}>
            {URL_TEXT.slice(0, typed)}
            <span style={{ width: 2, height: 22, marginLeft: 2, background: C.blue, opacity: typed < URL_TEXT.length && frame % 16 < 8 ? 1 : typed < URL_TEXT.length ? 0 : 0 }} />
          </div>
        </div>

        <div style={{ padding: "36px 44px", display: "flex", flexDirection: "column", gap: 26 }}>
          {/* Menú */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: interpolate(frame, [40, 56], [0, 1], clamp), translate: interpolate(frame, [40, 60], ["0px -16px", "0px 0px"], { ...clamp, easing: out }) }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.blue }} />
            <div style={{ width: 140, height: 14, borderRadius: 7, background: C.ink, opacity: 0.9 }} />
            <div style={{ flex: 1 }} />
            {[70, 80, 64].map((w, i) => <div key={i} style={{ width: w, height: 12, borderRadius: 6, background: C.ink2, opacity: 0.6 }} />)}
          </div>

          <div style={{ display: "flex", gap: 36 }}>
            {/* Título, texto y botón */}
            <div style={{ flex: 1.1, display: "flex", flexDirection: "column", gap: 16, paddingTop: 18 }}>
              {[0.95, 0.75].map((w, i) => (
                <div key={i} style={{ height: 34, borderRadius: 10, background: C.ink, width: `${interpolate(frame, [52 + i * 8, 80 + i * 8], [0, w * 100], { ...clamp, easing: out })}%` }} />
              ))}
              {[0.9, 0.82, 0.6].map((w, i) => (
                <div key={i} style={{ height: 13, borderRadius: 7, background: C.ink2, opacity: 0.55, marginTop: i === 0 ? 10 : 0, width: `${interpolate(frame, [66 + i * 5, 92 + i * 5], [0, w * 100], { ...clamp, easing: out })}%` }} />
              ))}
              <div style={{ marginTop: 18, width: 210, height: 58, borderRadius: 29, background: C.blueDeep, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 21, fontWeight: 600, scale: interpolate(frame, [80, 96], [0, 1], { ...clamp, easing: Easing.spring({ damping: 12 }) }) }}>
                Cotizar ahora
              </div>
            </div>
            {/* Imagen */}
            <div style={{ flex: 1, height: 300, borderRadius: 22, overflow: "hidden", background: `linear-gradient(135deg, ${C.blueDeep}, ${C.blue} 55%, #8fc8ff)`, clipPath: `inset(0 ${interpolate(frame, [76, 106], [100, 0], { ...clamp, easing: out })}% 0 0 round 22px)` }}>
              <div style={{ position: "absolute", width: 220, height: 220, borderRadius: 110, background: "rgba(255,255,255,0.18)", left: 190, top: 120 }} />
            </div>
          </div>

          {/* Tres tarjetas */}
          <div style={{ display: "flex", gap: 20 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, height: 120, borderRadius: 18, background: C.surface2, border: `1px solid ${C.line}`, padding: 20, display: "flex", flexDirection: "column", gap: 12, opacity: interpolate(frame, [96 + i * 6, 112 + i * 6], [0, 1], clamp), translate: interpolate(frame, [96 + i * 6, 120 + i * 6], ["0px 30px", "0px 0px"], { ...clamp, easing: out }) }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(41,151,255,0.25)" }} />
                <div style={{ width: "70%", height: 12, borderRadius: 6, background: C.ink, opacity: 0.8 }} />
                <div style={{ width: "50%", height: 10, borderRadius: 5, background: C.ink2, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>
      </Interactive.Div>

      {/* Celular con la versión móvil y el botón de WhatsApp */}
      <Interactive.Div
        name="Celular"
        style={{
          position: "absolute",
          left: 1240,
          top: 300,
          width: 330,
          height: 660,
          borderRadius: 52,
          background: "#0d0d0e",
          border: "10px solid #2a2a2c",
          boxShadow: "0 50px 100px -30px rgba(0,0,0,0.95)",
          overflow: "hidden",
          translate: interpolate(frame, [106, 136], ["0px 900px", "0px 0px"], { ...clamp, easing: out }),
          rotate: interpolate(frame, [106, 150], ["0 1 0 -26deg", "0 1 0 -12deg"], { ...clamp, easing: out }),
        }}
      >
        <div style={{ width: 110, height: 28, borderRadius: 14, background: "#000", margin: "14px auto 22px" }} />
        <div style={{ padding: "0 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ height: 150, borderRadius: 18, background: `linear-gradient(135deg, ${C.blueDeep}, ${C.blue})` }} />
          <div style={{ height: 22, width: "90%", borderRadius: 8, background: C.ink }} />
          <div style={{ height: 22, width: "65%", borderRadius: 8, background: C.ink }} />
          <div style={{ height: 10, width: "85%", borderRadius: 5, background: C.ink2, opacity: 0.55, marginTop: 6 }} />
          <div style={{ height: 10, width: "70%", borderRadius: 5, background: C.ink2, opacity: 0.55 }} />
          <div style={{ height: 82, borderRadius: 16, background: C.surface2, marginTop: 8 }} />
        </div>
        {/* Botón de WhatsApp: late y se hunde al tocarlo */}
        <div
          style={{
            position: "absolute",
            right: 22,
            bottom: 26,
            width: 76,
            height: 76,
            borderRadius: 38,
            background: C.whatsapp,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: interpolate(frame, [128, 142, 156, 160, 166], [0, 1, 1, 0.86, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.03c-.25.69-1.44 1.33-2 1.41-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.62-2.98-1.29-4.92-4.29-5.07-4.49-.15-.2-1.21-1.61-1.21-3.07s.77-2.18 1.04-2.48c.27-.3.6-.37.79-.37h.57c.18 0 .43-.07.67.51.25.6.84 2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.77 1.27 1.66 2.06 1.14 1.01 2.1 1.33 2.39 1.48.3.15.47.12.65-.07.17-.2.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.49.22.57.35.07.12.07.72-.18 1.4Z" /></svg>
        </div>
      </Interactive.Div>

      {/* Cursor que toca el botón */}
      <Interactive.Div
        name="Cursor"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: interpolate(frame, [136, 144, 176, 184], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [136, 158], ["1660px 1010px", "1478px 896px"], { ...clamp, easing: out }),
          scale: interpolate(frame, [156, 160, 166], [1, 0.85, 1], clamp),
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" fill="#fff" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" /></svg>
      </Interactive.Div>

      {/* Mensaje del cliente */}
      <Interactive.Div
        name="Mensaje"
        style={{
          position: "absolute",
          left: 1010,
          top: 218,
          padding: "22px 30px",
          borderRadius: "28px 28px 8px 28px",
          background: C.whatsapp,
          color: "#04150a",
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
          opacity: interpolate(frame, [162, 172], [0, 1], clamp),
          translate: interpolate(frame, [162, 180], ["0px 30px", "0px 0px"], { ...clamp, easing: out }),
          scale: interpolate(frame, [162, 180], [0.8, 1], { ...clamp, easing: Easing.spring({ damping: 14 }), output: "perceptual-scale" }),
        }}
      >
        Hola, quiero cotizar mi página
      </Interactive.Div>
    </AbsoluteFill>
  );
};
