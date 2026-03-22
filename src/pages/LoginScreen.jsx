import { useState } from "react";
import ProcessedLogo from "../components/ProcessedLogo";
import { C } from "../theme";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // Simulate async login — wire up real auth later
    setTimeout(() => { setLoading(false); onLogin?.(); }, 1200);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: `1.5px solid ${focused === field ? C.teal : "rgba(255,255,255,0.12)"}`,
    background: "rgba(255,255,255,0.06)",
    color: C.white,
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#0F1923",
      display: "flex", flexDirection: "column",
      alignItems: "center",
      overflowY: "auto",
      padding: "0 28px 40px",
    }}>

      {/* Top logo strip */}
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 8,
        paddingTop: 52, paddingBottom: 32,
      }}>
        <ProcessedLogo size={72} />
        <div style={{
          color: C.white, fontSize: 22, fontWeight: 800,
          fontFamily: "Georgia, serif", letterSpacing: "-0.3px",
        }}>Splitwork</div>
        <div style={{
          color: C.mint, fontSize: 12, fontWeight: 500,
          letterSpacing: "1px", textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
        }}>Fair chores. Happy homes.</div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "28px 24px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          color: C.white, fontSize: 20, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif", marginBottom: 6,
        }}>Welcome back</div>
        <div style={{
          color: "rgba(255,255,255,0.45)", fontSize: 13.5,
          fontFamily: "'DM Sans', sans-serif", marginBottom: 24,
        }}>Sign in to your household</div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Email */}
          <div>
            <label style={{
              color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.6px", textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 7,
            }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={inputStyle("email")}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.6px", textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 7,
            }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={inputStyle("password")}
            />
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginTop: -6 }}>
            <span style={{
              color: C.teal, fontSize: 12.5, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>Forgot password?</span>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              color: "#FF6B6B", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              background: "rgba(255,107,107,0.1)", borderRadius: 10,
              padding: "10px 14px", border: "1px solid rgba(255,107,107,0.2)",
            }}>{error}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              width: "100%", padding: "15px",
              borderRadius: 14, border: "none",
              background: loading
                ? "rgba(12,197,185,0.45)"
                : `linear-gradient(135deg, ${C.teal}, ${C.blueTeal})`,
              color: C.white, fontSize: 15.5, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: loading ? "none" : `0 6px 20px ${C.teal}44`,
            }}
            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.97)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        width: "100%", margin: "22px 0",
      }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        <span style={{
          color: "rgba(255,255,255,0.3)", fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
        }}>or continue with</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
      </div>

      {/* Social buttons */}
      <div style={{ display: "flex", gap: 12, width: "100%" }}>
        {["Google", "Apple"].map(name => (
          <button key={name} style={{
            flex: 1, padding: "13px",
            borderRadius: 14,
            border: "1.5px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: C.white, fontSize: 14, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
          }}>
            {name === "Google" ? "🔵" : "🍎"} {name}
          </button>
        ))}
      </div>

      {/* Sign up link */}
      <div style={{
        marginTop: 28, textAlign: "center",
        color: "rgba(255,255,255,0.4)", fontSize: 13.5,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Don't have an account?{" "}
        <span style={{ color: C.teal, fontWeight: 700, cursor: "pointer" }}>
          Sign up
        </span>
      </div>
    </div>
  );
}
