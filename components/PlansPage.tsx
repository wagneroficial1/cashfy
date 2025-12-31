
import React from 'react';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { Button, cn } from './UI';

interface PlansPageProps {
    onBack: () => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onBack }) => {

    const handleSubscribe = (plan: string) => {
        alert(`O plano ${plan} estará disponível em breve!`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-inter flex flex-col relative overflow-hidden transition-colors duration-300">

            {/* Background Decor - Similar to AuthPage but adjusted */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header / Back Button */}
            <div className="container mx-auto px-4 py-8 z-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    Voltar
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 pb-20 z-10">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        Escolha o plano ideal para você
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Tenha acesso a ferramentas profissionais de gestão financeira, criadas para maximizar seus resultados e acelerar sua liberdade.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-stretch">

                    {/* FREE PLAN */}
                    <div className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">FREE</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Transações ilimitadas</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">R$ 0</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <PlanFeature>3 metas financeiras no total</PlanFeature>
                            <PlanFeature>Acesso à calculadora de juros compostos</PlanFeature>
                            <PlanFeature>Acesso à simulação de aposentadoria</PlanFeature>
                            <PlanFeature>Conversor de moeda</PlanFeature>
                            <PlanFeature>Gamificação (básica)</PlanFeature>
                            <PlanFeature>Lista de compras</PlanFeature>
                            <PlanFeature>Micro-learning básico</PlanFeature>
                        </ul>

                        <Button
                            variant="ghost"
                            className="w-full py-6 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white"
                            onClick={() => handleSubscribe('Free')}
                        >
                            Começar grátis
                        </Button>
                    </div>

                    {/* PRO PLAN (Featured) */}
                    <div className="relative p-1 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/20 transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                            Mais Popular
                        </div>

                        <div className="h-full p-8 rounded-[14px] bg-slate-50 dark:bg-[#0B1120] flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    PRO <Star size={16} className="fill-emerald-500 text-emerald-500" />
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Transações ilimitadas</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-5xl font-bold text-slate-900 dark:text-white">R$ 19,90</span>
                                <span className="text-slate-500 dark:text-slate-400 ml-2">/mês</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <PlanFeature highlighted>Metas ilimitadas</PlanFeature>
                                <PlanFeature highlighted>Consultor IA (análise mensal)</PlanFeature>
                                <PlanFeature>Relatórios financeiros em PDF</PlanFeature>
                                <PlanFeature>Gamificação completa</PlanFeature>
                                <PlanFeature>Micro-learning completo</PlanFeature>
                                <PlanFeature>Acesso a todas as funcionalidades do app</PlanFeature>
                            </ul>

                            <Button
                                className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 border-0"
                                onClick={() => handleSubscribe('Pro')}
                            >
                                Assinar PRO
                            </Button>
                        </div>
                    </div>

                    {/* PLUS PLAN */}
                    <div className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">PLUS</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Acesso de elite</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">R$ 29,90</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-2">/mês</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <PlanFeature>Consultor IA com análise semanal</PlanFeature>
                            <PlanFeature>Alertas inteligentes automáticos</PlanFeature>
                            <PlanFeature>Histórico financeiro mais longo</PlanFeature>
                            <PlanFeature>Desafios exclusivos</PlanFeature>
                            <PlanFeature>Relatórios comparativos</PlanFeature>
                            <PlanFeature>Conteúdo educacional premium</PlanFeature>
                            <PlanFeature>Acesso a todas as funcionalidades do app</PlanFeature>
                        </ul>

                        <Button
                            variant="ghost"
                            className="w-full py-6 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white"
                            onClick={() => handleSubscribe('Plus')}
                        >
                            Assinar PLUS
                        </Button>
                    </div>

                </div>

                <p className="mt-12 text-slate-500 dark:text-slate-500 text-sm text-center">
                    Precisa de um plano customizado para sua empresa? <a href="#" className="text-emerald-600 dark:text-emerald-500 hover:underline">Entre em contato</a>.
                </p>

            </div>
        </div>
    );
};

const PlanFeature = ({ children, highlighted = false }: { children: React.ReactNode, highlighted?: boolean }) => (
    <li className="flex items-start gap-3 text-sm">
        <div className={cn(
            "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
            highlighted ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        )}>
            <Check size={12} strokeWidth={3} />
        </div>
        <span className={cn(
            highlighted ? "text-slate-900 dark:text-slate-200 font-medium" : "text-slate-600 dark:text-slate-400"
        )}>{children}</span>
    </li>
);
