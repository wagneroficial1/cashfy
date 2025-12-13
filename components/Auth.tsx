import { useState } from "react";
import { supabase } from "../services/supabaseClient";

interface AuthProps {
  onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "signup">("login");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
        });

        if (error) throw error;
      }

      onAuthSuccess();
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {modo === "login" ? "Entrar" : "Criar conta"}
        </h2>

        {erro && (
          <p className="text-red-600 text-sm text-center">{erro}</p>
        )}

        <input
          type="email"
          placeholder="Seu email"
          className="border p-3 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Sua senha"
          className="border p-3 rounded-md"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={carregando}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-md"
        >
          {carregando
            ? "Aguarde..."
            : modo === "login"
            ? "Entrar"
            : "Criar conta"}
        </button>

        <button
          type="button"
          className="text-sm text-blue-600 hover:underline mt-2"
          onClick={() =>
            setModo(modo === "login" ? "signup" : "login")
          }
        >
          {modo === "login"
            ? "Criar conta"
            : "Já tenho conta"}
        </button>
      </form>
    </div>
  );
}

