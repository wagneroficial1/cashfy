import {
  LayoutDashboard, PieChart, Target, Receipt, Menu, X, Bell, BrainCircuit, Calendar, LogOut, Moon, Sun, Award, GraduationCap, ShoppingCart, Trophy, ArrowRight
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { IncomeGoals } from './components/IncomeGoals';
import { AuthPage } from './components/AuthPage';
import { LandingPage } from './components/LandingPage';
import { AIInsights } from './components/AIInsights';
import { Achievements } from './components/Achievements';
import { LearningHub } from './components/LearningHub';
import { ShoppingList } from './components/ShoppingList';
import { PlansPage } from './components/PlansPage';
import { Transaction, IncomeSource, Goal, AIAnalysisResult, Badge, Project } from './types';
import { Button, Card, cn } from './components/UI';
import { generateFinancialInsights } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { projectService } from './services/projectService';
import { goalsService } from './services/goalsService';
import { incomeSourcesService } from './services/incomeSourcesService';
import { transactionsService } from './services/transactionsService';

// Helper for dynamic dates (Current Month) in Local Time
const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
const currentMonth = getCurrentMonth();


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
  const [session, setSession] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setShowLanding(false);
      }
      setInitialLoading(false);
    });

    // Listen for Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowLanding(false);
      }
      // If we logout and was not in landing, show auth
      if (!session && !showLanding) {
        // setShowLanding(false) logic maintained by current state
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Projects on Session Load
  useEffect(() => {
    if (session) {
      projectService.fetchProjects()
        .then(data => {
          console.log("Projects loaded from Supabase:", data);
          setProjects(data);
        })
        .catch(err => console.error("Error loading projects:", err));

      goalsService.fetchGoals()
        .then(data => {
          console.log("Goals loaded from Supabase:", data);
          setGoals(data);
        })
        .catch(err => console.error("Error loading goals:", err));

      incomeSourcesService.fetchIncomeSources()
        .then(data => {
          console.log("Income Sources loaded from Supabase:", data);
          setIncomeSources(data);
        })
        .catch(err => console.error("Error loading income sources:", err));

      transactionsService.fetchTransactions()
        .then(data => {
          console.log("Transactions loaded from Supabase:", data);
          setTransactions(data);
        })
        .catch(err => console.error("Error loading transactions:", err));

      // Load gamification data from user metadata (Persistence Source of Truth)
      if (session.user.user_metadata) {
        const metadata = session.user.user_metadata;
        if (metadata.apprentice_xp !== undefined) {
          setLearningTotalXP(Number(metadata.apprentice_xp));
        }
        if (metadata.completed_lessons) {
          setCompletedLessons(metadata.completed_lessons);
        }
      }
    }
  }, [session]);

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // App State
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Gamification State
  const [badges, setBadges] = useState<Badge[]>(ALL_BADGES);
  const [userXP, setUserXP] = useState(350); // XP Inicial Mock
  const [learningTotalXP, setLearningTotalXP] = useState(0); // XP acumulado apenas via LearningHub
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);

  return (
    <BrowserRouter>
      <AppContent
        session={session}
        initialLoading={initialLoading}
        showLanding={showLanding}
        setShowLanding={setShowLanding}
        setSession={setSession}
        setInitialLoading={setInitialLoading}
        theme={theme}
        setTheme={setTheme}
        projects={projects}
        setProjects={setProjects}
        transactions={transactions}
        setTransactions={setTransactions}
        incomeSources={incomeSources}
        setIncomeSources={setIncomeSources}
        goals={goals}
        setGoals={setGoals}
        notifications={notifications}
        setNotifications={setNotifications}
        badges={badges}
        setBadges={setBadges}
        userXP={userXP}
        setUserXP={setUserXP}
        learningTotalXP={learningTotalXP}
        setLearningTotalXP={setLearningTotalXP}
        completedLessons={completedLessons}
        setCompletedLessons={setCompletedLessons}
        celebrationBadge={celebrationBadge}
        setCelebrationBadge={setCelebrationBadge}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        aiLoading={aiLoading}
        setAiLoading={setAiLoading}
        aiInsight={aiInsight}
        setAiInsight={setAiInsight}
        userLevel={userLevel}
        nextLevelXP={nextLevelXP}
        hasHydrated={hasHydrated}
        shownAchievementIds={shownAchievementIds}
        setShownAchievementIds={setShownAchievementIds}
        shoppingListTotal={shoppingListTotal}
        toggleTheme={toggleTheme}
        filteredTransactions={filteredTransactions}
      />
    </BrowserRouter>
  );
}

