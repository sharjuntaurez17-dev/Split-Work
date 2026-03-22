import { useState } from "react";
import { C } from "./theme";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen  from "./pages/LoginScreen";

// Screens in order
const SCREENS = ["splash", "login", "home"];

// Thin phone-frame wrapper — every screen renders inside this
function PhoneFrame({ children }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: C.bg, gap: 26,
      padding: "24px 0",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div style={{
        width: 390, height: 780, borderRadius: 46,
        overflow: "hidden", position: "relative",
        boxShadow:
          "0 0 0 10px #0F151C, 0 0 0 12px #1E2A35, 0 32px 80px rgba(0,0,0,0.75)",
      }}>
        {children}
      </div>
    </div>
  );
}

// Placeholder home screen so login has somewhere to go
function HomeScreen() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#0F1923",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 12,
    }}>
      <div style={{ fontSize: 48 }}>🏠</div>
      <div style={{
        color: C.white, fontSize: 22, fontWeight: 700,
        fontFamily: "Georgia, serif",
      }}>Home</div>
      <div style={{
        color: "rgba(255,255,255,0.4)", fontSize: 13.5,
        fontFamily: "'DM Sans', sans-serif",
      }}>Coming soon…</div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("splash");

  const advance = () => {
    setScreen(s => {
      const idx = SCREENS.indexOf(s);
      return SCREENS[Math.min(idx + 1, SCREENS.length - 1)];
    });
  };

  return (
    <PhoneFrame>
      {screen === "splash" && <SplashScreen onDone={advance} />}
      {screen === "login"  && <LoginScreen  onLogin={advance} />}
      {screen === "home"   && <HomeScreen />}
    </PhoneFrame>
  );
}
