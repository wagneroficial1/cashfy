import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { Card, Button, Input, Select, cn } from './UI';
import { Plus, Search, Filter, TrendingDown, TrendingUp, DollarSign, Pencil, Trash2, X } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  onUpdateTransaction: (t: Transaction) => Promise<void>;
  onRemoveTransaction: (id: string) => Promise<void>;
}

const CATEGORIES = [
  'Alimentação',
  'Casa',
  'Farmácia',
  'Freelance',
  'Geral',
  'Investimento',
  'Negócios',
  'Presente',
  'Shopping',
  'Supermercado',
  'Transporte',
  'YouTube'
].sort();

export const Transactions: React.FC<TransactionsProps> = ({
  transactions, onAddTransaction, onUpdateTransaction, onRemoveTransaction
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState('');

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Animation State
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // New transaction state
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: 'Geral',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.description) return;

    if (editingId) {
      // Update existing
      await onUpdateTransaction({
        id: editingId,
        date: newTx.date!,
        description: newTx.description!,
        amount: Number(newTx.amount),
        category: newTx.category || 'Geral',
        type: newTx.type as TransactionType
      });
    } else {
      // Create new
      await onAddTransaction({
        date: newTx.date!,
        description: newTx.description!,
        amount: Number(newTx.amount),
        category: newTx.category || 'Geral',
        type: newTx.type as TransactionType
      });
    }

    resetForm();
  };

  const handleEditClick = (t: Transaction) => {
    setNewTx({
      type: t.type,
      date: t.date,
      amount: t.amount,
      category: t.category,
      description: t.description
    });
    setEditingId(t.id);
    setIsFormOpen(true);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewTx({
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      category: 'Geral',
      description: ''
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const filteredTransactions = transactions
    .filter(t => t.description.toLowerCase().includes(filter.toLowerCase()) || t.category.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Transações</h2>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus size={18} /> Nova Transação
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className={cn("p-6 border-2 transition-colors", editingId ? "border-blue-500/30 bg-blue-50 dark:bg-blue-900/10" : "border-emerald-500/30")}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={cn("text-lg font-semibold", editingId ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400")}>
              {editingId ? 'Editar Transação' : 'Registrar Pagamento / Receita'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Tipo"
              value={newTx.type}
              onChange={(e) => setNewTx({ ...newTx, type: e.target.value as TransactionType })}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="investment">Investimento</option>
            </Select>
            <Input
              label="Data"
              type="date"
              value={newTx.date}
              onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
            />
            <Input
              label="Valor (R$)"
              type="number"
              step="0.01"
              value={newTx.amount}
              onChange={(e) => setNewTx({ ...newTx, amount: parseFloat(e.target.value) })}
            />
            <Input
              label="Descrição"
              placeholder="ex: Compras do Mês"
              value={newTx.description}
              onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
            />
            <Select
              label="Categoria"
              value={newTx.category}
              onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
            <div className="flex items-end gap-2">
              <Button type="submit" className={cn("w-full", editingId ? "bg-blue-600 hover:bg-blue-700" : "")}>
                {editingId ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar transações..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button variant="ghost" className="hidden md:flex items-center gap-2">
            <Filter size={16} /> Filtrar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase font-medium text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className={cn("hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors",
                  editingId === t.id && "bg-blue-50 dark:bg-blue-900/20",
                  highlightedId === t.id && "bg-emerald-50 dark:bg-emerald-900/20 transition-all duration-1000"
                )}>
                  <td className="px-6 py-4 font-mono text-slate-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{t.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-600">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {t.type === 'income' && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><TrendingUp size={14} /> Receita</span>}
                    {t.type === 'expense' && <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400"><TrendingDown size={14} /> Despesa</span>}
                    {t.type === 'investment' && <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400"><DollarSign size={14} /> Invest.</span>}
                  </td>
                  <td className={cn("px-6 py-4 text-right font-bold",
                    t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : t.type === 'expense' ? "text-slate-800 dark:text-slate-200" : "text-purple-600 dark:text-purple-400"
                  )}>
                    {t.type === 'expense' ? '-' : '+'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(t)}
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onRemoveTransaction(t.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};