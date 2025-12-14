import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, PieChart, Target, Receipt, Menu, X, Bell, BrainCircuit, Calendar
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { IncomeGoals } from './components/IncomeGoals';
import { Transaction, IncomeSource, Goal, ViewState } from './types';
import { Button, Card, cn } from './components/UI';
import { generateFinancialInsights } from './services/geminiService';
import Markdown from 'react-markdown';

// Mock Initial Data (Portuguese)
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-01', description: 'Cliente Web Dev', amount: 2500, category: 'Freelance', type: 'income' },
  { id: '2', date: '2023-10-02', description: 'Custo de Servidor', amount: 120, category: 'Negócios', type: 'expense' },
  { id: '3', date: '2023-10-05', description: 'Supermercado', amount: 350, category: 'Alimentação', type: 'expense' },
  { id: '4', date: '2023-10-10', description: 'Aplicação CDB', amount: 1000, category: 'Investimento', type: 'investment' },
  { id: '5', date: '2023-10-15', description: 'AdSense YouTube', amount: 850, category: 'YouTube', type: 'income' },
  { id: '6', date: '2023-10-20', description: 'Combustível', amount: 200, category: 'Transporte', type: 'expense' },
  { id: '7', date: '2023-09-28', description: 'Projeto Antigo', amount: 1500, category: 'Freelance', type: 'income' },
];

const INITIAL_INCOME_SOURCES: IncomeSource[] = [
  { id: '1', name: 'Salário', expectedAmount: 4000, color: '#34d399' },
  { id: '2', name: 'YouTube', expectedAmount: 1000, color: '#f472b6' },
  { id: '3', name: 'Freelance', expectedAmount: 1500, color: '#60a5fa' },
];

