import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, PieChart, Target, Receipt, Menu, X, Bell, BrainCircuit, Calendar, LogOut, Moon, Sun, Award, GraduationCap, ShoppingCart, Trophy, ArrowRight
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { IncomeGoals } from './components/IncomeGoals';
import { AuthPage } from './components/AuthPage';
import { LandingPage } from './components/LandingPage';
import { AIInsights } from './components/AIInsights';
import { Achievements } from './components/Achievements';
import { LearningHub } from './components/LearningHub';
import { ShoppingList } from './components/ShoppingList';
import { Transaction, IncomeSource, Goal, ViewState, AIAnalysisResult, Badge } from './types';
import { Button, Card, cn } from './components/UI';
import { generateFinancialInsights } from './services/geminiService';

// Helper for dynamic dates (Current Month) in Local Time
const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};
const currentMonth = getCurrentMonth();

// Mock Initial Data (Dynamic Dates)
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: `${currentMonth}-01`, description: 'Cliente Web Dev', amount: 2500, category: 'Freelance', type: 'income' },
  { id: '2', date: `${currentMonth}-02`, description: 'Custo de Servidor', amount: 120, category: 'Negócios', type: 'expense' },
  { id: '3', date: `${currentMonth}-05`, description: 'Supermercado', amount: 350, category: 'Alimentação', type: 'expense' },
  { id: '4', date: `${currentMonth}-10`, description: 'Aplicação CDB', amount: 1000, category: 'Investimento', type: 'investment' },
  { id: '5', date: `${currentMonth}-15`, description: 'AdSense YouTube', amount: 850, category: 'YouTube', type: 'income' },
  { id: '6', date: `${currentMonth}-20`, description: 'Combustível', amount: 200, category: 'Transporte', type: 'expense' },
  { id: '7', date: `${currentMonth}-25`, description: 'Projeto Antigo', amount: 1500, category: 'Freelance', type: 'income' },
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

// --- Gamification Data ---
const ALL_BADGES: Badge[] = [
    { id: 'apprentice', title: 'Aprendiz', description: 'Conquistou 0 XP em aprendizado.', icon: 'book', color: 'blue', unlocked: false, xpReward: 50 },
    { id: 'shopper', title: 'Comprador', description: 'Realizou compras planejadas pela Lista de Compras.', icon: 'shopping-cart', color: 'bronze', unlocked: false, xpReward: 50 },
    { id: 'first_goal', title: 'Sonhador', description: 'Criou a primeira meta financeira.', icon: 'target', color: 'bronze', unlocked: false, xpReward: 100 },
    { id: 'first_investment', title: 'Investidor Iniciante', description: 'Registrou o primeiro investimento.', icon: 'rocket', color: 'blue', unlocked: false, xpReward: 150 },
    { id: 'goal_completed', title: 'Conquistador', description: 'Completou 100% de uma meta financeira.', icon: 'trophy', color: 'gold', unlocked: false, xpReward: 500 },
    { id: 'saver', title: 'Poupador Frequente', description: 'Registrou 5 transações de receita.', icon: 'medal', color: 'silver', unlocked: false, xpReward: 200 },
    { id: 'high_income', title: 'Empreendedor', description: 'Registrou uma receita única maior que R$ 5.000.', icon: 'star', color: 'purple', unlocked: false, xpReward: 1000 },
    { id: 'safe_guard', title: 'Protegido', description: 'Alcançou R$ 10.000 acumulados em metas.', icon: 'shield', color: 'blue', unlocked: false, xpReward: 300 },
];

