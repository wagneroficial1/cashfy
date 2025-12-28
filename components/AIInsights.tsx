import React from 'react';
import { AIAnalysisResult } from '../types';
import { Card, cn } from './UI';
import { 
  TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle, AlertOctagon, 
  Lightbulb, Zap, ShieldAlert, Award
} from 'lucide-react';

interface AIInsightsProps {
  data: AIAnalysisResult | null;
  loading: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <BrainIcon className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Processando seus dados...</h3>
          <p className="text-slate-500 dark:text-slate-400">Nossa IA está analisando padrões e gerando infográficos.</p>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-12 text-center">
        <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500">Clique em "Consultor IA" para gerar um novo relatório detalhado.</p>
      </Card>
    );
  }

  // Helper colors based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500";
    if (score >= 60) return "text-blue-500 border-blue-500";
    if (score >= 40) return "text-yellow-500 border-yellow-500";
    return "text-rose-500 border-rose-500";
  };

  const getStatusColorBg = (status: string) => {
      switch(status) {
          case 'Excelente': return 'bg-emerald-500';
          case 'Bom': return 'bg-blue-500';
          case 'Atenção': return 'bg-yellow-500';
          case 'Crítico': return 'bg-rose-500';
          default: return 'bg-slate-500';
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Summary */}
      <Card className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 border-purple-200 dark:border-purple-900/30">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Score Circle */}
          <div className="relative flex-shrink-0">
            <div className={cn("w-32 h-32 rounded-full border-8 flex items-center justify-center bg-white dark:bg-slate-900 shadow-xl", getScoreColor(data.healthScore))}>
              <div className="text-center">
                <span className="text-3xl font-bold block">{data.healthScore}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Score</span>
              </div>
            </div>
            <div className={cn("absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg", getStatusColorBg(data.financialStatus))}>
              {data.financialStatus}
            </div>
          </div>
          
          {/* Summary Text */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-2">
              <Award className="text-purple-500" /> Resumo Executivo
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              "{data.summary}"
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Section */}
        <Card className="p-6">
          <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-500" /> Tendências Observadas
          </h4>
          <div className="space-y-4">
            {data.trends.map((trend, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className={cn("p-2 rounded-lg", 
                  trend.type === 'positive' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                  trend.type === 'negative' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" :
                  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}>
                  {trend.icon === 'up' && <TrendingUp size={18} />}
                  {trend.icon === 'down' && <TrendingDown size={18} />}
                  {trend.icon === 'flat' && <Minus size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{trend.text}</p>
                  <span className={cn("text-xs font-semibold", 
                     trend.type === 'positive' ? "text-emerald-500" :
                     trend.type === 'negative' ? "text-rose-500" : "text-slate-500"
                  )}>
                    {trend.type === 'positive' ? 'Ponto Positivo' : trend.type === 'negative' ? 'Ponto de Atenção' : 'Neutro'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Risks Section */}
        <Card className="p-6">
          <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="text-rose-500" /> Riscos Potenciais
          </h4>
          <div className="space-y-4">
            {data.risks.map((risk, idx) => (
              <div key={idx} className={cn("flex items-start gap-3 p-3 rounded-lg border-l-4",
                risk.severity === 'high' ? "bg-rose-50 dark:bg-rose-900/10 border-rose-500" :
                risk.severity === 'medium' ? "bg-orange-50 dark:bg-orange-900/10 border-orange-500" :
                "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500"
              )}>
                <div className="mt-0.5">
                    {risk.severity === 'high' && <AlertOctagon size={18} className="text-rose-500" />}
                    {risk.severity === 'medium' && <AlertTriangle size={18} className="text-orange-500" />}
                    {risk.severity === 'low' && <AlertTriangle size={18} className="text-yellow-500" />}
                </div>
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{risk.description}</p>
                  <span className={cn("text-[10px] uppercase font-bold tracking-wider", 
                    risk.severity === 'high' ? "text-rose-600" :
                    risk.severity === 'medium' ? "text-orange-600" : "text-yellow-600"
                  )}>
                    Risco {risk.severity === 'high' ? 'Alto' : risk.severity === 'medium' ? 'Médio' : 'Baixo'}
                  </span>
                </div>
              </div>
            ))}
            {data.risks.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <p>Nenhum risco significativo detectado.</p>
                </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recommendations Grid */}
      <div>
        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="text-yellow-500" /> Plano de Ação Recomendado
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.recommendations.map((rec, idx) => (
            <Card key={idx} className="p-5 hover:border-purple-400 dark:hover:border-purple-500 transition-colors flex flex-col h-full bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-lg">
                  <Lightbulb size={20} />
                </div>
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium border", 
                  rec.difficulty === 'Fácil' ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" :
                  rec.difficulty === 'Médio' ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" :
                  "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
                )}>
                  {rec.difficulty}
                </span>
              </div>
              <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{rec.title}</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                {rec.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple Icon component for the loading state
const BrainIcon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
);
