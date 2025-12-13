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
  AI_ADVISOR = 'AI_ADVISOR'
}