const INITIAL_GOALS: Goal[] = [
  { id: '1', name: 'Reserva de Emergência', targetAmount: 10000, currentAmount: 6500 },
  { id: '2', name: 'Notebook Novo', targetAmount: 2500, currentAmount: 2100 },
];

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // App State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(INITIAL_INCOME_SOURCES);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // Date Filter State (YYYY-MM)
  // Default to October 2023 for demo purposes as mock data is there
  const [selectedMonth, setSelectedMonth] = useState<string>('2023-10'); 

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Derived State: Filter transactions by month
  const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

  // Automated Alerts Check
  useEffect(() => {
    const newNotifications: string[] = [];
    
    // Check Goals
    goals.forEach(goal => {
      const pct = (goal.currentAmount / goal.targetAmount) * 100;
      if (pct >= 90 && pct < 100) {
        newNotifications.push(`A meta '${goal.name}' está quase completa (${Math.round(pct)}%)!`);
      } else if (pct >= 100) {
        newNotifications.push(`Parabéns! Meta '${goal.name}' atingida!`);
      }
    });

    // Simple Spending Check (Mock Limit 5000)
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    if (totalExpenses > 5000) {
      newNotifications.push(`Aviso: As despesas totais (R$ ${totalExpenses}) excederam o limite mensal de segurança.`);
    }

    setNotifications(newNotifications);
  }, [transactions, goals]);

  // Handlers
  const handleAddTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    // Auto-update goals if it's an investment (simple logic for demo)
    if (t.type === 'investment') {
       if (goals.length > 0) {
          const updatedGoals = [...goals];
          updatedGoals[0].currentAmount += t.amount;
          setGoals(updatedGoals);
       }
    }
  };

  const handleUpdateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddIncomeSource = (s: IncomeSource) => setIncomeSources(prev => [...prev, s]);
  
  const handleUpdateIncomeSource = (updated: IncomeSource) => {
    setIncomeSources(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleRemoveIncomeSource = (id: string) => setIncomeSources(prev => prev.filter(s => s.id !== id));
  
  const handleAddGoal = (g: Goal) => setGoals(prev => [...prev, g]);
  
  const handleUpdateGoal = (updated: Goal) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const runAIAnalysis = async () => {
    setAiLoading(true);
    setView(ViewState.AI_ADVISOR);
    // Send filtered transactions to AI so analysis is relevant to the view
    const insight = await generateFinancialInsights(filteredTransactions, incomeSources, goals);
    setAiInsight(insight);
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-inter overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <span className="font-bold text-white text-xl">C</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Cashfy
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            active={view === ViewState.DASHBOARD} 
            onClick={() => setView(ViewState.DASHBOARD)} 
            icon={<LayoutDashboard size={20} />} 
            label="Visão Geral" 
          />
          <NavItem 
            active={view === ViewState.TRANSACTIONS} 
            onClick={() => setView(ViewState.TRANSACTIONS)} 
            icon={<Receipt size={20} />} 
            label="Transações" 
          />
          <NavItem 
            active={view === ViewState.INCOME || view === ViewState.GOALS} 
            onClick={() => setView(ViewState.INCOME)} 
            icon={<Target size={20} />} 
            label="Metas & Renda" 
          />
           <div className="pt-4 mt-4 border-t border-slate-800">
            <NavItem 
                active={view === ViewState.AI_ADVISOR} 
                onClick={runAIAnalysis} 
                icon={<BrainCircuit size={20} className="text-purple-400" />} 
                label="Consultor IA"
                className="hover:bg-purple-900/20" 
            />
           </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
                JD
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">João Silva</p>
                <p className="text-xs text-slate-400 truncate">Plano Premium</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
                className="lg:hidden p-2 text-slate-400 hover:text-white"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={24} />
            </button>
            
            {/* Month Filter */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5">
                <Calendar size={16} className="text-emerald-500" />
                <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-transparent border-none text-sm text-slate-200 focus:outline-none [color-scheme:dark]"
                />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
             {/* Notification Bell with Badge */}
            <div className="relative group cursor-pointer">
              <Bell size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-slate-900"></span>
              )}
              
              {/* Dropdown for notifications */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 border-b border-slate-700 font-medium text-sm">Notificações</div>
                <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 text-center">Sem novos alertas</div>
                    ) : (
                        notifications.map((note, i) => (
                            <div key={i} className="p-3 text-sm border-b border-slate-700/50 last:border-0 hover:bg-slate-700/50">
                                {note}
                            </div>
                        ))
                    )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-950 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {view === ViewState.DASHBOARD && (
                    <Dashboard transactions={filteredTransactions} incomeSources={incomeSources} />
                )}
                
                {view === ViewState.TRANSACTIONS && (
                    <Transactions 
                      transactions={filteredTransactions} 
                      onAddTransaction={handleAddTransaction}
                      onUpdateTransaction={handleUpdateTransaction}
                      onRemoveTransaction={handleRemoveTransaction}
                    />
                )}

                {(view === ViewState.INCOME || view === ViewState.GOALS) && (
                    <IncomeGoals 
                        incomeSources={incomeSources}
                        goals={goals}
                        onAddIncomeSource={handleAddIncomeSource}
                        onUpdateIncomeSource={handleUpdateIncomeSource}
                        onRemoveIncomeSource={handleRemoveIncomeSource}
                        onAddGoal={handleAddGoal}
                        onUpdateGoal={handleUpdateGoal}
                        onRemoveGoal={handleRemoveGoal}
                    />
                )}

                {view === ViewState.AI_ADVISOR && (
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <BrainCircuit className="text-purple-500" /> 
                                Análise Financeira com IA
                            </h2>
                            <p className="text-slate-400 mt-2">
                                Desenvolvido com Gemini 2.5 Flash, obtenha insights personalizados sobre seus hábitos de consumo em 
                                <span className="text-emerald-400 font-semibold ml-1">
                                    {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </span>.
                            </p>
                        </div>
                        
                        <Card className="p-8 border-purple-500/20 bg-slate-900/80">
                            {aiLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-purple-300 animate-pulse">Analisando suas finanças...</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-emerald max-w-none">
                                    {aiInsight ? (
                                        <Markdown>{aiInsight}</Markdown>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p>Clique em "Consultor IA" no menu para gerar um novo relatório.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}

// Sub-component for Nav Items
const NavItem = ({ active, icon, label, onClick, className }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
      active 
        ? "bg-emerald-500/10 text-emerald-400 shadow-sm border border-emerald-500/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
      className
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);
