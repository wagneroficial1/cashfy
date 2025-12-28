export type TransactionType = 'expense' | 'income' | 'investment';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface IncomeSource {
  id: string;
  name: string;
  expectedAmount: number;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  balance: number;
  spendingLimit: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  INCOME = 'INCOME',
  GOALS = 'GOALS',
  AI_ADVISOR = 'AI_ADVISOR',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  LEARNING = 'LEARNING',
  SHOPPING_LIST = 'SHOPPING_LIST'
}

// Gamification Types
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'medal' | 'star' | 'target' | 'rocket' | 'shield' | 'book' | 'shopping-cart';
  color: 'gold' | 'silver' | 'bronze' | 'blue' | 'purple';
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

// Nova interface para o retorno estruturado da IA
export interface AIAnalysisResult {
  summary: string;
  healthScore: number; // 0 a 100
  financialStatus: 'Excelente' | 'Bom' | 'Atenção' | 'Crítico';
  trends: {
    icon: 'up' | 'down' | 'flat';
    text: string;
    type: 'positive' | 'negative' | 'neutral';
  }[];
  recommendations: {
    title: string;
    description: string;
    difficulty: 'Fácil' | 'Médio' | 'Difícil';
  }[];
  risks: {
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
}