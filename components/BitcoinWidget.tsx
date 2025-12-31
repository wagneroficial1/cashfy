import React, { useState, useEffect } from 'react';
import { Card, cn } from './UI';
import { TrendingUp, TrendingDown, RefreshCw, Bitcoin } from 'lucide-react';

export const BitcoinWidget: React.FC = () => {
    const [data, setData] = useState<{ price: number; change24h: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchPrice = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl&include_24hr_change=true');
            if (!response.ok) throw new Error('API Error');
            const result = await response.json();

            setData({
                price: result.bitcoin.brl,
                change24h: result.bitcoin.brl_24h_change
            });
            setError(false);
            setLastRefresh(new Date());
        } catch (err) {
            console.error("Error fetching BTC price:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrice();
        const interval = setInterval(fetchPrice, 60000); // 1 minute refresh
        return () => clearInterval(interval);
    }, []);

    const isPositive = data ? data.change24h >= 0 : true;

    return (
        <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all border-emerald-500/10 dark:border-emerald-500/5">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/10 transition-all" />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center text-orange-500">
                        <Bitcoin size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Bitcoin Hoje</h3>
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded tracking-wider uppercase">BTC</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Atualização em tempo real (BRL)</p>
                    </div>
                </div>

                <div className="text-right">
                    {loading && !data ? (
                        <div className="animate-pulse flex flex-col items-end gap-2">
                            <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                    ) : (
                        <>
                            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                R$ {data?.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <div className={cn(
                                "flex items-center justify-end gap-1 font-bold text-sm mt-1",
                                isPositive ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {data?.change24h.toFixed(2)}%
                                <span className="text-[10px] text-slate-400 font-medium ml-1">(24h)</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] font-medium text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-1.5">
                    <RefreshCw size={12} className={cn("text-emerald-500", loading && "animate-spin")} />
                    <span>Próxima atualização em 60s</span>
                </div>
                <span>Ref: {lastRefresh.toLocaleTimeString('pt-BR')}</span>
            </div>

            {error && !data && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                    <p className="text-sm text-rose-500 font-medium">Erro ao carregar cotação.<br />Tente novamente mais tarde.</p>
                </div>
            )}
        </Card>
    );
};
