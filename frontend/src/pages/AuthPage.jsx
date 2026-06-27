import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, username, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>[ ]</span>
          <span style={styles.brandName}>Task Tracker</span>
        </div>

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            style={mode === "login" ? styles.tabActive : styles.tab}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(""); }}
            style={mode === "register" ? styles.tabActive : styles.tab}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
            />
          </label>

          {mode === "register" && (
            <label style={styles.label}>
              Username
              <input
                type="text"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="yourname"
              />
            </label>
          )}

          <label style={styles.label}>
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="At least 8 characters"
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={submitting} style={styles.submit}>
            {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    padding: "32px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
  },
  brandMark: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    color: "var(--accent)",
    fontSize: "18px",
  },
  brandName: {
    fontWeight: 700,
    fontSize: "18px",
    letterSpacing: "-0.01em",
  },
  tabs: {
    display: "flex",
    gap: "4px",
    background: "var(--bg)",
    border: "1px solid var(--line)",
    borderRadius: "8px",
    padding: "4px",
    marginBottom: "24px",
  },
  tab: {
    flex: 1,
    padding: "8px 12px",
    border: "none",
    background: "transparent",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--ink-soft)",
  },
  tabActive: {
    flex: 1,
    padding: "8px 12px",
    border: "none",
    background: "var(--surface)",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--ink)",
    boxShadow: "var(--shadow)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--ink-soft)",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid var(--line)",
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--ink)",
    background: "var(--surface)",
  },
  error: {
    fontSize: "13px",
    color: "var(--danger)",
    background: "#FBEEEA",
    border: "1px solid #F0D4CB",
    borderRadius: "8px",
    padding: "10px 12px",
  },
  submit: {
    marginTop: "4px",
    padding: "11px",
    border: "none",
    borderRadius: "8px",
    background: "var(--accent)",
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
  },
};
