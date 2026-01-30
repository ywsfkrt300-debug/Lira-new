import React, { useState, useMemo, useEffect } from 'react';
import { Translation, CONVERSION_RATE } from '../types';
import { Icons } from './Icons';
import { trackEvent } from '../services/supabaseClient';

interface ConverterProps {
  t: Translation;
  lang: 'ar' | 'en';
  enableAnalytics: boolean;
}

type CurrencyKey = 'SYP_NEW' | 'SYP_OLD';

const Converter: React.FC<ConverterProps> = ({ t, lang, enableAnalytics }) => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<CurrencyKey>('SYP_OLD');
  const [toCurrency, setToCurrency] = useState<CurrencyKey>('SYP_NEW');

  const currencies = useMemo(() => [
    { id: 'SYP_NEW' as const, label: lang === 'ar' ? 'ليرة سورية جديدة' : 'New Syrian Lira' },
    { id: 'SYP_OLD' as const, label: lang === 'ar' ? 'ليرة سورية قديمة' : 'Old Syrian Lira' },
  ], [lang]);

  const calculateResult = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val === 0) return 0;

    if (fromCurrency === 'SYP_OLD' && toCurrency === 'SYP_NEW') {
      return val / CONVERSION_RATE; 
    } else if (fromCurrency === 'SYP_NEW' && toCurrency === 'SYP_OLD') {
      return val * CONVERSION_RATE; 
    }
    return val;
  };
  
  // Track conversion operations with debouncing to avoid excessive calls
  useEffect(() => {
    // A conversion is any action that results in a new, non-zero calculation.
    // We debounce to consolidate rapid changes (like typing) into a single event.
    if (enableAnalytics && parseFloat(amount) > 0) {
      const handler = setTimeout(() => {
        trackEvent('CONVERSION_OP');
      }, 800);
      
      return () => {
        clearTimeout(handler);
      };
    }
  }, [amount, fromCurrency, toCurrency, enableAnalytics]);

  const result = calculateResult();

  const swapCurrencies = () => {
    const tempFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempFrom);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 md:p-12 rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-700/50 transition-all duration-500 hover:shadow-emerald-500/10 group">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-black flex items-center gap-4 dark:text-white">
          <div className="flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <Icons.Converter />
          </div>
          {t.converter}
        </h2>
      </div>

      <div className="space-y-10">
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1">{t.from}</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 min-w-0 px-8 py-6 rounded-[1.8rem] border-2 border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 dark:text-white focus:border-emerald-500 outline-none transition-all text-3xl font-black shadow-inner"
            />
            <select 
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as CurrencyKey)}
              className="sm:w-56 py-6 px-6 rounded-[1.8rem] border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white font-black text-lg outline-none focus:border-emerald-500 cursor-pointer shadow-sm appearance-none text-center"
            >
              {currencies.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center -my-6 relative z-10">
          <button 
            onClick={swapCurrencies}
            className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-slate-800 hover:rotate-180 transition-all duration-500 active:scale-90"
          >
             <Icons.ArrowSwap className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1">{t.to}</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 py-6 px-8 rounded-[1.8rem] bg-emerald-500/5 dark:bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-4xl overflow-hidden truncate shadow-inner">
              {result.toLocaleString(undefined, { 
                maximumFractionDigits: toCurrency === 'SYP_NEW' ? 2 : 0 
              })}
            </div>
            <select 
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as CurrencyKey)}
              className="sm:w-56 py-6 px-6 rounded-[1.8rem] border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white font-black text-lg outline-none focus:border-emerald-500 cursor-pointer shadow-sm appearance-none text-center"
            >
              {currencies.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] border dark:border-slate-700 shadow-sm">
           <span className="text-emerald-500">1 {t.newLira}</span>
           <span className="text-slate-300">|</span>
           <span>100 {t.oldLira}</span>
        </div>
      </div>
    </div>
  );
};

export default Converter;