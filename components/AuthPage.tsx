import React, { useState } from 'react';
import { Card, Button, Input, cn } from './UI';
import { Mail, Lock, User, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating API latency
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-inter transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-center z-10">
        
        {/* Left Side - Hero / Marketing (Visible on Desktop) */}
        <div className="hidden lg:flex flex-col gap-6 p-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/50 mb-4">
            <span className="font-bold text-white text-2xl">C</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            Domine suas finanças com a inteligência do <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-200">Cashfy</span>.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Rastreie despesas, planeje metas e receba insights de IA para alcançar sua liberdade financeira mais rápido.
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <CheckCircle className="text-emerald-500 w-5 h-5" />
              <span>Gestão de Renda Variável</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <CheckCircle className="text-emerald-500 w-5 h-5" />
              <span>Metas Inteligentes</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="text-emerald-500 w-5 h-5" />
              <span>Privacidade e Segurança</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <Card className="w-full max-w-md mx-auto p-8 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mx-auto mb-3">
               <span className="font-bold text-white text-xl">C</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bem-vindo ao Cashfy</h2>
          </div>

          <div className="mb-6 flex gap-4 p-1 bg-slate-100 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                isLogin ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                !isLogin ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Seu nome"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input 
                  type="email" 
                  required 
                  placeholder="seu@email.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Senha</label>
                {isLogin && <a href="#" className="text-xs text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400">Esqueceu?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 py-2.5 flex items-center justify-center gap-2 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Acessar Painel' : 'Criar Conta Grátis'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Ao continuar, você concorda com nossos <a href="#" className="text-slate-500 hover:text-slate-800 dark:hover:text-white">Termos de Serviço</a> e <a href="#" className="text-slate-500 hover:text-slate-800 dark:hover:text-white">Política de Privacidade</a>.
          </p>
        </Card>
      </div>
    </div>
  );
};