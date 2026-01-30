import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Language, Theme, RatesResponse, AdminSettings } from './types';
import { translations, MAINTENANCE_MESSAGES } from './constants';
import Converter from './components/Converter';
import ChangeCalculator from './components/ChangeCalculator';
import AdminPortal from './components/AdminPortal';
import RatePrintView from './components/RatePrintView';
import { fetchLatestRates } from './services/rateService';
import { Icons } from './components/Icons';
import { supabase, trackEvent } from './services/supabaseClient';

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  isMaintenanceMode: false,
  startHour: 0,
  endHour: 24,
  adminPassword: '555666999',
  enabledFeatures: {
    converter: true,
    calculator: true,
    marketRates: true,
    showBloodEffect: false,
  },
  bloodEffectText: 'دمتي قوية يا حلب',
  socialLinks: {
    whatsapp: { url: '#', visible: true },
    telegram: { url: '#', visible: true },
    facebook: { url: '#', visible: true },
    instagram: { url: '#', visible: true },
  },
  mobileApp: {
    url: '#',
    previewImage: null,
    visible: true,
  },
  siteLogo: null,
};

const getCurrencyName = (currencyCode: string, lang: 'ar' | 'en'): string => {
    const map = {
        ar: { USD: 'الدولار الأمريكي', EUR: 'اليورو الأوروبي', TRY: 'الليرة التركية' },
        en: { USD: 'US Dollar', EUR: 'Euro', TRY: 'Turkish Lira' }
    };
    return (map[lang] as any)[currencyCode] || currencyCode;
};


