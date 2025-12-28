import React from 'react';
import { Button } from './UI';
import { 
  ArrowRight, BrainCircuit, Trophy, Target, LayoutDashboard, Coins, ShieldCheck, Calculator, ArrowRightLeft
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter selection:bg-emerald-500 selection:text-white overflow-x-hidden flex flex-col">
      
      {/* --- Header Minimalista --- */}
      <header className="absolute top-0 w-full z-50 py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Cashfy
            </span>
          </div>
          
          {/* Botão Secundário (Login) */}
          <button 
             onClick={onStart}
             className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-slate-900"
          >
             Entrar
          </button>
        </div>
      </header>

      {/* --- Hero Section Centralizada --- */}
      <main className="flex-1 flex flex-col justify-center relative pt-32 pb-20 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 z-10">
          
          {/* Badge de Versão */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 hover:border-emerald-500/30 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            IA Financeira Disponível
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Inteligência real para <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-400">
              sua liberdade financeira.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Abandone as planilhas manuais. O Cashfy une <strong>gestão financeira</strong>, <strong>gamificação</strong> e <strong>inteligência artificial</strong> em um único painel intuitivo.
          </p>
          
          {/* CTA Principal */}
          <div className="pt-4 flex items-center justify-center">
            <Button 
                onClick={onStart} 
                className="h-14 px-10 text-lg rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/20 flex items-center gap-2 w-full sm:w-auto justify-center transition-all hover:scale-105"
            >
                Começar Agora <ArrowRight size={20} />
            </Button>
          </div>

        </div>
      </main>

      {/* --- Features Grid Minimal (Fundo Branco) --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureItem 
                    icon={<BrainCircuit className="text-purple-400" />}
                    title="Consultor IA"
                    desc="Análise automática de gastos e sugestões personalizadas de economia."
                />
                <FeatureItem 
                    icon={<Trophy className="text-yellow-400" />}
                    title="Gamificação"
                    desc="Ganhe XP e conquistas ao atingir suas metas financeiras."
                />
                <FeatureItem 
                    icon={<Target className="text-emerald-400" />}
                    title="Metas de Vida"
                    desc="Acompanhe visualmente o progresso dos seus sonhos."
                />
                <FeatureItem 
                    icon={<Coins className="text-blue-400" />}
                    title="Renda Passiva"
                    desc="Gestão de investimentos e múltiplas fontes de renda."
                />
                 <FeatureItem 
                    icon={<LayoutDashboard className="text-cyan-400" />}
                    title="Dashboard 360º"
                    desc="Visão completa do seu patrimônio em tempo real."
                />
                 <FeatureItem 
                    icon={<ShieldCheck className="text-rose-400" />}
                    title="Dados Seguros"
                    desc="Privacidade total. Seus dados financeiros são apenas seus."
                />
                <FeatureItem 
                    icon={<Calculator className="text-orange-400" />}
                    title="Calculadora Juros"
                    desc="Simule o crescimento do seu patrimônio com o poder dos juros compostos."
                />
                <FeatureItem 
                    icon={<ArrowRightLeft className="text-teal-400" />}
                    title="Câmbio Global"
                    desc="Converta valores entre diferentes moedas com cotações atualizadas."
                />
            </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900 bg-slate-950">
        <p>&copy; {new Date().getFullYear()} Cashfy. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-xl">
        <div className="flex items-center gap-4 mb-3">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                {icon}
            </div>
            <h3 className="font-bold text-slate-200">{title}</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);