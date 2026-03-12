import { useState, useEffect } from "react";
import ProcessedLogo from "../components/ProcessedLogo";
import { C } from "../theme";

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay so the entrance animation is visible
    const t1 = setTimeout(() => setVisible(true), 120);
    // Auto-advance to next screen after 2.6 s
    const t2 = setTimeout(() => onDone?.(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      width: "100%", height: "100%",
      background: C.tealBg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>

      {/* Dot grid texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }} />

      {/* Logo + wordmark — spring-in */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "scale(1) translateY(0)"
          : "scale(0.78) translateY(22px)",
        transition: "opacity 0.55s ease-out, transform 0.65s cubic-bezier(0.34,1.56,0.64,1)",
      }}>

        {/* Logo + glow halo */}
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute", inset: -22, borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.teal}2A 0%, transparent 70%)`,
            filter: "blur(14px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <ProcessedLogo size={130} />
          </div>
        </div>

        {/* Wordmark */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            color: C.white, fontSize: 36, fontWeight: 800,
            fontFamily: "Georgia, serif", letterSpacing: "-0.5px", lineHeight: 1,
          }}>Splitwork</div>
          <div style={{
            color: C.white, fontSize: 12.5, fontWeight: 500,
            marginTop: 10, fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "1.1px", textTransform: "uppercase",
          }}>Fair chores. Happy homes.</div>
          <div style={{
            width: 46, height: 2.5, borderRadius: 2,
            background: `linear-gradient(90deg, ${C.darkSlate}CC, ${C.darkSlate}88)`,
            margin: "10px auto 0",
          }} />
        </div>
      </div>

      {/* Loading dots */}
      <div style={{
        position: "absolute", bottom: 54,
        display: "flex", gap: 9,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s 0.5s",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: i === 1 ? C.darkSlate : "#2A7A62",
            animation: `dot-bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
          }} />
        ))}
      </div>
    </div>
  );
}