const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const maintenanceMessage = useMemo(() => {
    return MAINTENANCE_MESSAGES[Math.floor(Math.random() * MAINTENANCE_MESSAGES.length)];
  }, []);

  const t = translations[lang];

  useEffect(() => {
    trackEvent('PAGE_VIEW');
    loadSettings();
    loadRates();
  }, [lang]);

  // Theme synchronization
  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  const loadSettings = async () => {
    if (!supabase) {
      console.warn("Supabase not configured. Skipping settings load and using defaults.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          isMaintenanceMode: data.is_maintenance_mode ?? false,
          startHour: data.start_hour ?? 0,
          endHour: data.end_hour ?? 24,
          adminPassword: data.admin_password_hash ?? '555666999',
          enabledFeatures: data.enabled_features ?? DEFAULT_ADMIN_SETTINGS.enabledFeatures,
          bloodEffectText: data.blood_effect_text ?? '',
          socialLinks: data.social_links ?? DEFAULT_ADMIN_SETTINGS.socialLinks,
          mobileApp: data.mobile_app ?? DEFAULT_ADMIN_SETTINGS.mobileApp,
          siteLogo: data.site_logo ?? null
        });
      }
    } catch (e: any) {
      // Self-healing: If no settings row is found, create one with defaults.
      if (e.code === 'PGRST116') {
        console.log("No settings found in database. Initializing with defaults.");
        try {
          const { error: insertError } = await supabase
            .from('admin_settings')
            .insert({
              id: 1,
              is_maintenance_mode: DEFAULT_ADMIN_SETTINGS.isMaintenanceMode,
              start_hour: DEFAULT_ADMIN_SETTINGS.startHour,
              end_hour: DEFAULT_ADMIN_SETTINGS.endHour,
              admin_password_hash: DEFAULT_ADMIN_SETTINGS.adminPassword,
              enabled_features: DEFAULT_ADMIN_SETTINGS.enabledFeatures,
              blood_effect_text: DEFAULT_ADMIN_SETTINGS.bloodEffectText,
              social_links: DEFAULT_ADMIN_SETTINGS.socialLinks,
              mobile_app: DEFAULT_ADMIN_SETTINGS.mobileApp,
              site_logo: DEFAULT_ADMIN_SETTINGS.siteLogo,
            });
          
          if (insertError) {
            console.error("Failed to insert default settings:", insertError);
          } else {
            console.log("Successfully inserted default settings into the database.");
          }
        } catch (insertCatchError) {
          console.error("An unexpected error occurred during settings insertion:", insertCatchError);
        }
      } else {
        console.error("Failed to load settings from Supabase:", e);
      }
    }
  };

  const loadRates = async () => {
    setIsRefreshing(true);
    const data = await fetchLatestRates(lang);
    setRates(data);
    setIsRefreshing(false);
  };

  if (settings.isMaintenanceMode && !isAdminOpen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white dir-rtl font-['Tajawal'] cursor-pointer"
        onDoubleClick={() => setIsAdminOpen(true)}
        title="انقر نقراً مزدوجاً للدخول كمسؤول"
      >
        <div className="text-center space-y-8 max-w-lg pointer-events-none">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Icons.Maintenance className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold">عذراً، الموقع تحت الصيانة</h1>
          <p className="text-slate-400 font-medium">{maintenanceMessage}</p>
        </div>
      </div>
    );
  }

  const safeFeatures = settings.enabledFeatures || DEFAULT_ADMIN_SETTINGS.enabledFeatures;
  const safeSocialLinks = settings.socialLinks || DEFAULT_ADMIN_SETTINGS.socialLinks;

  const hasRatesData = rates && !rates.error && 
                  ((rates.cbsRates && rates.cbsRates.length > 0) || 
                   (rates.blackMarketRates && rates.blackMarketRates.length > 0));

  return (
    <>
      <div className={`relative z-10 min-h-screen transition-colors duration-300 ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'} main-app-container print:hidden flex flex-col`}>
        <header className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-b dark:border-slate-700/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer" onDoubleClick={() => setIsAdminOpen(true)}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">
                {settings.siteLogo ? (
                  <img src={settings.siteLogo} alt="Logo" className="w-full h-full object-contain" />
                ) : "L"}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                {theme === 'light' ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
              </button>
              <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-sm text-slate-900 dark:text-white transition-all">
                {lang === 'ar' ? 'EN' : 'عربي'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10 flex-grow">
          {/* Market Rates Section */}
          {safeFeatures.marketRates && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-black dark:text-white">{t.marketRates}</h2>
                <div className="flex items-center gap-4">
                  {rates && !rates.error && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      {t.lastUpdate}: {new Date(rates.timestampUtc).toLocaleString(lang === 'ar' ? 'ar-SY' : 'en-US', { timeStyle: 'short', dateStyle: 'short' })}
                    </p>
                  )}
                  <button 
                    onClick={() => window.print()} 
                    disabled={isRefreshing || !hasRatesData}
                    title={t.printRates}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icons.Print className="w-5 h-5" />
                  </button>
                  <button onClick={loadRates} disabled={isRefreshing} className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-all shadow-md">
                    <Icons.Refresh className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              
              {rates?.error ? (
                <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-3xl text-center text-red-700 dark:text-red-300 font-bold border-2 border-red-200 dark:border-red-800/50">
                  {t.rateError}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border dark:border-slate-700/50 transition-all hover:border-emerald-500/30">
                    <div className="flex items-center gap-3 mb-6">
                      <Icons.CentralBank className="w-6 h-6 text-emerald-600" />
                      <h3 className="text-lg font-bold dark:text-white">{t.cbs}</h3>
                    </div>
                    <div className="space-y-3">
                      {rates && (rates.cbsRates || []).length > 0 ? (
                        rates.cbsRates.map(r => (
                          <div key={r.currency} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                            <span className="font-bold text-slate-600 dark:text-slate-400">{getCurrencyName(r.currency, lang)}</span>
                            <div className="flex gap-6">
                              <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-black">{t.buy}</p>
                                <p className="text-lg font-bold dark:text-white">{r.buy.toLocaleString()}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-black">{t.sell}</p>
                                <p className="text-lg font-bold dark:text-white">{r.sell.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-slate-400 text-sm py-4">{isRefreshing ? t.loading : 'لا توجد بيانات حالياً'}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border dark:border-slate-700/50 transition-all hover:border-blue-500/30">
                    <div className="flex items-center gap-3 mb-6">
                      <Icons.Market className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-bold dark:text-white">{t.blackMarket}</h3>
                    </div>
                    <div className="space-y-3">
                      {rates && (rates.blackMarketRates || []).length > 0 ? (
                        rates.blackMarketRates.map(r => (
                          <div key={r.currency} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                            <span className="font-bold text-slate-600 dark:text-slate-400">{getCurrencyName(r.currency, lang)}</span>
                            <div className="flex gap-6">
                              <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-black">{t.buy}</p>
                                <p className="text-lg font-bold dark:text-white">{r.buy.toLocaleString()}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-black">{t.sell}</p>
                                <p className="text-lg font-bold dark:text-white">{r.sell.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-slate-400 text-sm py-4">{isRefreshing ? t.loading : 'لا توجد بيانات حالياً'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              {safeFeatures.converter && <Converter t={t} lang={lang} />}
              {safeFeatures.calculator && <ChangeCalculator t={t} />}
            </div>

            <div className="lg:col-span-4 space-y-10">
              <div className="bg-slate-900/90 backdrop-blur-md text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-white/10">
                <h3 className="text-xl font-bold mb-4 relative z-10">{t.aboutUs}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">{t.aboutContent}</p>
                <div className="flex gap-3 relative z-10">
                  {Object.entries(safeSocialLinks).map(([platform, data]) => {
                    const s = data as { url: string; visible: boolean };
                    if (!s || !s.visible) return null;
                    const IconKey = platform.charAt(0).toUpperCase() + platform.slice(1);
                    const Icon = (Icons as any)[IconKey];
                    return (
                      <a key={platform} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all">
                        {Icon ? <Icon className="w-5 h-5" /> : null}
                      </a>
                    );
                  })}
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              </div>
            </div>
          </div>
        </main>
        
        {safeFeatures.showBloodEffect && (
          <div className="bg-red-700 text-white py-1.5 overflow-hidden whitespace-nowrap border-b border-red-900 text-xs font-bold uppercase tracking-wider my-10">
            <div className="flex items-center gap-12 animate-[marquee_30s_linear_infinite]">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="flex items-center gap-2">
                  <Icons.BloodDrop className="w-3 h-3 text-red-300" /> {settings.bloodEffectText}
                </span>
              ))}
            </div>
          </div>
        )}

        <footer className="max-w-6xl mx-auto px-4 py-12 border-t dark:border-slate-800/50 text-center md:text-right flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          <p className="text-sm font-bold dark:text-white/60 text-slate-600/60">© {new Date().getFullYear()} {t.title} - جميع الحقوق محفوظة</p>
          <div className="flex gap-6 text-sm font-bold text-slate-600/60 dark:text-slate-400/60">
            <a href="#" className="hover:text-emerald-600 transition-colors">{t.privacyPolicy}</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">{t.contactUs}</a>
          </div>
        </footer>

        {isAdminOpen && <AdminPortal settings={settings} updateSettings={setSettings} onClose={() => setIsAdminOpen(false)} />}
        <RatePrintView rates={rates} t={t} lang={lang} />
      </div>
    </>
  );
};

export default App;