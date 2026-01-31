

import React, { useState, useMemo, useEffect } from 'react';
import { Translation, NEW_DENOMINATIONS } from '../types';
import { Icons } from './Icons';
import { trackEvent } from '../services/supabaseClient';

interface ChangeCalculatorProps {
  t: Translation;
  enableAnalytics: boolean;
}

const ChangeCalculator: React.FC<ChangeCalculatorProps> = ({ t, enableAnalytics }) => {
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [paidCounts, setPaidCounts] = useState<Record<number, number>>({});

  const amountPaid = useMemo(() => {
    return Object.entries(paidCounts).reduce((acc, [val, count]) => {
      return acc + (Number(val) * Number(count));
    }, 0);
  }, [paidCounts]);

  const changeNeeded = Math.max(0, amountPaid - (parseFloat(totalPrice) || 0));

  useEffect(() => {
    if (enableAnalytics && changeNeeded > 0 && parseFloat(totalPrice) > 0) {
      const handler = setTimeout(() => {
        trackEvent('CONVERSION_OP');
      }, 800);
      return () => clearTimeout(handler);
    }
  }, [changeNeeded, totalPrice, enableAnalytics]);

  const changeBreakdown = useMemo(() => {
    let remaining = changeNeeded;
    const breakdown: Record<number, number> = {};
    
    [...NEW_DENOMINATIONS].sort((a, b) => b.value - a.value).forEach(den => {
      const count = Math.floor(remaining / den.value);
      if (count > 0) {
        breakdown[den.value] = count;
        remaining -= count * den.value;
      }
    });
    
    return { breakdown, remainder: remaining };
  }, [changeNeeded]);

  const handleCountChange = (val: number, delta: number) => {
    setPaidCounts(prev => ({
      ...prev,
      [val]: Math.max(0, (prev[val] || 0) + delta)
    }));
  };

  const reset = () => {
    setTotalPrice('');
    setPaidCounts({});
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:shadow-blue-500/10 group">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
        <h1 className="text-3xl font-black flex items-center gap-4 dark:text-white">
          <div className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Icons.Calculator />
          </div>
          {t.calculator}
        </h1>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-slate-200 dark:border-slate-700"
        >
          <Icons.Refresh className="w-3.5 h-3.5" />
          {t.reset}
        </button>
      </div>

      <div className="space-y-10">
        <div>
          <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">{t.totalPrice}</label>
          <input 
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            placeholder="0"
            className="w-full p-6 rounded-[1.8rem] border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-4xl font-black placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {NEW_DENOMINATIONS.map(den => (
            <div key={den.value} className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700/50 flex flex-col items-center group/den hover:bg-white dark:hover:bg-slate-800 transition-all">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-4">{den.label} {t.newLira}</span>
              <div className="flex items-center justify-between w-full">
                <button 
                  onClick={() => handleCountChange(den.value, -1)}
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 shadow-sm border dark:border-slate-600 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                ><Icons.ArrowSwap className="w-4 h-4 rotate-90" /></button>
                <span className="text-2xl font-black dark:text-white">{paidCounts[den.value] || 0}</span>
                <button 
                  onClick={() => handleCountChange(den.value, 1)}
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 shadow-sm border dark:border-slate-600 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                ><Icons.ArrowSwap className="w-4 h-4 -rotate-90" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800/50 relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-blue-600/60 dark:text-blue-400/60 mb-3">{t.changeNeeded}</label>
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-5xl md:text-6xl font-black text-blue-700 dark:text-blue-300 tracking-tighter">
                {changeNeeded.toLocaleString()}
              </span>
              <span className="text-xl font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">{t.newLira}</span>
            </div>
            
            {changeNeeded > 0 && (
              <div className="space-y-5 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-400/60 uppercase tracking-[0.2em] border-b border-blue-200 dark:border-blue-800 pb-3">
                   <Icons.Features className="w-4 h-4" />
                   {t.denominations}
                </div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(changeBreakdown.breakdown).map(([val, count]) => (
                    <div key={val} className="px-5 py-3 bg-white dark:bg-slate-800/80 backdrop-blur rounded-2xl text-sm shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                      <span className="font-black text-blue-600 dark:text-blue-400 text-lg leading-none">{count}</span>
                      <span className="text-slate-300 dark:text-slate-500">×</span>
                      <span className="font-black dark:text-slate-200 text-base">{val}</span>
                    </div>
                  ))}
                  {changeBreakdown.remainder > 0 && (
                     <div className="px-5 py-3 bg-amber-500/10 border-2 border-amber-500/20 rounded-2xl text-[10px] font-black text-amber-600 uppercase flex items-center gap-2">
                       <Icons.Maintenance className="w-4 h-4" /> + {changeBreakdown.remainder}
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCalculator;