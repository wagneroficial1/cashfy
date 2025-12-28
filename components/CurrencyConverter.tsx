
import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button, cn } from './UI';
import { ArrowRightLeft, Coins, RefreshCw } from 'lucide-react';
import { getExchangeRate } from '../services/currencyService';

const CURRENCIES = [
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' },
];

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchRate = async () => {
    setLoading(true);
    const currentRate = await getExchangeRate(fromCurrency, toCurrency);
    setRate(currentRate);
    setLastUpdated(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    setLoading(false);
  };

  useEffect(() => {
    fetchRate();
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedValue = rate ? (amount * rate) : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Coins className="text-amber-500" /> Conversor
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
            {lastUpdated ? `Atualizado às ${lastUpdated}` : 'Atualizando...'}
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <Select 
            label="De" 
            value={fromCurrency} 
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
          </Select>

          <Button 
            variant="ghost" 
            onClick={handleSwap}
            className="mb-1 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Inverter Moedas"
          >
            <ArrowRightLeft size={16} className="text-slate-500" />
          </Button>

          <Select 
            label="Para" 
            value={toCurrency} 
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
          </Select>
        </div>

        <Input 
          type="number" 
          label="Valor"
          value={amount} 
          onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value)))}
          min="0"
        />

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center justify-center text-center">
            {loading ? (
               <RefreshCw className="animate-spin text-slate-400 mb-2" />
            ) : (
              <>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}
                </p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                  {CURRENCIES.find(c => c.code === toCurrency)?.flag} {convertedValue.toLocaleString('pt-BR', { style: 'currency', currency: toCurrency })}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
