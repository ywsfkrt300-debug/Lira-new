
import React, { useState, useMemo, useEffect } from 'react';
import { Translation, ElectricityTariff } from '../types';
import { ELECTRICITY_TARIFFS } from '../constants';
import { Icons } from './Icons';
import { trackEvent } from '../services/supabaseClient';

interface ElectricityCalculatorProps {
  t: Translation;
  lang: 'ar' | 'en';
  enableAnalytics: boolean;
}

interface BillResult {
  total: number;
  breakdown: {
    tier: string;
    consumption: number;
    rate: number;
    cost: number;
  }[];
}

const ElectricityCalculator: React.FC<ElectricityCalculatorProps> = ({ t, lang, enableAnalytics }) => {
  const [consumption, setConsumption] = useState<string>('');
  const [tariffId, setTariffId] = useState<string>(ELECTRICITY_TARIFFS[0].id);

  const reset = () => {
    setConsumption('');
    setTariffId(ELECTRICITY_TARIFFS[0].id);
  };

  const selectedTariff = useMemo(() => {
    return ELECTRICITY_TARIFFS.find(tariff => tariff.id === tariffId) as ElectricityTariff;
  }, [tariffId]);
  
  const billResult = useMemo<BillResult | null>(() => {
    const cons = parseFloat(consumption);
    if (isNaN(cons) || cons <= 0) return null;

    const result: BillResult = { total: 0, breakdown: [] };

    if (selectedTariff.type === 'flat' && selectedTariff.rate) {
      result.total = cons * selectedTariff.rate;
      result.breakdown.push({
        tier: t.consumption,
        consumption: cons,
        rate: selectedTariff.rate,
        cost: result.total,
      });
    } else if (selectedTariff.type === 'tiered' && selectedTariff.tiers) {
      let remainingCons = cons;
      let lastLimit = 0;

      for (let i = 0; i < selectedTariff.tiers.length; i++) {
        const tier = selectedTariff.tiers[i];
        const tierLimit = tier.limit === null ? Infinity : tier.limit;
        
        const consumptionInTier = Math.min(remainingCons, tierLimit - lastLimit);
        
        if (consumptionInTier > 0) {
            const cost = consumptionInTier * tier.price;
            result.total += cost;
            result.breakdown.push({
                tier: `${t.tier} ${i + 1} (${lastLimit + 1} - ${tier.limit ?? '∞'})`,
                consumption: consumptionInTier,
                rate: tier.price,
                cost: cost,
            });
            remainingCons -= consumptionInTier;
            lastLimit = tierLimit;
        }

        if (remainingCons <= 0) break;
      }
    }
    
    return result;
  }, [consumption, selectedTariff, t, lang]);

  useEffect(() => {
    if (enableAnalytics && billResult && billResult.total > 0) {
      const handler = setTimeout(() => {
        trackEvent('CONVERSION_OP');
      }, 800);
      return () => clearTimeout(handler);
    }
  }, [billResult, enableAnalytics]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 transition-all duration-500 hover:shadow-amber-500/10 group">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
        <h2 className="text-3xl font-black flex items-center gap-4 dark:text-white">
          <div className="flex items-center justify-center w-14 h-14 bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <Icons.Electricity />
          </div>
          {t.electricityCalculator}
        </h2>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-slate-200 dark:border-slate-700"
        >
          <Icons.Refresh className="w-3.5 h-3.5" />
          {t.reset}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">{t.subscriptionType}</label>
              <select 
                value={tariffId}
                onChange={(e) => setTariffId(e.target.value)}
                className="w-full py-5 px-6 rounded-[1.8rem] border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white font-black text-lg outline-none focus:border-amber-500 cursor-pointer shadow-sm appearance-none text-center"
              >
                {ELECTRICITY_TARIFFS.map(tariff => <option key={tariff.id} value={tariff.id}>{tariff.name[lang]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">{t.consumption} ({t.kwh})</label>
              <input 
                type="number"
                value={consumption}
                onChange={(e) => setConsumption(e.target.value)}
                placeholder="0"
                className="w-full px-8 py-6 rounded-[1.8rem] border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-white focus:border-amber-500 outline-none transition-all text-3xl font-black shadow-inner"
              />
            </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-950/50 p-8 rounded-[2.5rem] border-2 border-amber-500/20 text-amber-900 dark:text-amber-200 shadow-inner">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-600/60 dark:text-amber-400/60 mb-3">{t.totalBill}</h3>
            <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl font-black tracking-tighter">
                  {billResult ? billResult.total.toLocaleString() : '0'}
                </span>
                <span className="text-xl font-bold text-amber-600/70 dark:text-amber-400/70">{t.syp}</span>
            </div>
            
            {billResult && billResult.breakdown.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-[0.1em] border-b border-amber-500/20 pb-2 mb-2 text-amber-700 dark:text-amber-300">{t.billDetails}</h4>
                  {billResult.breakdown.map((item, index) => (
                    <div key={index} className="p-3 bg-amber-100/50 dark:bg-slate-800/50 rounded-lg text-xs grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="font-bold text-[10px] uppercase opacity-60">{t.tier}</div>
                            <div className="font-black text-amber-800 dark:text-amber-200">{item.tier}</div>
                        </div>
                        <div>
                            <div className="font-bold text-[10px] uppercase opacity-60">{t.consumption}</div>
                            <div className="font-black text-amber-800 dark:text-amber-200">{item.consumption.toLocaleString()} <span className="text-[9px]">{t.kwh}</span></div>
                        </div>
                        <div>
                            <div className="font-bold text-[10px] uppercase opacity-60">{t.cost}</div>
                            <div className="font-black text-amber-800 dark:text-amber-200">{item.cost.toLocaleString()}</div>
                        </div>
                    </div>
                  ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ElectricityCalculator;