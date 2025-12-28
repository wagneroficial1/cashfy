import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, cn } from './UI';
import { Transaction, IncomeSource } from '../types';
import { CurrencyConverter } from './CurrencyConverter';
import { InterestCalculator } from './InterestCalculator';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => (
  <Card className="p-6 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        R$ {Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </h3>
      <div className="flex items-center gap-1 mt-2">
        <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", 
          trendUp ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        )}>
          {trendUp ? '+' : ''}{trend}
        </span>
      </div>
    </div>
    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
      {icon}
    </div>
  </Card>
);

interface DashboardProps {
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  currentTheme?: 'dark' | 'light';
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, incomeSources, currentTheme = 'dark' }) => {
  
  // Calculations (Based on filtered transactions prop)
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalInvestments = transactions
    .filter(t => t.type === 'investment')
    .reduce((acc, t) => acc + t.amount, 0);

  // For monthly view, balance usually represents "Cash Flow" (Income - Expenses)
  const monthlyResult = totalIncome - totalExpenses; 

  // Chart Data: Daily Breakdown for the selected month
  const chartData = React.useMemo(() => {
    if (transactions.length === 0) return [];

    const daysMap = new Map<number, { income: number; expense: number }>();

    transactions.forEach(t => {
        const d = parseInt(t.date.split('-')[2]);
        const current = daysMap.get(d) || { income: 0, expense: 0 };
        if (t.type === 'income') current.income += t.amount;
        if (t.type === 'expense') current.expense += t.amount;
        daysMap.set(d, current);
    });

    const data = [];
    for (let i = 1; i <= 31; i++) {
        const val = daysMap.get(i) || { income: 0, expense: 0 };
        data.push({
            name: i.toString().padStart(2, '0'),
            income: val.income,
            expense: val.expense
        });
    }
    return data;
  }, [transactions]);

  // Theme Colors for Chart
  const axisColor = currentTheme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = currentTheme === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipBg = currentTheme === 'dark' ? '#1e293b' : '#ffffff';
  const tooltipText = currentTheme === 'dark' ? '#f8fafc' : '#0f172a';
  const tooltipBorder = currentTheme === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Resultado do Mês" 
          value={monthlyResult} 
          icon={<Wallet className="text-emerald-500 dark:text-emerald-400" />} 
          trend="Fluxo Líquido" 
          trendUp={monthlyResult >= 0}
        />
        <StatCard 
          title="Receita do Mês" 
          value={totalIncome} 
          icon={<ArrowUpRight className="text-blue-500 dark:text-blue-400" />} 
          trend="Entradas" 
          trendUp={true}
        />
        <StatCard 
          title="Despesas do Mês" 
          value={totalExpenses} 
          icon={<ArrowDownRight className="text-rose-500 dark:text-rose-400" />} 
          trend="Saídas" 
          trendUp={false}
        />
        <StatCard 
          title="Investido (Mês)" 
          value={totalInvestments} 
          icon={<TrendingUp className="text-purple-500 dark:text-purple-400" />} 
          trend="Aportes" 
          trendUp={true}
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (Takes up 2 columns) */}
        <Card className="lg:col-span-2 p-6 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Fluxo Diário (Dia a Dia)</h3>
          {/* Correction: Use explicit height instead of flex-1 to prevent width/height(-1) warning */}
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={axisColor} tick={{fontSize: 12}} />
                <YAxis stroke={axisColor} tick={{fontSize: 12}} tickFormatter={(val) => `R$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px' }}
                  itemStyle={{ color: tooltipText }}
                  labelFormatter={(label) => `Dia ${label}`}
                  formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name === 'income' ? 'Receita' : 'Despesa']}
                  cursor={{fill: currentTheme === 'dark' ? '#334155' : '#f1f5f9', opacity: 0.4}}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Column Stack (Currency + Interest + Income) */}
        <div className="space-y-6">
            {/* Currency Converter Widget */}
            <CurrencyConverter />

            {/* Interest Calculator Widget */}
            <InterestCalculator />

            {/* Income Sources Overview */}
            <Card className="p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Fontes de Renda</h3>
                    <DollarSign className="w-5 h-5 text-slate-400" />
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 max-h-[300px]">
                    {incomeSources.map(source => (
                        <div key={source.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: source.color }} />
                                <div>
                                    <p className="font-medium text-slate-700 dark:text-slate-200">{source.name}</p>
                                    <p className="text-xs text-slate-500">Est. Mensal</p>
                                </div>
                            </div>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                R$ {source.expectedAmount.toLocaleString('pt-BR')}
                            </span>
                        </div>
                    ))}
                    {incomeSources.length === 0 && (
                        <p className="text-center text-slate-500 text-sm py-8">Nenhuma fonte de renda registrada.</p>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};