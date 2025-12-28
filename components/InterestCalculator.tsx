import React, { useState, useMemo } from 'react';
import { Card, Input, Select, Button, cn } from './UI';
import { Calculator, TrendingUp, Calendar, Percent, User, HeartPulse, Leaf } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export const InterestCalculator: React.FC = () => {
  // Mode State
  const [mode, setMode] = useState<'simple' | 'retirement'>('simple');

  // Common State
  const [initialAmount, setInitialAmount] = useState(1000);
  const [contribution, setContribution] = useState(500);
  const [contributionFreq, setContributionFreq] = useState<'monthly' | 'daily'>('monthly');
  const [interestRate, setInterestRate] = useState(10); // Taxa Anual

  // Simple Mode State
  const [period, setPeriod] = useState(10);
  const [periodUnit, setPeriodUnit] = useState<'years' | 'months'>('years');

  // Retirement Mode State
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);

  // Lógica de Cálculo e Geração de Dados para o Gráfico
  const calculationResult = useMemo(() => {
    // Determinar período efetivo em meses
    let effectivePeriodMonths = 0;
    
    if (mode === 'retirement') {
      const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);
      effectivePeriodMonths = yearsUntilRetirement * 12;
    } else {
      effectivePeriodMonths = periodUnit === 'years' ? period * 12 : period;
    }

    const data = [];
    
    // Taxas
    const annualRate = interestRate / 100;
    // Se aporte é mensal, taxa mensal. Se diário, taxa diária (aprox)
    const ratePerPeriod = contributionFreq === 'monthly' ? annualRate / 12 : annualRate / 365;
    
    // Contribuição ajustada para o loop
    const pmt = contribution;

    let currentBalance = initialAmount;
    let totalInvested = initialAmount;

    // Para evitar loops gigantes em 'daily', calculamos o saldo mês a mês acumulando os juros/aportes internos
    const periodsPerMonth = contributionFreq === 'monthly' ? 1 : 30; 

    for (let m = 0; m <= effectivePeriodMonths; m++) {
      // Otimização de plotagem: 
      // Se for muitos anos, mostra ano a ano, senão mês a mês
      const showPoint = effectivePeriodMonths > 60 ? m % 12 === 0 : true;

      if (showPoint || m === effectivePeriodMonths) {
        let label = '';
        if (mode === 'retirement') {
            const ageAtPoint = currentAge + Math.floor(m/12);
            label = `${ageAtPoint} Anos`;
        } else {
            label = periodUnit === 'years' && effectivePeriodMonths > 24 ? `Ano ${Math.floor(m/12)}` : `Mês ${m}`;
        }

        data.push({
          name: label,
          balance: parseFloat(currentBalance.toFixed(2)),
          invested: parseFloat(totalInvested.toFixed(2)),
          interest: parseFloat((currentBalance - totalInvested).toFixed(2))
        });
      }

      // Avançar 1 mês no cálculo
      if (m < effectivePeriodMonths) {
        for (let k = 0; k < periodsPerMonth; k++) {
          currentBalance = currentBalance * (1 + ratePerPeriod) + pmt;
          totalInvested += pmt;
        }
      }
    }

    // Cálculos de Renda Passiva (Apenas estimativa baseada na taxa segura de retirada ou rendimento mensal)
    // Usando regra simplificada: Rendimento mensal do montante final com a mesma taxa (sem consumir principal)
    const monthlyPassiveIncome = currentBalance * (annualRate / 12);
    
    // Cálculo de retirada para zerar na expectativa de vida (PMT inverso)
    // Quantos meses de usufruto?
    const retirementYears = Math.max(0, lifeExpectancy - retirementAge);
    const retirementMonths = retirementYears * 12;
    let safeWithdrawal = 0;
    
    if (retirementMonths > 0 && annualRate > 0) {
        // Fórmula de anuidade para retirada: P * (r(1+r)^n) / ((1+r)^n - 1)
        // Onde r é mensal
        const r = annualRate / 12;
        const n = retirementMonths;
        safeWithdrawal = currentBalance * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    return {
      data,
      finalBalance: currentBalance,
      totalInvested,
      totalInterest: currentBalance - totalInvested,
      monthlyPassiveIncome,
      safeWithdrawal,
      yearsToGrow: mode === 'retirement' ? retirementAge - currentAge : effectivePeriodMonths / 12
    };
  }, [initialAmount, contribution, contributionFreq, interestRate, period, periodUnit, mode, currentAge, retirementAge, lifeExpectancy]);

  const setConservativeRate = () => {
    setInterestRate(6.0);
  };

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg text-white", mode === 'retirement' ? "bg-emerald-500" : "bg-indigo-500")}>
             {mode === 'retirement' ? <Leaf size={20} /> : <Calculator size={20} />}
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {mode === 'retirement' ? 'Plano Aposentadoria' : 'Simulador Futuro'}
          </h3>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            <button 
                onClick={() => setMode('simple')}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", mode === 'simple' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500")}
            >
                Simples
            </button>
            <button 
                onClick={() => setMode('retirement')}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", mode === 'retirement' ? "bg-white dark:bg-slate-700 shadow text-emerald-600 dark:text-emerald-400" : "text-slate-500")}
            >
                Aposentadoria
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Valor Inicial e Aportes (Comum) */}
        <div className="grid grid-cols-2 gap-3">
             <Input 
                label="Investimento Inicial" 
                type="number" 
                value={initialAmount} 
                onChange={e => setInitialAmount(Number(e.target.value))}
                placeholder="0,00"
            />
             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Aporte Recorrente</label>
                <div className="flex">
                    <input 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-l-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        type="number" 
                        value={contribution} 
                        onChange={e => setContribution(Number(e.target.value))}
                    />
                    <select 
                        value={contributionFreq} 
                        onChange={e => setContributionFreq(e.target.value as 'monthly' | 'daily')}
                        className="bg-slate-100 dark:bg-slate-800 border-y border-r border-slate-200 dark:border-slate-700 rounded-r-lg px-2 text-xs text-slate-600 dark:text-slate-400 outline-none"
                    >
                        <option value="monthly">/ Mês</option>
                        <option value="daily">/ Dia</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Dynamic Inputs based on Mode */}
        {mode === 'simple' ? (
             <div className="grid grid-cols-2 gap-3">
                 <Input 
                    label="Taxa Anual (%)" 
                    type="number" 
                    value={interestRate} 
                    onChange={e => setInterestRate(Number(e.target.value))}
                    step="0.1"
                />
                <div className="flex gap-2 items-end">
                    <Input 
                    label="Período" 
                    type="number" 
                    className="flex-1"
                    value={period} 
                    onChange={e => setPeriod(Number(e.target.value))}
                    />
                    <Select 
                    value={periodUnit}
                    onChange={e => setPeriodUnit(e.target.value as 'years' | 'months')}
                    className="w-24 px-1"
                    >
                    <option value="years">Anos</option>
                    <option value="months">Meses</option>
                    </Select>
                </div>
             </div>
        ) : (
            <>
                 <div className="grid grid-cols-3 gap-2">
                    <Input 
                        label="Idade Atual" 
                        type="number" 
                        value={currentAge} 
                        onChange={e => setCurrentAge(Number(e.target.value))}
                    />
                    <Input 
                        label="Aposentadoria" 
                        type="number" 
                        value={retirementAge} 
                        onChange={e => setRetirementAge(Number(e.target.value))}
                    />
                     <Input 
                        label="Exp. Vida" 
                        type="number" 
                        value={lifeExpectancy} 
                        onChange={e => setLifeExpectancy(Number(e.target.value))}
                        title="Expectativa de vida para cálculo de usufruto"
                    />
                 </div>
                 <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Input 
                            label="Taxa Anual (%)" 
                            type="number" 
                            value={interestRate} 
                            onChange={e => setInterestRate(Number(e.target.value))}
                            step="0.1"
                        />
                    </div>
                    {interestRate > 8 && (
                        <Button 
                            variant="secondary" 
                            className="text-xs py-2.5 h-[42px] px-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
                            onClick={setConservativeRate}
                            title="Aplicar taxa conservadora de 6%"
                        >
                            Usar Conservadora (6%)
                        </Button>
                    )}
                 </div>
            </>
        )}

        {/* Chart Area */}
        <div className="mt-6 h-40 w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50 overflow-hidden relative">
           <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={calculationResult.data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mode === 'retirement' ? "#10b981" : "#8b5cf6"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={mode === 'retirement' ? "#10b981" : "#8b5cf6"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', fontSize: '12px', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, '']}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke={mode === 'retirement' ? "#10b981" : "#8b5cf6"} 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                strokeWidth={2}
                name="Total"
              />
              <Area 
                type="monotone" 
                dataKey="invested" 
                stroke="#94a3b8" 
                fill="transparent" 
                strokeDasharray="4 4" 
                strokeWidth={1} 
                name="Investido"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Results Summary */}
        <div className="pt-2 space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total Acumulado ({calculationResult.yearsToGrow.toFixed(0)} anos)</span>
                <span className={cn("font-bold text-lg", mode === 'retirement' ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400")}>
                    R$ {calculationResult.finalBalance.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
            </div>

            {mode === 'retirement' && (
                <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                            <HeartPulse size={12} /> Renda Vitalícia (Juros)
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            R$ {calculationResult.monthlyPassiveIncome.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}/mês
                        </span>
                    </div>
                     <div className="flex justify-between items-center pt-2 border-t border-emerald-200 dark:border-emerald-800/30">
                        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1" title="Consumindo o patrimônio até a expectativa de vida">
                            <User size={12} /> Retirada (até {lifeExpectancy} anos)
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            R$ {calculationResult.safeWithdrawal.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}/mês
                        </span>
                    </div>
                </div>
            )}
            
            {mode === 'simple' && (
                <>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Total Investido</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            R$ {calculationResult.totalInvested.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Rendimento Juros</span>
                        <span className="font-semibold text-emerald-500">
                            + R$ {calculationResult.totalInterest.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </>
            )}
        </div>
      </div>
    </Card>
  );
};