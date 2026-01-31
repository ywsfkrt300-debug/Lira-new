import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Language, Theme, RatesResponse, AdminSettings, View } from './types';
import { translations, MAINTENANCE_MESSAGES } from './constants';
import Converter from './components/Converter';
import ChangeCalculator from './components/ChangeCalculator';
import ElectricityCalculator from './ElectricityCalculator';
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
    electricityCalculator: true,
    enableAnalytics: true,
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
  preloaderImage: null,
};

const StaticPage: React.FC<{title: string; content: string[]}> = ({ title, content }) => (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-black mb-8 dark:text-white border-b-2 border-emerald-500/30 pb-4">{title}</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
            {content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
    </div>
);

const RateCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
    <div className="flex items-center gap-3 mb-6 animate-pulse">
      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
      <div className="w-32 h-5 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
    </div>
    <div className="space-y-3 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 h-[72px]">
          <div className="w-24 h-5 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="flex gap-6">
            <div className="text-center space-y-2">
              <div className="w-8 h-2 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="w-12 h-5 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-2 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="w-12 h-5 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [activeView, setActiveView] = useState<View>('home');
  const [viewToRender, setViewToRender] = useState<View>('home');
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isBgAnimationEnabled, setIsBgAnimationEnabled] = useState(false);
  const firstLoad = useRef(true);
  const printableContainer = useMemo(() => document.getElementById('printable-container'), []);
  
  const maintenanceMessage = useMemo(() => {
    return MAINTENANCE_MESSAGES[Math.floor(Math.random() * MAINTENANCE_MESSAGES.length)];
  }, []);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  useEffect(() => {
    setIsBgAnimationEnabled(localStorage.getItem('liratna_bg_animation') === 'true');
  }, []);

  const toggleBgAnimation = () => {
    const isEnabled = localStorage.getItem('liratna_bg_animation') === 'true';
    localStorage.setItem('liratna_bg_animation', String(!isEnabled));
    window.location.reload();
  };

  // Routing and Title Effect
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as View;
      const validViews: View[] = ['home', 'converter', 'calculator', 'electricity', 'privacy', 'contact'];
      const targetView = validViews.includes(hash) ? hash : 'home';
      
      if (activeView !== targetView) {
        setActiveView(targetView);
        if (settings.enabledFeatures.enableAnalytics && !firstLoad.current) {
            trackEvent('PAGE_VIEW');
        }
      } else if (!hash && activeView !== 'home') {
        // Handle case where hash is empty, should default to home
        setActiveView('home');
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeView, settings.enabledFeatures.enableAnalytics]);

  // View transition effect
  useEffect(() => {
    if (activeView !== viewToRender) {
        setIsViewLoading(true);
        const timer = setTimeout(() => {
            setViewToRender(activeView);
            setIsViewLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [activeView, viewToRender]);


  // SEO Title, Meta Description, and Structured Data Effect
  useEffect(() => {
    const pageTitle = t.pageTitles[viewToRender] || t.title;
    document.title = `${t.title} | ${pageTitle}`;

    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', t.metaDescriptions[viewToRender] || '');
    }
    
    // Manage dynamic schema for sub-pages. The main schema is in index.html
    const dynamicScriptId = 'dynamic-json-ld-schema';
    const existingDynamicScript = document.getElementById(dynamicScriptId);
    if (existingDynamicScript) {
        existingDynamicScript.remove();
    }
    
    if (viewToRender === 'home') {
        // Home page relies on the static schema in index.html
        return;
    }

    const scriptTag = document.createElement('script');
    scriptTag.id = dynamicScriptId;
    scriptTag.type = 'application/ld+json';
    
    const baseUrl = "https://lirtna-sy.vercel.app/";
    const pageUrl = `${baseUrl}#${viewToRender}`;

    let schema: object | null = null;
    
    const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": t.home, "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": t.pageTitles[viewToRender], "item": pageUrl }
        ]
    };
    
    if (viewToRender === 'converter') {
        schema = {
            "@context": "https://schema.org",
            "@graph": [
                breadcrumbSchema,
                {
                    "@type": "HowTo",
                    "name": t.howToConverter.title,
                    "description": t.howToConverter.description,
                    "step": t.howToConverter.steps.map((step) => ({
                        "@type": "HowToStep",
                        "name": step.name,
                        "text": step.text,
                        "url": pageUrl
                    }))
                }
            ]
        };
    } else if (['calculator', 'electricity', 'privacy', 'contact'].includes(viewToRender)) {
        schema = {
            "@context": "https://schema.org",
            ...breadcrumbSchema
        };
    }

    if (schema) {
        scriptTag.textContent = JSON.stringify(schema);
        document.head.appendChild(scriptTag);
    }
    
  }, [viewToRender, t]);

  const loadRates = useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchLatestRates(lang);
    setRates(data);
    setIsRefreshing(false);
  }, [lang]);

  const loadSettings = useCallback(async (): Promise<AdminSettings> => {
    if (!supabase) return DEFAULT_ADMIN_SETTINGS;
    try {
      const { data, error } = await supabase.from('admin_settings').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const dbFeatures = data.enabled_features || {};
        const mergedFeatures = { ...DEFAULT_ADMIN_SETTINGS.enabledFeatures };
        for (const key in mergedFeatures) {
            if (typeof (dbFeatures as any)[key] === 'boolean') {
                (mergedFeatures as any)[key] = (dbFeatures as any)[key];
            }
        }

        return {
          ...DEFAULT_ADMIN_SETTINGS,
          isMaintenanceMode: data.is_maintenance_mode ?? DEFAULT_ADMIN_SETTINGS.isMaintenanceMode,
          startHour: data.start_hour ?? DEFAULT_ADMIN_SETTINGS.startHour,
          endHour: data.end_hour ?? DEFAULT_ADMIN_SETTINGS.endHour,
          adminPassword: data.admin_password_hash ?? DEFAULT_ADMIN_SETTINGS.adminPassword,
          enabledFeatures: mergedFeatures,
          bloodEffectText: data.blood_effect_text ?? DEFAULT_ADMIN_SETTINGS.bloodEffectText,
          socialLinks: { ...DEFAULT_ADMIN_SETTINGS.socialLinks, ...(data.social_links || {}) },
          mobileApp: { ...DEFAULT_ADMIN_SETTINGS.mobileApp, ...(data.mobile_app || {}) },
          siteLogo: data.site_logo ?? DEFAULT_ADMIN_SETTINGS.siteLogo,
          preloaderImage: data.preloader_image ?? DEFAULT_ADMIN_SETTINGS.preloaderImage,
        };
      }
    } catch (e) {
      console.error("Failed to load settings from Supabase:", e);
    }
    return DEFAULT_ADMIN_SETTINGS;
  }, []);

  const applyPreloaderSettings = useCallback((settingsToApply: AdminSettings) => {
    const imgEl = document.getElementById('preloader-custom-img') as HTMLImageElement;
    const letterEl = document.getElementById('preloader-default-letter');
    if (imgEl && letterEl && settingsToApply.preloaderImage) {
        imgEl.src = settingsToApply.preloaderImage;
        imgEl.classList.remove('hidden');
        letterEl.classList.add('hidden');
    }
  }, []);
  
  useEffect(() => {
    const executeLoad = async () => {
      if (firstLoad.current) {
        const loadedSettings = await loadSettings();
        setSettings(loadedSettings);
        applyPreloaderSettings(loadedSettings);

        if (loadedSettings.enabledFeatures.enableAnalytics) {
          trackEvent('PAGE_VIEW');
        }
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
  }, [loadSettings, loadRates, applyPreloaderSettings]);

  if (settings.isMaintenanceMode) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white dir-rtl font-['Tajawal']">
          <div className="text-center space-y-8 max-w-lg">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Icons.Maintenance className="w-10 h-10 text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold">عذراً، الموقع تحت الصيانة</h1>
            <p className="text-slate-400 font-medium">{maintenanceMessage}</p>
          </div>
        </div>
        <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-5 right-5 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 z-[1001] backdrop-blur-sm" aria-label="الدخول كمسؤول" title="الدخول كمسؤول">
          <Icons.Settings className="w-6 h-6" />
        </button>
        {isAdminOpen && <AdminPortal settings={settings} updateSettings={setSettings} onClose={() => setIsAdminOpen(false)} />}
      </>
    );
  }

  const safeFeatures = settings.enabledFeatures || DEFAULT_ADMIN_SETTINGS.enabledFeatures;
  const safeSocialLinks = settings.socialLinks || DEFAULT_ADMIN_SETTINGS.socialLinks;

  const services = [
    { view: 'converter', label: t.converter, icon: Icons.Converter, enabled: safeFeatures.converter },
    { view: 'calculator', label: t.calculator, icon: Icons.Calculator, enabled: safeFeatures.calculator },
    { view: 'electricity', label: t.electricityCalculator, icon: Icons.Electricity, enabled: safeFeatures.electricityCalculator },
  ].filter(s => s.enabled);


  const renderActiveView = () => {
    switch (viewToRender) {
      case 'home':
        return (
          <>
            {safeFeatures.marketRates && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h1 className="text-3xl font-black dark:text-white text-center sm:text-right">{t.homeTitle}</h1>
                  <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-4 flex-shrink-0">
                    {rates && !rates.error && ( <p className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:block"> {t.lastUpdate}: {new Date(rates.timestampUtc).toLocaleString(lang === 'ar' ? 'ar-SY' : 'en-US', { timeStyle: 'short', dateStyle: 'short' })} </p> )}
                    <button onClick={() => window.print()} className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-sm" aria-label={t.printRates} title={t.printRates}>
                        <Icons.Print className="w-5 h-5" />
                    </button>
                    <button onClick={loadRates} disabled={isRefreshing} className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-all shadow-md" aria-label={t.reset}>
                      <Icons.Refresh className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                {isRefreshing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RateCardSkeleton />
                    <RateCardSkeleton />
                  </div>
                ) : rates?.error ? (
                  <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-3xl text-center text-red-700 dark:text-red-300 font-bold border-2 border-red-200 dark:border-red-800/50">{t.rateError}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:border-emerald-500/30">
                      <div className="flex items-center gap-3 mb-6"><Icons.CentralBank className="w-6 h-6 text-emerald-600" /><h3 className="text-lg font-bold dark:text-white">{t.cbs}</h3></div>
                      <div className="space-y-3">
                        {rates && rates.cbsRates.length > 0 ? rates.cbsRates.map(r => ( <div key={r.currency} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800"> <span className="font-bold text-slate-600 dark:text-slate-400">{r.currency}</span> <div className="flex gap-6"><div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-black">{t.buy}</p><p className="text-lg font-bold dark:text-white">{r.buy.toLocaleString()}</p></div><div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-black">{t.sell}</p><p className="text-lg font-bold dark:text-white">{r.sell.toLocaleString()}</p></div></div> </div>)) : <p className="text-center text-slate-400 text-sm py-4">{'لا توجد بيانات حالياً'}</p>}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:border-blue-500/30">
                      <div className="flex items-center gap-3 mb-6"><Icons.Market className="w-6 h-6 text-blue-600" /><h3 className="text-lg font-bold dark:text-white">{t.blackMarket}</h3></div>
                      <div className="space-y-3">
                        {rates && rates.blackMarketRates.length > 0 ? rates.blackMarketRates.map(r => ( <div key={r.currency} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800"> <span className="font-bold text-slate-600 dark:text-slate-400">{r.currency}</span> <div className="flex gap-6"><div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-black">{t.buy}</p><p className="text-lg font-bold dark:text-white">{r.buy.toLocaleString()}</p></div><div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-black">{t.sell}</p><p className="text-lg font-bold dark:text-white">{r.sell.toLocaleString()}</p></div></div> </div>)) : <p className="text-center text-slate-400 text-sm py-4">{'لا توجد بيانات حالياً'}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-2xl font-bold dark:text-white">{t.homeGuideTitle}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.homeGuidePara1}</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.homeGuidePara2 }}></p>
            </div>
            <div className="bg-slate-900/95 backdrop-blur-md text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-white/10">
              <h3 className="text-xl font-bold mb-4 relative z-10">{t.aboutUs}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">{t.aboutContent}</p>
              <div className="flex gap-3 relative z-10">
                {Object.entries(safeSocialLinks).map(([platform, data]) => {
                  const s = data as { url: string; visible: boolean };
                  if (!s || !s.visible) return null;
                  const Icon = (Icons as any)[platform.charAt(0).toUpperCase() + platform.slice(1)];
                  const isLinkValid = s.url && s.url.trim() !== '' && s.url.trim() !== '#';
                  if (isLinkValid) { return ( <a key={platform} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all" aria-label={`Visit our ${platform} page`}> {Icon && <Icon className="w-5 h-5" />} </a> ); }
                  else { return ( <div key={platform} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center cursor-not-allowed opacity-40" title={`رابط ${platform} غير مُعد. يرجى إضافته من لوحة الإدارة.`} aria-label={`${platform} link not available`}> {Icon && <Icon className="w-5 h-5" />} </div> ); }
                })}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            </div>
          </>
        );
      case 'converter': return <div className="max-w-4xl mx-auto"><Converter t={t} lang={lang} enableAnalytics={safeFeatures.enableAnalytics} /></div>;
      case 'calculator': return <div className="max-w-4xl mx-auto"><ChangeCalculator t={t} enableAnalytics={safeFeatures.enableAnalytics} /></div>;
      case 'electricity': return <div className="max-w-5xl mx-auto"><ElectricityCalculator t={t} lang={lang} enableAnalytics={safeFeatures.enableAnalytics} /></div>;
      case 'privacy': return <StaticPage title={t.privacyTitle} content={t.privacyContent} />;
      case 'contact': return <StaticPage title={t.contactTitle} content={t.contactContent} />;
      default: return null;
    }
  };
  
  const LoadingIndicator = () => (
    <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );


  return (
    <>
      <div className={`relative z-10 min-h-screen transition-colors duration-300 ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'} main-app-container flex flex-col`}>
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer" onDoubleClick={() => setIsAdminOpen(true)}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">
                {settings.siteLogo ? <img src={settings.siteLogo} alt={`شعار ${t.title}`} className="w-full h-full object-contain" /> : "L"}
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
               <a href="#home" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'home' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                 <Icons.Home /> {t.home}
               </a>
               <div className="relative" onMouseEnter={() => setIsServicesMenuOpen(true)} onMouseLeave={() => setIsServicesMenuOpen(false)}>
                 <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all w-full ${['converter', 'calculator', 'electricity'].includes(activeView) ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                   <Icons.Services /> {t.services}
                 </button>
                 {isServicesMenuOpen && services.length > 0 && (
                   <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 z-50">
                     {services.map(service => (
                       <a key={service.view} href={`#${service.view}`} onClick={() => setIsServicesMenuOpen(false)} className="w-full text-right flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm">
                         <service.icon className="w-4 h-4 text-emerald-500" />
                         {service.label}
                       </a>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            <div className="flex items-center gap-2">
               <button 
                onClick={toggleBgAnimation} 
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all hidden sm:block"
                aria-label={isBgAnimationEnabled ? t.toggleAnimationOff : t.toggleAnimationOn}
                title={isBgAnimationEnabled ? t.toggleAnimationOff : t.toggleAnimationOn}
              >
                <Icons.Animation className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                aria-label={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
              >
                {theme === 'light' ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} 
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white transition-all"
                aria-label={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              >
                {lang === 'ar' ? 'EN' : 'عربي'}
              </button>
            </div>
          </div>
          <div className="md:hidden p-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-900/80">
            <a href="#home" className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'home' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>
                <Icons.Home /> {t.home}
            </a>
            <div className="relative flex-1" onClick={() => setIsServicesMenuOpen(prev => !prev)}>
                <button className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${['converter', 'calculator', 'electricity'].includes(activeView) ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <Icons.Services /> {t.services}
                </button>
                {isServicesMenuOpen && services.length > 0 && (
                   <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 z-50">
                     {services.map(service => (
                       <a key={service.view} href={`#${service.view}`} onClick={() => setIsServicesMenuOpen(false)} className="w-full text-right flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 font-bold text-sm">
                         <service.icon className="w-4 h-4 text-emerald-500" />
                         {service.label}
                       </a>
                     ))}
                   </div>
                 )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10 flex-grow w-full">
          {isViewLoading ? <LoadingIndicator /> : renderActiveView()}
        </main>
        
        {safeFeatures.showBloodEffect && (
          <div className="bg-red-700 text-white py-1.5 overflow-hidden whitespace-nowrap border-b border-red-900 text-xs font-bold uppercase tracking-wider my-10">
            <div className="flex items-center gap-12 animate-[marquee_30s_linear_infinite]">{Array.from({ length: 15 }).map((_, i) => (<span key={i} className="flex items-center gap-2"><Icons.BloodDrop className="w-3 h-3 text-red-300" /> {settings.bloodEffectText}</span>))}</div>
          </div>
        )}

        <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-200 dark:border-slate-800 text-center md:text-right flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          <p className="text-sm font-bold dark:text-white/60 text-slate-600/60">© {new Date().getFullYear()} {t.title} - جميع الحقوق محفوظة</p>
          <div className="flex gap-6 text-sm font-bold text-slate-600/60 dark:text-slate-400/60">
            <a href="#privacy" className="hover:text-emerald-600 transition-colors">{t.privacyPolicy}</a>
            <a href="#contact" className="hover:text-emerald-600 transition-colors">{t.contactUs}</a>
          </div>
        </footer>

        {isAdminOpen && <AdminPortal settings={settings} updateSettings={setSettings} onClose={() => setIsAdminOpen(false)} />}
      </div>
      {printableContainer && ReactDOM.createPortal(
        <RatePrintView rates={rates} t={t} lang={lang} />,
        printableContainer
      )}
    </>
  );
};

export default App;