function AppContent({
  session,
  initialLoading,
  showLanding,
  setShowLanding,
  setSession,
  setInitialLoading,
  theme,
  setTheme,
  projects,
  setProjects,
  transactions,
  setTransactions,
  incomeSources,
  setIncomeSources,
  goals,
  setGoals,
  notifications,
  setNotifications,
  badges,
  setBadges,
  userXP,
  setUserXP,
  learningTotalXP,
  setLearningTotalXP,
  completedLessons,
  setCompletedLessons,
  celebrationBadge,
  setCelebrationBadge,
  selectedMonth,
  setSelectedMonth,
  aiLoading,
  setAiLoading,
  aiInsight,
  setAiInsight,
  userLevel,
  nextLevelXP,
  hasHydrated,
  shownAchievementIds,
  setShownAchievementIds,
  shoppingListTotal,
  toggleTheme,
  filteredTransactions
}: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- Gamification Engine ---
  useEffect(() => {
    if (!session) return;

    let newBadgeIdsToNotify: string[] = [];
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
      if (badge.id === 'shopper') {
        const shopCount = transactions.filter(t => t.category === 'Lista de Compras').length;
        if (shopCount > 0) {
          isUnlocked = true;
          currentXpReward = shopCount * 50;
        }
      }

      const totalSavedInGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);
      if (badge.id === 'safe_guard' && totalSavedInGoals >= 10000) isUnlocked = true;

      // --- Badge de Aprendiz ---
      if (badge.id === 'apprentice') {
        currentDescription = `Conquistou ${learningTotalXP} XP em aprendizado.`;
        if (learningTotalXP > 0) {
          currentXpReward = learningTotalXP;
        }
        if (learningTotalXP >= 50) isUnlocked = true;
      }

      // Detect newly unlocked badge
      if (isUnlocked && !badge.unlocked) {
        currentUnlockedAt = new Date().toISOString();
        const unlockedBadge = { ...badge, unlocked: true, unlockedAt: currentUnlockedAt, xpReward: currentXpReward, description: currentDescription };

        // Logic to gain XP (only once)
        if (badge.id !== 'shopper' && badge.id !== 'apprentice') {
          xpGained += unlockedBadge.xpReward;
        }

        // Detect if we should show notification
        if (hasHydrated.current && !shownAchievementIds.has(badge.id)) {
          newBadgeIdsToNotify.push(badge.id);
          setCelebrationBadge(unlockedBadge);
          setNotifications(prev => [`Nova Conquista: ${badge.title}!`, ...prev]);
        }

        return unlockedBadge;
      }

      // Ensure descriptions and XP stay updated even if already unlocked
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

      // Update shown IDs if any notifications were triggered
      if (newBadgeIdsToNotify.length > 0) {
        setShownAchievementIds(prev => {
          const next = new Set(prev);
          newBadgeIdsToNotify.forEach(id => next.add(id));
          return next;
        });
      }
    }

    // After the first analysis run, mark as hydrated
    // This ensures popups only happen on the SECOND run onwards (real events)
    if (session) {
      hasHydrated.current = true;
    }

  }, [transactions, goals, session, learningTotalXP, shownAchievementIds]);

  // Automated Alerts Check
  useEffect(() => {
    if (!session) return;

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
  }, [goals, session]);

  // Handlers
  const handleStartApp = () => {
    setShowLanding(false);
  };

  const handleLogin = () => {
    // Session is handled by onAuthStateChange
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLanding(true); // Return to Landing on logout
    navigate('/');
    setSidebarOpen(false);
  };

  const handleAddTransaction = async (t: Omit<Transaction, 'id'>) => {
    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const optimisticTx: Transaction = { ...t, id: tempId };

    setTransactions(prev => [optimisticTx, ...prev]);

    try {
      console.log("Starting transaction creation in Supabase...", t);
      const newTransaction = await transactionsService.createTransaction(t);
      console.log("Transaction created successfully:", newTransaction);

      // Replace optimistic transaction with real one
      setTransactions(prev => prev.map(tx => tx.id === tempId ? newTransaction : tx));

      // Side effect: If investment, update the first goal locally (legacy logic)
      if (t.type === 'investment') {
        if (goals.length > 0) {
          const updatedGoals = [...goals];
          updatedGoals[0].currentAmount += t.amount;
          setGoals(updatedGoals);
        }
      }

      setNotifications(prev => [`Lançamento "${t.description}" realizado!`, ...prev]);
    } catch (error: any) {
      // Rollback optimistic update
      setTransactions(prev => prev.filter(tx => tx.id !== tempId));

      console.error("CRITICAL ERROR adding transaction:", error);
      console.error("Error Message:", error.message);
      console.error("Error Details:", error.details || "No details");
      console.error("Error Hint:", error.hint || "No hint");

      alert(`Erro ao salvar no banco: ${error.message || "Erro desconhecido"}. A transação foi removida da lista.`);
    }
  };

  const handleUpdateTransaction = async (updated: Transaction) => {
    const original = transactions.find(t => t.id === updated.id);
    // Optimistic update
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));

    try {
      const savedTransaction = await transactionsService.updateTransaction(updated);
      setTransactions(prev => prev.map(t => t.id === savedTransaction.id ? savedTransaction : t));
      setNotifications(prev => [`Lançamento "${updated.description}" atualizado!`, ...prev]);
    } catch (error: any) {
      // Rollback
      if (original) {
        setTransactions(prev => prev.map(t => t.id === updated.id ? original : t));
      }
      console.error("Error updating transaction:", error);
      alert(`Erro ao atualizar no banco: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleRemoveTransaction = async (id: string) => {
    const original = transactions.find(t => t.id === id);
    // Optimistic update
    setTransactions(prev => prev.filter(t => t.id !== id));

    try {
      await transactionsService.deleteTransaction(id);
      setNotifications(prev => ["Lançamento removido.", ...prev]);
    } catch (error: any) {
      // Rollback
      if (original) {
        setTransactions(prev => [...prev, original]);
      }
      console.error("Error removing transaction:", error);
      alert(`Erro ao remover no banco: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleAddIncomeSource = async (s: Omit<IncomeSource, 'id'>) => {
    try {
      const newSource = await incomeSourcesService.createIncomeSource(s);
      setIncomeSources(prev => [...prev, newSource]);
      setNotifications(prev => [`Fonte "${s.name}" adicionada!`, ...prev]);
    } catch (error: any) {
      console.error("Error adding income source:", error);
      alert(`Erro ao adicionar fonte de renda: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleUpdateIncomeSource = async (updated: IncomeSource) => {
    try {
      const savedSource = await incomeSourcesService.updateIncomeSource(updated);
      setIncomeSources(prev => prev.map(s => s.id === savedSource.id ? savedSource : s));
      setNotifications(prev => [`Fonte "${updated.name}" atualizada!`, ...prev]);
    } catch (error: any) {
      console.error("Error updating income source:", error);
      alert(`Erro ao atualizar fonte de renda: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleRemoveIncomeSource = async (id: string) => {
    try {
      await incomeSourcesService.deleteIncomeSource(id);
      setIncomeSources(prev => prev.filter(s => s.id !== id));
      setNotifications(prev => ["Fonte de renda removida.", ...prev]);
    } catch (error: any) {
      console.error("Error removing income source:", error);
      alert(`Erro ao remover fonte de renda: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleAddGoal = async (g: Goal) => {
    try {
      const newGoal = await goalsService.createGoal(g);
      setGoals(prev => [...prev, newGoal]);
      setNotifications(prev => [`Meta "${g.name}" criada!`, ...prev]);
    } catch (error: any) {
      console.error("Error creating goal - Full Details:", error);
      console.error("Error Message:", error.message);
      console.error("Error Hint:", error.hint || "No hint");
      console.error("Error Details:", error.details || "No details");
      alert(`Erro ao criar meta: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleUpdateGoal = (updated: Goal) => {
    // TODO: Implement update goal service
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
  };

  const handleRemoveGoal = async (id: string) => {
    try {
      await goalsService.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      setNotifications(prev => ["Meta removida.", ...prev]);
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Erro ao remover meta.");
    }
  };

  const handleAddProject = async (name: string) => {
    try {
      const newProject = await projectService.createProject(name);
      setProjects(prev => [newProject, ...prev]);
      setNotifications(prev => [`Projeto "${name}" criado com sucesso!`, ...prev]);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Erro ao criar projeto.");
    }
  };

  const runAIAnalysis = async () => {
    setAiLoading(true);
    navigate('/ia');
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

  const handleEarnLearningXP = async (amount: number, moduleId?: string) => {
    // Check for success and idempotency (if moduleId provided)
    if (amount > 0 && moduleId) {
      if (completedLessons.includes(moduleId)) {
        console.log(`Lesson ${moduleId} already completed. XP skipped.`);
        return;
      }

      const newXP = learningTotalXP + amount;
      const newCompleted = [...completedLessons, moduleId];

      // Update Supabase (Source of Truth)
      const { error } = await supabase.auth.updateUser({
        data: {
          apprentice_xp: newXP,
          completed_lessons: newCompleted
        }
      });

      if (!error) {
        setLearningTotalXP(newXP);
        setCompletedLessons(newCompleted);
        handleEarnXP(amount);
      } else {
        console.error("Error persisting XP to metadata:", error);
      }
    } else {
      // Penalty or direct update without moduleId (legacy)
      handleEarnXP(amount);
      setLearningTotalXP(prev => Math.max(0, prev + amount));
    }
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

  // 0. Splash Screen / Initial Loading
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
          <span className="font-bold text-white text-3xl">C</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  // 1. Landing Page
  if (showLanding && !session) {
    return <LandingPage onStart={handleStartApp} />;
  }

  // 2. Auth Page
  if (!session) {
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
            <Button className="w-full mt-6" onClick={() => { setCelebrationBadge(null); navigate('/conquistas'); }}>
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
            to="/"
            icon={<LayoutDashboard size={20} />}
            label="Visão Geral"
          />
          <NavItem
            to="/transacoes"
            icon={<Receipt size={20} />}
            label="Transações"
          />
          <NavItem
            to="/lista-compras"
            icon={<ShoppingCart size={20} />}
            label="Lista de Compras"
          />
          <NavItem
            to="/metas"
            icon={<Target size={20} />}
            label="Metas & Renda"
          />
          <NavItem
            to="/conquistas"
            icon={<Award size={20} />}
            label="Conquistas"
          />
          <NavItem
            to="/aprender"
            icon={<GraduationCap size={20} />}
            label="Aprender"
          />
          <NavItem
            to="/planos"
            icon={<Trophy size={20} />}
            label="Planos"
          />
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <NavItem
              to="/ia"
              icon={<BrainCircuit size={20} className="text-purple-500 dark:text-purple-400" />}
              label="Consultor IA"
              className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
              onClick={runAIAnalysis}
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

          <div
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 mb-2 relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/conquistas')}
          >
            <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-500" style={{ width: `${(userXP % 1000) / 10}%` }}></div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white z-10">
              {userLevel}
            </div>
            <div className="overflow-hidden z-10">
              <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">{session?.user?.user_metadata?.name || 'Usuário'}</p>
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
            <Routes>
              <Route path="/" element={
                <Dashboard
                  transactions={filteredTransactions}
                  incomeSources={incomeSources}
                  currentTheme={theme}
                  projects={projects}
                  onAddProject={handleAddProject}
                />
              } />

              <Route path="/transacoes" element={
                <Transactions
                  transactions={filteredTransactions}
                  onAddTransaction={handleAddTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                  onRemoveTransaction={handleRemoveTransaction}
                />
              } />

              <Route path="/lista-compras" element={
                <ShoppingList
                  onConcludePurchase={handleConcludeShopping}
                />
              } />

              <Route path="/metas" element={
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
              } />

              <Route path="/conquistas" element={
                <Achievements
                  badges={badges}
                  currentXP={userXP}
                  level={userLevel}
                  nextLevelXP={nextLevelXP}
                  shoppingListTotal={shoppingListTotal}
                />
              } />

              <Route path="/aprender" element={
                <LearningHub onEarnXP={handleEarnLearningXP} />
              } />

              <Route path="/planos" element={
                <PlansPage onBack={() => navigate(-1)} />
              } />

              <Route path="/ia" element={
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
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

// Updated Sub-component for Nav Items to use NavLink
const NavItem = ({ to, icon, label, onClick, className }: any) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-500/20"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
      className
    )}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);