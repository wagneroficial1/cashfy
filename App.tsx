import React, { useEffect, useState } from "react";
import Auth from "./components/Auth";
import MainApp from "./MainApp";
import { supabase } from "./services/supabaseClient";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listener: usuário logou / deslogou
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Carregando...
      </div>
    );
  }

  // Se NÃO estiver logado → mostra tela de login
  if (!session) {
    return <Auth onAuthSuccess={() => setSession(true)} />;
  }

  // Se estiver logado → mostra seu app original
  return <MainApp />;
}
