import React, { useState } from 'react';
import { IncomeSource, Goal } from '../types';
import { Card, Button, Input, cn } from './UI';
import { Target, Trash2, PlusCircle, CheckCircle, Pencil, X, Check, AlertTriangle } from 'lucide-react';

interface IncomeGoalsProps {
  incomeSources: IncomeSource[];
  goals: Goal[];
  onAddIncomeSource: (source: IncomeSource) => void;
  onUpdateIncomeSource: (source: IncomeSource) => void;
  onRemoveIncomeSource: (id: string) => void;
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onRemoveGoal: (id: string) => void;
}

export const IncomeGoals: React.FC<IncomeGoalsProps> = ({ 
    incomeSources, goals, onAddIncomeSource, onUpdateIncomeSource, onRemoveIncomeSource, onAddGoal, onUpdateGoal, onRemoveGoal
}) => {
  // Income State
  const [newSource, setNewSource] = useState({ name: '', expectedAmount: 0 });
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  // Goal State
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: 0, currentAmount: 0 });
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  // --- Income Source Logic ---
  const handleSubmitSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || newSource.expectedAmount <= 0) return;
    
    if (editingSourceId) {
        const original = incomeSources.find(s => s.id === editingSourceId);
        if (original) {
            onUpdateIncomeSource({
                ...original,
                name: newSource.name,
                expectedAmount: Number(newSource.expectedAmount)
            });
        }
        setEditingSourceId(null);
    } else {
        const colors = ['#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fbbf24'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        onAddIncomeSource({
            id: Date.now().toString(),
            name: newSource.name,
            expectedAmount: Number(newSource.expectedAmount),
            color: randomColor
        });
    }
    setNewSource({ name: '', expectedAmount: 0 });
  };

  const startEditingSource = (source: IncomeSource) => {
      setNewSource({ name: source.name, expectedAmount: source.expectedAmount });
      setEditingSourceId(source.id);
  };

  const cancelEditingSource = () => {
      setNewSource({ name: '', expectedAmount: 0 });
      setEditingSourceId(null);
  };

  // --- Goal Logic ---
  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || newGoal.targetAmount <= 0) return;

    if (editingGoalId) {
        // Update existing goal
        onUpdateGoal({
            id: editingGoalId,
            name: newGoal.name,
            targetAmount: Number(newGoal.targetAmount),
            currentAmount: Number(newGoal.currentAmount)
        });
        setEditingGoalId(null);
    } else {
        // Create new goal
        onAddGoal({
            id: Date.now().toString(),
            name: newGoal.name,
            targetAmount: Number(newGoal.targetAmount),
            currentAmount: Number(newGoal.currentAmount)
        });
    }
    setNewGoal({ name: '', targetAmount: 0, currentAmount: 0 });
  };

  const startEditingGoal = (goal: Goal) => {
      setNewGoal({ name: goal.name, targetAmount: goal.targetAmount, currentAmount: goal.currentAmount });
      setEditingGoalId(goal.id);
      // Ensure we are not in delete mode for this item
      setDeletingGoalId(null);
      // Scroll to top of goal section (optional, but good UX)
      document.getElementById('goal-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEditingGoal = () => {
      setNewGoal({ name: '', targetAmount: 0, currentAmount: 0 });
      setEditingGoalId(null);
  };

  const toggleDeleteConfirmation = (id: string) => {
      if (deletingGoalId === id) {
          setDeletingGoalId(null); // Cancel
      } else {
          setDeletingGoalId(id); // Start confirmation
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Income Source Manager */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <PlusCircle className="text-emerald-500" /> Fontes de Renda
        </h2>
        
        <Card className="p-6">
            <form onSubmit={handleSubmitSource} className="flex flex-col gap-4 mb-6">
                <Input 
                    placeholder="Nome da Fonte (ex: YouTube)" 
                    value={newSource.name} 
                    onChange={e => setNewSource({...newSource, name: e.target.value})}
                />
                <div className="flex gap-2">
                    <Input 
                        type="number" 
                        placeholder="Valor Mensal Esperado" 
                        className="flex-1"
                        value={newSource.expectedAmount || ''} 
                        onChange={e => setNewSource({...newSource, expectedAmount: parseFloat(e.target.value)})}
                    />
                    {editingSourceId ? (
                        <div className="flex gap-2">
                             <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Salvar</Button>
                             <Button type="button" variant="secondary" onClick={cancelEditingSource}><X size={20} /></Button>
                        </div>
                    ) : (
                        <Button type="submit">Adicionar</Button>
                    )}
                </div>
            </form>

            <div className="space-y-3">
                {incomeSources.map(source => (
                    <div key={source.id} className={cn("flex items-center justify-between p-4 rounded-lg border transition-colors", 
                        editingSourceId === source.id ? "bg-blue-900/20 border-blue-500/50" : "bg-slate-900 border-slate-700"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ background: source.color }} />
                            <div>
                                <h4 className="font-medium text-slate-200">{source.name}</h4>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-emerald-400 mr-2">R$ {source.expectedAmount.toLocaleString('pt-BR')}</span>
                            
                            <button 
                                onClick={() => startEditingSource(source)}
                                className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-800"
                                title="Editar"
                            >
                                <Pencil size={16} />
                            </button>
                            <button 
                                onClick={() => onRemoveIncomeSource(source.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-slate-800"
                                title="Excluir"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {incomeSources.length === 0 && <p className="text-slate-500 text-center py-4">Nenhuma fonte ainda.</p>}
            </div>
        </Card>
      </div>

      {/* Goal Tracker */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="text-purple-500" /> Metas Financeiras
        </h2>

        <Card className="p-6">
            <div id="goal-form">
                <form onSubmit={handleSubmitGoal} className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            {editingGoalId ? 'Editar Meta & Aportes' : 'Nova Meta'}
                        </h3>
                        {editingGoalId && (
                            <button type="button" onClick={cancelEditingGoal} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                                <X size={12} /> Cancelar Edição
                            </button>
                        )}
                    </div>
                    <Input 
                        placeholder="Nome da Meta (ex: Carro Novo)" 
                        value={newGoal.name} 
                        onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Input 
                            label="Valor Alvo"
                            type="number" 
                            placeholder="R$ Alvo" 
                            value={newGoal.targetAmount || ''} 
                            onChange={e => setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value)})}
                        />
                        <Input 
                            label="Valor Atual (Aportes)"
                            type="number" 
                            placeholder="R$ Atual" 
                            value={newGoal.currentAmount || ''} 
                            onChange={e => setNewGoal({...newGoal, currentAmount: parseFloat(e.target.value)})}
                        />
                    </div>
                    {editingGoalId ? (
                        <Button type="submit" variant="primary" className="bg-blue-600 hover:bg-blue-700 shadow-blue-900/20">
                            Atualizar Meta
                        </Button>
                    ) : (
                        <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700 shadow-purple-900/20">
                            Adicionar Meta
                        </Button>
                    )}
                </form>
            </div>

            <div className="space-y-6">
                {goals.map(goal => {
                    const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                    const isDeleting = deletingGoalId === goal.id;
                    const isEditing = editingGoalId === goal.id;

                    return (
                        <div key={goal.id} className={cn(
                            "p-4 rounded-xl border transition-all duration-300 relative overflow-hidden",
                            isDeleting ? "bg-rose-900/20 border-rose-500/50" : 
                            isEditing ? "bg-blue-900/10 border-blue-500/50" : "bg-slate-900 border-slate-700"
                        )}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                                        {goal.name}
                                        {isEditing && <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded">Editando</span>}
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        <span className="text-emerald-400 font-mono font-medium">R$ {goal.currentAmount.toLocaleString('pt-BR')}</span> 
                                        <span className="mx-1">/</span> 
                                        R$ {goal.targetAmount.toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-1">
                                    {isDeleting ? (
                                        <div className="flex items-center gap-2 animate-fade-in bg-slate-950/80 p-1 rounded-lg border border-rose-500/30">
                                            <span className="text-xs text-rose-300 font-medium px-1">Excluir?</span>
                                            <button 
                                                onClick={() => onRemoveGoal(goal.id)}
                                                className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors"
                                                title="Confirmar Exclusão"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button 
                                                onClick={() => toggleDeleteConfirmation(goal.id)}
                                                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition-colors"
                                                title="Cancelar"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className={cn("text-lg font-bold mr-3", percentage >= 100 ? "text-emerald-400" : "text-purple-400")}>
                                                {percentage}%
                                            </span>
                                            <button 
                                                onClick={() => startEditingGoal(goal)}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                title="Editar Valor/Meta"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => toggleDeleteConfirmation(goal.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded-lg transition-colors"
                                                title="Excluir Meta"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
                                <div 
                                    className={cn("h-full transition-all duration-1000 ease-out", percentage >= 100 ? "bg-emerald-500" : "bg-purple-500")}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            
                            {percentage >= 90 && percentage < 100 && !isDeleting && (
                                <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1 animate-pulse">
                                    <AlertTriangle size={12} /> Quase lá! Continue assim!
                                </p>
                            )}
                             {percentage >= 100 && !isDeleting && (
                                <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                                    <CheckCircle size={12} /> Meta Alcançada!
                                </p>
                            )}
                        </div>
                    );
                })}
                {goals.length === 0 && <p className="text-slate-500 text-center py-4">Nenhuma meta definida.</p>}
            </div>
        </Card>
      </div>

    </div>
  );
};