export default function App() {
  // Navigation State
  const [showLanding, setShowLanding] = useState(true);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // App State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(INITIAL_INCOME_SOURCES);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // Gamification State
  const [badges, setBadges] = useState<Badge[]>(ALL_BADGES);
  const [userXP, setUserXP] = useState(350); // XP Inicial Mock
  const [learningTotalXP, setLearningTotalXP] = useState(0); // XP acumulado apenas via LearningHub
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  
  // Date Filter State (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth); 

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIAnalysisResult | null>(null);

  // Derived Level Calculation
  const userLevel = Math.floor(userXP / 1000) + 1;
  const nextLevelXP = userLevel * 1000;

  // Derived: Shopping List Total Calculation
  const shoppingListTotal = transactions
    .filter(t => t.category === 'Lista de Compras' && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  // Apply Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Derived State: Filter transactions by month
  const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

  // --- Gamification Engine ---
  useEffect(() => {
    if (!isAuthenticated) return;

    let newBadgesUnlocked: Badge[] = [];
    let xpGained = 0;

    const updatedBadges = badges.map(badge => {
        let isUnlocked = badge.unlocked;
        let currentXpReward = badge.xpReward;
        let currentDescription = badge.description;
        let currentUnlockedAt = badge.unlockedAt;

        // Condition Checks
        if (badge.id === 'first_goal' && goals.length > 0) isUnlocked = true;
        if (badge.id === 'first_investment' && transactions.some(t => t.type === 'investment')) isUnlocked = true;
        if (badge.id === 'goal_completed' && goals.some(g => g.currentAmount >= g.targetAmount)) isUnlocked = true;
        if (badge.id === 'saver' && transactions.filter(t => t.type === 'income').length >= 5) isUnlocked = true;
        if (badge.id === 'high_income' && transactions.some(t => t.type === 'income' && t.amount > 5000)) isUnlocked = true;
        
        // --- Badge de Comprador ---
        // Calcula XP acumulado baseado no número de compras (50 XP por compra)
        if (badge.id === 'shopper') {
             const shopCount = transactions.filter(t => t.category === 'Lista de Compras').length;
             if (shopCount > 0) {
                 isUnlocked = true;
                 currentXpReward = shopCount * 50; // Atualiza o valor exibido na badge
             }
        }
        
        const totalSavedInGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);
        if (badge.id === 'safe_guard' && totalSavedInGoals >= 10000) isUnlocked = true;
        
        // --- Badge de Aprendiz ---
        // Agora reflete o total de XP ganho no LearningHub
        if (badge.id === 'apprentice') {
             currentDescription = `Conquistou ${learningTotalXP} XP em aprendizado.`;
             // Atualiza o valor visual da badge para ser a soma total
             if (learningTotalXP > 0) {
                currentXpReward = learningTotalXP; 
             }
             if (learningTotalXP >= 50) isUnlocked = true;
        }

        // Se acabou de desbloquear
        if (isUnlocked && !badge.unlocked) {
            currentUnlockedAt = new Date().toISOString();
            const unlockedBadge = { ...badge, unlocked: true, unlockedAt: currentUnlockedAt, xpReward: currentXpReward, description: currentDescription };
            newBadgesUnlocked.push(unlockedBadge);
            
            // Exceção: Shopper e Apprentice ganham XP na ação manual (botão), não aqui, para evitar duplo crédito.
            // Aqui apenas exibimos a notificação de desbloqueio da medalha.
            if (badge.id !== 'shopper' && badge.id !== 'apprentice') {
                xpGained += unlockedBadge.xpReward;
            }

            setCelebrationBadge(unlockedBadge);
            const newNotes = [`Nova Conquista Desbloqueada: ${badge.title}!`];
            setNotifications(prev => [...newNotes, ...prev]);
            
            return unlockedBadge;
        }
        
        // Se já está desbloqueada, precisamos retornar o objeto atualizado (com novo XP acumulado)
        // Isso permite que o contador de XP suba (ex: 50 -> 100) mesmo após o desbloqueio inicial
        if (isUnlocked) {
             return { ...badge, unlocked: true, xpReward: currentXpReward, description: currentDescription };
        }

        return badge;
    });

    const hasChanges = JSON.stringify(updatedBadges) !== JSON.stringify(badges);

    if (hasChanges) {
        setBadges(updatedBadges);
        if (xpGained > 0) {
            setUserXP(prev => prev + xpGained);
        }
    }

  }, [transactions, goals, isAuthenticated, learningTotalXP]); 

  // Automated Alerts Check
  useEffect(() => {
    if (!isAuthenticated) return;

    const newNotifications: string[] = [];
    goals.forEach(goal => {
      const pct = (goal.currentAmount / goal.targetAmount) * 100;
      if (pct >= 90 && pct < 100) {
        newNotifications.push(`A meta '${goal.name}' está quase completa (${Math.round(pct)}%)!`);
      }
    });

    setNotifications(prev => {
        const unique = [...new Set([...newNotifications, ...prev])];
        return unique.slice(0, 10);
    });
  }, [goals, isAuthenticated]);

  // Handlers
  const handleStartApp = () => {
    setShowLanding(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLanding(true); // Return to Landing on logout
    setView(ViewState.DASHBOARD);
    setSidebarOpen(false);
  };

  const handleAddTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
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
    const insight = await generateFinancialInsights(filteredTransactions, incomeSources, goals);
    setAiInsight(insight);
    setAiLoading(false);
  };

  const handleEarnXP = (amount: number) => {
    setUserXP(prev => {
        const newTotal = prev + amount;
        return newTotal < 0 ? 0 : newTotal; // Evita XP negativo total
    }); 
    
    if (amount > 0) {
        setNotifications(prev => [`+${amount} XP recebido!`, ...prev]);
    } else {
        // Formatação correta para perda de XP
        setNotifications(prev => [`${amount} XP (Penalidade)`, ...prev]);
    }
  };
  
  const handleEarnLearningXP = (amount: number) => {
    handleEarnXP(amount);
    // Atualiza o rastreador de aprendizado, permitindo flutuação
    setLearningTotalXP(prev => Math.max(0, prev + amount)); 
  };

  // Handler para concluir lista de compras
  const handleConcludeShopping = (total: number, itemsCount: number) => {
    // 1. Geração de Data Local Robusta
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    const currentMonthStr = `${year}-${month}`;

    const newTx: Transaction = {
        id: Date.now().toString(),
        date: today,
        description: `Supermercado (${itemsCount} itens)`,
        amount: total,
        category: 'Lista de Compras', // String EXATA para ativar Badge
        type: 'expense'
    };
    
    // 2. Adiciona a transação
    setTransactions(prev => [newTx, ...prev]);

    // 3. Crédito de XP Simples (sem modal complexo aqui)
    handleEarnXP(50);
    
    // 4. Atualiza Mês para garantir que a transação apareça se o usuário for ver
    setSelectedMonth(currentMonthStr);
    
    setNotifications(prev => [`Compra de R$ ${total.toFixed(2)} registrada!`, ...prev]);
  };

  // --- View Logic ---
  // 1. Landing Page
  if (showLanding) {
    return <LandingPage onStart={handleStartApp} />;
  }

  // 2. Auth Page
  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // 3. Main App
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-inter overflow-hidden transition-colors duration-300">
      
      {/* Gamification Celebration Modal (BADGES) */}
      {celebrationBadge && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border-2 border-yellow-400 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative transform transition-all scale-100">
                <button 
                    onClick={() => setCelebrationBadge(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                    <X size={24} />
                </button>
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Award className="text-yellow-500 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Conquista Desbloqueada!</h2>
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">{celebrationBadge.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{celebrationBadge.description}</p>
                <div className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-semibold">
                    +{celebrationBadge.xpReward} XP Adicionados
                </div>
                <Button className="w-full mt-6" onClick={() => { setCelebrationBadge(null); setView(ViewState.ACHIEVEMENTS); }}>
                    Ver Minha Coleção
                </Button>
            </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="font-bold text-white text-xl">C</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-200 bg-clip-text text-transparent">
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
            active={view === ViewState.SHOPPING_LIST} 
            onClick={() => setView(ViewState.SHOPPING_LIST)} 
            icon={<ShoppingCart size={20} />} 
            label="Lista de Compras" 
          />
          <NavItem 
            active={view === ViewState.INCOME || view === ViewState.GOALS} 
            onClick={() => setView(ViewState.INCOME)} 
            icon={<Target size={20} />} 
            label="Metas & Renda" 
          />
           <NavItem 
            active={view === ViewState.ACHIEVEMENTS} 
            onClick={() => setView(ViewState.ACHIEVEMENTS)} 
            icon={<Award size={20} />} 
            label="Conquistas" 
          />
          <NavItem 
            active={view === ViewState.LEARNING} 
            onClick={() => setView(ViewState.LEARNING)} 
            icon={<GraduationCap size={20} />} 
            label="Aprender" 
          />
           <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <NavItem 
                active={view === ViewState.AI_ADVISOR} 
                onClick={runAIAnalysis} 
                icon={<BrainCircuit size={20} className="text-purple-500 dark:text-purple-400" />} 
                label="Consultor IA"
                className="hover:bg-purple-50 dark:hover:bg-purple-900/20" 
            />
           </div>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {/* Theme Toggle in Menu */}
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mb-2"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</span>
          </button>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 mb-2 relative overflow-hidden group cursor-pointer" onClick={() => setView(ViewState.ACHIEVEMENTS)}>
            <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-500" style={{ width: `${(userXP % 1000) / 10}%` }}></div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white z-10">
                {userLevel}
            </div>
            <div className="overflow-hidden z-10">
                <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">João Silva</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Nível {userLevel} • {userXP} XP</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-4">
            <button 
                className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={24} />
            </button>
            
            {/* Month Filter */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
                <Calendar size={16} className="text-emerald-500" />
                <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-transparent border-none text-sm text-slate-700 dark:text-slate-200 focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
             {/* Notification Bell with Badge */}
            <div className="relative group cursor-pointer">
              <Bell size={20} className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
              )}
              
              {/* Dropdown for notifications */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700 font-medium text-sm text-slate-800 dark:text-slate-200">Notificações</div>
                <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 text-center">Sem novos alertas</div>
                    ) : (
                        notifications.map((note, i) => (
                            <div key={i} className="p-3 text-sm text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
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
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 dark:bg-slate-950 scroll-smooth transition-colors">
            <div className="max-w-7xl mx-auto">
                {view === ViewState.DASHBOARD && (
                    <Dashboard transactions={filteredTransactions} incomeSources={incomeSources} currentTheme={theme} />
                )}
                
                {view === ViewState.TRANSACTIONS && (
                    <Transactions 
                      transactions={filteredTransactions} 
                      onAddTransaction={handleAddTransaction}
                      onUpdateTransaction={handleUpdateTransaction}
                      onRemoveTransaction={handleRemoveTransaction}
                    />
                )}
                
                {view === ViewState.SHOPPING_LIST && (
                    <ShoppingList 
                      onConcludePurchase={handleConcludeShopping} 
                    />
                )}

                {(view === ViewState.INCOME || view === ViewState.GOALS) && (
                    <IncomeGoals 
                        incomeSources={incomeSources}
                        goals={goals}
                        badges={badges}
                        onAddIncomeSource={handleAddIncomeSource}
                        onUpdateIncomeSource={handleUpdateIncomeSource}
                        onRemoveIncomeSource={handleRemoveIncomeSource}
                        onAddGoal={handleAddGoal}
                        onUpdateGoal={handleUpdateGoal}
                        onRemoveGoal={handleRemoveGoal}
                    />
                )}

                {view === ViewState.ACHIEVEMENTS && (
                    <Achievements 
                        badges={badges} 
                        currentXP={userXP} 
                        level={userLevel} 
                        nextLevelXP={nextLevelXP}
                        shoppingListTotal={shoppingListTotal}
                    />
                )}

                {view === ViewState.LEARNING && (
                    <LearningHub onEarnXP={handleEarnLearningXP} />
                )}

                {view === ViewState.AI_ADVISOR && (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <BrainCircuit className="text-purple-500" /> 
                                Análise Financeira com IA
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">
                                Desenvolvido com Gemini 2.5 Flash, obtenha insights personalizados sobre seus hábitos de consumo em 
                                <span className="text-emerald-500 dark:text-emerald-400 font-semibold ml-1">
                                    {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </span>.
                            </p>
                        </div>
                        
                        <AIInsights data={aiInsight} loading={aiLoading} />
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
        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-500/20" 
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
      className
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);