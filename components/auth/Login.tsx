import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";

type LoginProps = {
  onSuccess?: () => void; // opcional: se você quiser controlar o que acontece após logar
};

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      onSuccess?.();
      // se não tiver router ainda, não faz redirect aqui.
      // no próximo passo vamos conectar ao App.tsx (ou MainApp.tsx) com segurança.
    } catch (err: any) {
      setError(err?.message ?? "Falha no login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin, // depois ajustamos para /dashboard se você quiser
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err?.message ?? "Falha no login social.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Cashfy</h1>
        <p style={{ marginBottom: 16, color: "#6b7280" }}>Entre na sua conta para acessar o dashboard.</p>

        <form onSubmit={handleLogin}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com"
            type="email"
            required
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #d1d5db", marginBottom: 12 }}
          />

          <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Senha</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            required
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #d1d5db", marginBottom: 12 }}
          />

          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#991b1b", padding: 10, borderRadius: 10, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: loading ? "#9ca3af" : "#059669",
              color: "white",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 12,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button
            onClick={() => handleOAuth("google")}
            disabled={loading}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db", background: "white", cursor: "pointer" }}
          >
            Google
          </button>

          <button
            onClick={() => handleOAuth("github")}
            disabled={loading}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db", background: "white", cursor: "pointer" }}
          >
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
