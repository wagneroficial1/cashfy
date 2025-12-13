import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Card, Button } from './UI';
import { Transaction, IncomeSource } from '../types';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, DollarSign } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  incomeSources: IncomeSource[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, incomeSources }) => {
  
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
    // If no transactions, return empty or placeholder
    if (transactions.length === 0) return [];

    // Identify the days in the current filtered view
    // Since filtering happens in parent, we assume all transactions here belong to the same month (mostly)
    // We create a map of day -> values
    const daysMap = new Map<number, { income: number; expense: number }>();

    transactions.forEach(t => {
        const day = new Date(t.date).getDate() + 1; // +1 to fix timezone offset issues if simple string parsing, or just use getDate() if proper Date. 
        // Better robust parsing:
        const d = parseInt(t.date.split('-')[2]);
        
        const current = daysMap.get(d) || { income: 0, expense: 0 };
        if (t.type === 'income') current.income += t.amount;
        if (t.type === 'expense') current.expense += t.amount;
        daysMap.set(d, current);
    });

    // Create array for days 1-31 (or max day of that month)
    // To keep it clean, we just show days that have activity or range 1-30
    const data = [];
    for (let i = 1; i <= 31; i++) {
        const val = daysMap.get(i) || { income: 0, expense: 0 };
        // Only push if there is data or to fill gaps linearly? 
        // Let's push all to keep x-axis correct
        data.push({
            name: i.toString().padStart(2, '0'),
            income: val.income,
            expense: val.expense
        });
    }
    return data;
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Resultado do Mês" 
          value={monthlyResult} 
          icon={<Wallet className="text-emerald-400" />} 
          trend="Fluxo Líquido" 
          trendUp={monthlyResult >= 0}
        />
        <StatCard 
          title="Receita do Mês" 
          value={totalIncome} 
          icon={<ArrowUpRight className="text-blue-400" />} 
          trend="Entradas" 
          trendUp={true}
        />
        <StatCard 
          title="Despesas do Mês" 
          value={totalExpenses} 
          icon={<ArrowDownRight className="text-rose-400" />} 
          trend="Saídas" 
          trendUp={false}
        />
        <StatCard 
          title="Investido (Mês)" 
          value={totalInvestments} 
          icon={<TrendingUp className="text-purple-400" />} 
          trend="Aportes" 
          trendUp={true}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Fluxo Diário (Dia a Dia)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(val) => `R$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                  labelFormatter={(label) => `Dia ${label}`}
                  formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name === 'income' ? 'Receita' : 'Despesa']}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Side Panel: Income Sources Overview */}
        <Card className="p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-100">Fontes de Renda</h3>
                <DollarSign className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {incomeSources.map(source => (
                    <div key={source.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: source.color }} />
                            <div>
                                <p className="font-medium text-slate-200">{source.name}</p>
                                <p className="text-xs text-slate-500">Est. Mensal</p>
                            </div>
                        </div>
                        <span className="font-semibold text-emerald-400">
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
  );
};

const StatCard = ({ title, value, icon, trend, trendUp }: any) => (
  <Card className="p-6 hover:border-slate-600 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <h4 className="text-2xl font-bold text-slate-100 mt-1">
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h4>
      </div>
      <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
        {icon}
      </div>
    </div>
    <div className={`flex items-center text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
      {trendUp ? '↑' : '↓'} {trend}
      <span className="text-slate-500 ml-1">{/* Placeholder for descriptive text */}</span>
    </div>
  </Card>
);