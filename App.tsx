import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Language, Theme, RatesResponse, AdminSettings } from './types';
import { translations, MAINTENANCE_MESSAGES } from './constants';
import Converter from './components/Converter';
import ChangeCalculator from './components/ChangeCalculator';
import ElectricityCalculator from './components/ElectricityCalculator';
import AdminPortal from './components/AdminPortal';
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
    electricityCalculator: true,
  },
  bloodEffectText: 'دمتي قوية يا حلب',
  socialLinks: {
    whatsapp: { url: 'https://whatsapp.com', visible: true },
    telegram: { url: 'https://telegram.org', visible: true },
    facebook: { url: 'https://facebook.com', visible: true },
    instagram: { url: 'https://instagram.com', visible: true },
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
  const [activeView, setActiveView] = useState<'home' | 'services'>('home');
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const firstLoad = useRef(true);
  
  const maintenanceMessage = useMemo(() => {
    return MAINTENANCE_MESSAGES[Math.floor(Math.random() * MAINTENANCE_MESSAGES.length)];
  }, []);

  const t = translations[lang];

  const loadRates = useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchLatestRates(lang);
    setRates(data);
    setIsRefreshing(false);
  }, [lang]);

  const loadSettings = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('admin_settings').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        // Map snake_case from DB to camelCase for app state
        setSettings(prev => ({
          ...prev,
          isMaintenanceMode: data.is_maintenance_mode ?? prev.isMaintenanceMode,
          startHour: data.start_hour ?? prev.startHour,
          endHour: data.end_hour ?? prev.endHour,
          adminPassword: data.admin_password_hash ?? prev.adminPassword,
          enabledFeatures: data.enabled_features ?? prev.enabledFeatures,
          bloodEffectText: data.blood_effect_text ?? prev.bloodEffectText,
          socialLinks: data.social_links ?? prev.socialLinks,
          mobileApp: data.mobile_app ?? prev.mobileApp,
          siteLogo: data.site_logo ?? prev.siteLogo,
        }));
      }
    } catch (e) {
      console.error("Failed to load settings from Supabase:", e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  useEffect(() => {
    const executeLoad = async () => {
        if (firstLoad.current) {
            trackEvent('PAGE_VIEW');
            await loadSettings();
        }

        await loadRates();

        if (firstLoad.current) {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('fade-out');
                setTimeout(() => preloader.remove(), 500);
            }
            firstLoad.current = false;
        }
    };
    executeLoad();
  }, [loadSettings, loadRates]);


  if (settings.isMaintenanceMode) {
    return (
      <>
        <div 
          className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white dir-rtl font-['Tajawal']"
        >
          <div className="text-center space-y-8 max-w-lg">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Icons.Maintenance className="w-10 h-10 text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold">عذراً، الموقع تحت الصيانة</h1>
            <p className="text-slate-400 font-medium">{maintenanceMessage}</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdminOpen(true)}
          className="fixed bottom-5 right-5 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 z-[1001] backdrop-blur-sm"
          aria-label="الدخول كمسؤول"
          title="الدخول كمسؤول"
        >
          <Icons.Security className="w-6 h-6" />
        </button>
        {isAdminOpen && <AdminPortal settings={settings} updateSettings={setSettings} onClose={() => setIsAdminOpen(false)} />}
      </>
    );
  }

  const safeFeatures = settings.enabledFeatures || DEFAULT_ADMIN_SETTINGS.enabledFeatures;
  const safeSocialLinks = settings.socialLinks || DEFAULT_ADMIN_SETTINGS.socialLinks;

  const NavButton: React.FC<{view: 'home' | 'services', label: string, icon: React.FC}> = ({view, label, icon: Icon}) => (
    <button 
      onClick={() => setActiveView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === view ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}
    >
      <Icon />
      {label}
    </button>
  );

  return (
    <>
      <div className={`relative z-10 min-h-screen transition-colors duration-300 ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'} main-app-container flex flex-col`}>
        <header className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-b dark:border-slate-700/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer" onDoubleClick={() => setIsAdminOpen(true)}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">
                {settings.siteLogo ? <img src={settings.siteLogo} alt="Logo" className="w-full h-full object-contain" /> : "L"}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
              <NavButton view="home" label={t.home} icon={Icons.Home} />
              <NavButton view="services" label={t.services} icon={Icons.Services} />
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
          <div className="md:hidden p-2 border-t dark:border-slate-700/50 flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-800/80">
            <NavButton view="home" label={t.home} icon={Icons.Home} />
            <NavButton view="services" label={t.services} icon={Icons.Services} />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10 flex-grow w-full">
          {activeView === 'home' && (
            <>
              {safeFeatures.marketRates && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-black dark:text-white">{t.marketRates}</h2>
                    <div className="flex items-center gap-2 sm:gap-4">
                      {rates && !rates.error && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:block">
                          {t.lastUpdate}: {new Date(rates.timestampUtc).toLocaleString(lang === 'ar' ? 'ar-SY' : 'en-US', { timeStyle: 'short', dateStyle: 'short' })}
                        </p>
                      )}
                      <button onClick={loadRates} disabled={isRefreshing} className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-all shadow-md">
                        <Icons.Refresh className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                  {rates?.error ? (
                    <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-3xl text-center text-red-700 dark:text-red-300 font-bold border-2 border-red-200 dark:border-red-800/50">{t.rateError}</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* CBS Rates */}
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border dark:border-slate-700/50 transition-all hover:border-emerald-500/30">
                        <div className="flex items-center gap-3 mb-6"><Icons.CentralBank className="w-6 h-6 text-emerald-600" /><h3 className="text-lg font-bold dark:text-white">{t.cbs}</h3></div>
                        <div className="space-y-3">
                          {rates && rates.cbsRates.length > 0 ? rates.cbsRates.map(r => (
                            <div key={r.currency} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                              <span className="font-bold text-slate-600 dark:text-slate-400">{getCurrencyName(r.currency, lang)}</span>
                              <div className="flex gap-6"><div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-black">{t.buy}</p><p className="text-lg font-bold dark:text-white">{r.buy.toLocaleString()}</p></div><div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-black">{t.sell}</p><p className="text-lg font-bold dark:text-white">{r.sell.toLocaleString()}</p></div></div>
                            </div>)) : <p className="text-center text-slate-400 text-sm py-4">{isRefreshing ? t.loading : 'لا توجد بيانات حالياً'}</p>}
                        </div>
                      </div>
                      {/* Market Rates */}
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border dark:border-slate-700/50 transition-all hover:border-blue-500/30">
                        <div className="flex items-center gap-3 mb-6"><Icons.Market className="w-6 h-6 text-blue-600" /><h3 className="text-lg font-bold dark:text-white">{t.blackMarket}</h3></div>
                        <div className="space-y-3">
                          {rates && rates.blackMarketRates.length > 0 ? rates.blackMarketRates.map(r => (
                            <div key={r.currency} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                              <span className="font-bold text-slate-600 dark:text-slate-400">{getCurrencyName(r.currency, lang)}</span>
                              <div className="flex gap-6"><div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-black">{t.buy}</p><p className="text-lg font-bold dark:text-white">{r.buy.toLocaleString()}</p></div><div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-black">{t.sell}</p><p className="text-lg font-bold dark:text-white">{r.sell.toLocaleString()}</p></div></div>
                            </div>)) : <p className="text-center text-slate-400 text-sm py-4">{isRefreshing ? t.loading : 'لا توجد بيانات حالياً'}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
               <div className="bg-slate-900/90 backdrop-blur-md text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-white/10">
                <h3 className="text-xl font-bold mb-4 relative z-10">{t.aboutUs}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">{t.aboutContent}</p>
                <div className="flex gap-3 relative z-10">
                  {Object.entries(safeSocialLinks).map(([platform, data]) => {
                    const s = data as { url: string; visible: boolean };
                    if (!s || !s.visible) return null;

                    const Icon = (Icons as any)[platform.charAt(0).toUpperCase() + platform.slice(1)];
                    const isLinkValid = s.url && s.url.trim() !== '' && s.url.trim() !== '#';

                    if (isLinkValid) {
                      return (
                        <a 
                          key={platform} 
                          href={s.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all"
                          aria-label={`Visit our ${platform} page`}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                        </a>
                      );
                    } else {
                      return (
                        <div 
                          key={platform} 
                          className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center cursor-not-allowed opacity-40"
                          title={`رابط ${platform} غير مُعد. يرجى إضافته من لوحة الإدارة.`}
                          aria-label={`${platform} link not available`}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                        </div>
                      );
                    }
                  })}
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              </div>
            </>
          )}
          {activeView === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {safeFeatures.converter && <Converter t={t} lang={lang} />}
              {safeFeatures.calculator && <ChangeCalculator t={t} />}
              {safeFeatures.electricityCalculator && (
                <div className="lg:col-span-2">
                  <ElectricityCalculator t={t} lang={lang} />
                </div>
              )}
            </div>
          )}
        </main>
        
        {safeFeatures.showBloodEffect && (
          <div className="bg-red-700 text-white py-1.5 overflow-hidden whitespace-nowrap border-b border-red-900 text-xs font-bold uppercase tracking-wider my-10">
            <div className="flex items-center gap-12 animate-[marquee_30s_linear_infinite]">{Array.from({ length: 15 }).map((_, i) => (<span key={i} className="flex items-center gap-2"><Icons.BloodDrop className="w-3 h-3 text-red-300" /> {settings.bloodEffectText}</span>))}</div>
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
      </div>
    </>
  );
};

export default App;