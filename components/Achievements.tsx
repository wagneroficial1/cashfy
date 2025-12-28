import React from 'react';
import { Badge } from '../types';
import { Card, cn } from './UI';
import { Trophy, Medal, Star, Target, Rocket, Shield, Lock, BookOpen, ShoppingCart } from 'lucide-react';

interface AchievementsProps {
  badges: Badge[];
  currentXP: number;
  level: number;
  nextLevelXP: number;
  shoppingListTotal?: number;
}

export const Achievements: React.FC<AchievementsProps> = ({ badges, currentXP, level, nextLevelXP, shoppingListTotal }) => {
  
  const getIcon = (iconName: string, className?: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className={className} />;
      case 'medal': return <Medal className={className} />;
      case 'star': return <Star className={className} />;
      case 'target': return <Target className={className} />;
      case 'rocket': return <Rocket className={className} />;
      case 'shield': return <Shield className={className} />;
      case 'book': return <BookOpen className={className} />;
      case 'shopping-cart': return <ShoppingCart className={className} />;
      default: return <Star className={className} />;
    }
  };

  const getBadgeColor = (color: string, unlocked: boolean) => {
    if (!unlocked) return "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border-slate-300 dark:border-slate-700";
    
    switch (color) {
      case 'gold': return "bg-yellow-100 text-yellow-600 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-500/50";
      case 'silver': return "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
      case 'bronze': return "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-500/50";
      case 'purple': return "bg-purple-100 text-purple-600 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-500/50";
      case 'blue': return "bg-blue-100 text-blue-600 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/50";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const progressPercent = Math.min(100, (currentXP / nextLevelXP) * 100);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Level Progress */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center relative">
              <span className="text-4xl font-bold">{level}</span>
              <div className="absolute -bottom-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Nível
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1">Perfil do Investidor</h2>
            <p className="text-indigo-100 mb-4 text-sm">Continue completando metas para subir de nível!</p>
            
            <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
              <div 
                className="bg-yellow-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-indigo-100">
              <span>{currentXP} XP</span>
              <span>{nextLevelXP} XP (Próximo Nível)</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
             <span className="text-3xl font-bold">{unlockedCount}/{badges.length}</span>
             <span className="text-xs text-indigo-100 uppercase tracking-wide">Medalhas</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Medal className="text-yellow-500" /> Suas Conquistas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <Card 
                key={badge.id} 
                className={cn(
                    "p-5 flex items-start gap-4 transition-all duration-300 border-2",
                    badge.unlocked ? "hover:-translate-y-1 hover:shadow-md bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-950 opacity-70 grayscale"
                )}
            >
              <div className={cn("p-3 rounded-xl border-2 flex-shrink-0 relative", getBadgeColor(badge.color, badge.unlocked))}>
                {getIcon(badge.icon, "w-8 h-8")}
                {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-[1px] rounded-lg">
                        <Lock size={16} className="text-slate-500" />
                    </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className={cn("font-bold mb-1", badge.unlocked ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-500")}>
                        {badge.title}
                    </h4>
                    {badge.unlocked && (
                         <span className="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">
                            +{badge.xpReward} XP
                         </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight">
                    {badge.description}
                </p>
                {badge.unlocked && badge.unlockedAt && (
                    <p className="text-[10px] text-slate-400 mt-2">
                        Conquistado em: {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                    </p>
                )}
                
                {/* Visualização Especial para o Comprador (Total de Compras) */}
                {badge.id === 'shopper' && badge.unlocked && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Total em Compras
                        </p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            R$ {shoppingListTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};