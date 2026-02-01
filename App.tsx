
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Language, Theme, RatesResponse, AdminSettings, View } from './types';
import { translations, MAINTENANCE_MESSAGES } from './constants';
import Converter from './components/Converter';
import ChangeCalculator from './components/ChangeCalculator';
import ElectricityCalculator from './components/ElectricityCalculator';
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
    twitter: { url: 'https://x.com', visible: true },
  },
  mobileApp: {
    url: '#',
    previewImage: null,
    visible: true,
  },
  siteLogo: null,
  logoSize: 40, // Default size 40px
  preloaderImage: null,
};

const StaticPage: React.FC<{title: string; content: string[]}> = ({ title, content }) => (
    <article className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-12 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50">
        <h1 className="text-2xl md:text-3xl font-black mb-8 dark:text-white border-b-2 border-emerald-500/30 pb-4">{title}</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed font-medium">
            {content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
    </article>
);

const RateCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
    <div className="flex items-center gap-3 mb-6 animate-pulse">
      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
      <div className="w-32 h-5 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
    </div>
    <div className="space-y-3 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 h-[72px]">
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
  const safeSocialLinks = settings.socialLinks || DEFAULT_ADMIN_SETTINGS.socialLinks;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const favicon = document.getElementById('dynamic-favicon') as HTMLLinkElement | null;
    const appleTouchIcon = document.getElementById('dynamic-apple-touch-icon') as HTMLLinkElement | null;
    if (settings.siteLogo) {
        if (favicon) favicon.href = settings.siteLogo;
        if (appleTouchIcon) appleTouchIcon.href = settings.siteLogo;
    }
  }, [settings.siteLogo]);
  
  useEffect(() => {
    setIsBgAnimationEnabled(localStorage.getItem('liratna_bg_animation') === 'true');
  }, []);

  const toggleBgAnimation = () => {
    const isEnabled = localStorage.getItem('liratna_bg_animation') === 'true';
    localStorage.setItem('liratna_bg_animation', String(!isEnabled));
    window.location.reload();
  };

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
        setActiveView('home');
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeView, settings.enabledFeatures.enableAnalytics]);

  useEffect(() => {
    if (activeView !== viewToRender) {
        setIsViewLoading(true);
        const timer = setTimeout(() => {
            setViewToRender(activeView);
            setIsViewLoading(false);
        }, 200); // Faster transition
        return () => clearTimeout(timer);
    }
  }, [activeView, viewToRender]);

  // --- LEGENDARY SEO: JSON-LD Structured Data Injection ---
  useEffect(() => {
    const pageTitle = t.pageTitles[viewToRender] || t.title;
    document.title = `${t.title} | ${pageTitle}`;

    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', t.metaDescriptions[viewToRender] || '');
    }

    const dynamicScriptId = 'dynamic-json-ld-schema';
    let existingDynamicScript = document.getElementById(dynamicScriptId);
    if (existingDynamicScript) existingDynamicScript.remove();

    const scriptTag = document.createElement('script');
    scriptTag.id = dynamicScriptId;
    scriptTag.type = 'application/ld+json';

    const baseUrl = "https://lirtna-sy.vercel.app/";
    const pageUrl = `${baseUrl}#${viewToRender}`;

    let schemaGraph: object[] = [];
    
    // 1. Organization Schema
    const socialUrls = Object.values(safeSocialLinks)
        .filter((link: any) => link.visible && link.url && link.url.trim() !== '#' && link.url.startsWith('http'))
        .map((link: any) => link.url);

    schemaGraph.push({
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      "name": t.title,
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": settings.siteLogo || `${baseUrl}og-image.png`
      },
      "sameAs": socialUrls,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "areaServed": "SY",
        "availableLanguage": ["Arabic", "English"]
      }
    });

    // 2. WebSite Schema
    if (viewToRender === 'home') {
        schemaGraph.push({
            "@type": "WebSite",
            "@id": `${baseUrl}#website`,
            "url": baseUrl,
            "name": "ليرتنا - Liratna",
            "description": t.metaDescriptions.home,
            "publisher": { "@id": `${baseUrl}#organization` },
            "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}?q={search_term_string}`,
            "query-input": "required name=search_term_string"
            }
        });
        
        // FAQ Schema for Home
        schemaGraph.push({
            "@type": "FAQPage",
            "mainEntity": t.faq.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": { "@type": "Answer", "text": item.answer }
            }))
        });
    }

    // 3. WebPage Schema (Generic for all pages)
    schemaGraph.push({
      "@type": "WebPage",
      "@id": pageUrl,
      "url": pageUrl,
      "name": pageTitle,
      "description": t.metaDescriptions[viewToRender],
      "isPartOf": { "@id": `${baseUrl}#website` },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": t.home, "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": pageTitle, "item": pageUrl }
        ]
      }
    });

    // 4. SoftwareApplication Schema (Specific Tools)
    if (viewToRender === 'converter') {
      schemaGraph.push({
        "@type": "SoftwareApplication",
        "name": t.converter,
        "operatingSystem": "Any",
        "applicationCategory": "FinanceApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "url": pageUrl
      });
      // HowTo Schema
      schemaGraph.push({
        "@type": "HowTo",
        "name": t.howToConverter.title,
        "description": t.howToConverter.description,
        "step": t.howToConverter.steps.map((step, i) => ({ 
            "@type": "HowToStep", 
            "position": i + 1,
            "name": step.name, 
            "text": step.text, 
            "url": pageUrl 
        }))
      });
    }

    if (viewToRender === 'electricity') {
      schemaGraph.push({
        "@type": "SoftwareApplication",
        "name": t.electricityCalculator,
        "operatingSystem": "Any",
        "applicationCategory": "UtilitiesApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "url": pageUrl
      });
       schemaGraph.push({
        "@type": "HowTo",
        "name": t.howToElectricity.title,
        "description": t.howToElectricity.description,
        "step": t.howToElectricity.steps.map((step, i) => ({ 
            "@type": "HowToStep", 
            "position": i + 1,
            "name": step.name, 
            "text": step.text, 
            "url": pageUrl 
        }))
      });
    }
    
    scriptTag.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }, null, 2);
    document.head.appendChild(scriptTag);
  }, [viewToRender, t, safeSocialLinks, settings.siteLogo]);

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
          logoSize: data.logo_size ?? DEFAULT_ADMIN_SETTINGS.logoSize,
          preloaderImage: data.preloader_image ?? DEFAULT_ADMIN_SETTINGS.preloaderImage,
        };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
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
          setTimeout(() => preloader.remove(), 400); // Faster fade
        }
        firstLoad.current = false;
      }
    };
    executeLoad();
  }, [loadSettings, loadRates, applyPreloaderSettings]);

  if (settings.isMaintenanceMode) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white font-['Cairo'] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 z-0"></div>
          <div className="text-center space-y-8 max-w-lg relative z-10 glass p-10 rounded-3xl border border-white/10">
            <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse">
              <Icons.Maintenance className="w-12 h-12 text-amber-500" />
            </div>
            <h1 className="text-4xl font-black">عذراً، الموقع تحت الصيانة</h1>
            <p className="text-slate-300 font-medium text-lg">{maintenanceMessage}</p>
          </div>
        </div>
        <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-5 right-5 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:bg-white/20 hover:text-white transition-all duration-300 z-[1001] backdrop-blur-sm" aria-label="الدخول كمسؤول">
          <Icons.Settings className="w-6 h-6" />
        </button>
        {isAdminOpen && <AdminPortal settings={settings} updateSettings={setSettings} onClose={() => setIsAdminOpen(false)} />}
      </>
    );
  }

  const safeFeatures = settings.enabledFeatures || DEFAULT_ADMIN_SETTINGS.enabledFeatures;
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
                  <h1 className="text-3xl md:text-5xl font-black dark:text-white text-center md:text-right bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 leading-tight py-2">{t.homeTitle}</h1>
                  <div className="flex items-center justify-center md:justify-end gap-3 flex-shrink-0">
                    {rates && !rates.error && ( <p className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden md:block bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700"> {t.lastUpdate}: {new Date(rates.timestampUtc).toLocaleString(lang === 'ar' ? 'ar-SY' : 'en-US', { timeStyle: 'short', dateStyle: 'short' })} </p> )}
                    <button onClick={() => window.print()} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-sm flex items-center justify-center" aria-label={t.printRates}>
                        <Icons.Print className="w-6 h-6" />
                    </button>
                    <button onClick={loadRates} disabled={isRefreshing} className="w-12 h-12 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center" aria-label={t.reset}>
                      <Icons.Refresh className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                {isRefreshing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RateCardSkeleton />
                    <RateCardSkeleton />
                  </div>
                ) : rates?.error ? (
                  <div className="p-8 bg-red-50 dark:bg-red-950/20 rounded-3xl text-center text-red-700 dark:text-red-300 font-bold border border-red-200 dark:border-red-900/50 shadow-sm">{t.rateError}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Central Bank Card */}
                    <div className="group bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/30">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                             <Icons.CentralBank className="w-8 h-8" />
                          </div>
                          <div>
                             <h3 className="text-xl font-black dark:text-white">{t.cbs}</h3>
                             <p className="text-xs text-slate-400 font-bold">نشرة الحوالات والصرافة</p>
                          </div>
                      </div>
                      <div className="space-y-3">
                        {rates && rates.cbsRates.length > 0 ? rates.cbsRates.map(r => ( 
                            <div key={r.currency} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"> 
                                <span className="font-black text-lg text-slate-700 dark:text-slate-300 flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                                    {r.currency}
                                </span> 
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">{t.buy}</p>
                                        <p className="text-xl md:text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">{r.buy.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">{t.sell}</p>
                                        <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">{r.sell.toLocaleString()}</p>
                                    </div>
                                </div> 
                            </div>
                        )) : <p className="text-center text-slate-400 text-sm py-4">{'لا توجد بيانات حالياً'}</p>}
                      </div>
                    </div>

                    {/* Black Market Card */}
                    <div className="group bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                             <Icons.Market className="w-8 h-8" />
                          </div>
                          <div>
                             <h3 className="text-xl font-black dark:text-white">{t.blackMarket}</h3>
                             <p className="text-xs text-slate-400 font-bold">الأسعار الرائجة في السوق</p>
                          </div>
                      </div>
                      <div className="space-y-3">
                        {rates && rates.blackMarketRates.length > 0 ? rates.blackMarketRates.map(r => ( 
                            <div key={r.currency} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"> 
                                <span className="font-black text-lg text-slate-700 dark:text-slate-300 flex items-center gap-3">
                                     <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                                    {r.currency}
                                </span> 
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">{t.buy}</p>
                                        <p className="text-xl md:text-2xl font-black text-blue-700 dark:text-blue-400 tracking-tight">{r.buy.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">{t.sell}</p>
                                        <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">{r.sell.toLocaleString()}</p>
                                    </div>
                                </div> 
                            </div>
                        )) : <p className="text-center text-slate-400 text-sm py-4">{'لا توجد بيانات حالياً'}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {services.map(service => (
                <a 
                  key={service.view} 
                  href={`#${service.view}`}
                  className="group relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                       <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-lg text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{service.label}</h3>
                  </div>
                </a>
              ))}
            </div>

            <article className="mt-10 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <header>
                    <h2 className="text-2xl md:text-3xl font-black dark:text-white">{t.homeGuideTitle}</h2>
                </header>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{t.homeGuidePara1}</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: t.homeGuidePara2 }}></p>
                </div>
            </article>

            <section className="bg-slate-900 dark:bg-slate-950 text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden border border-white/10 mt-10">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start">
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                        <Icons.About className="w-6 h-6 text-emerald-400" />
                        {t.aboutUs}
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed mb-6 font-medium">{t.aboutContent}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap md:justify-end">
                    {Object.entries(safeSocialLinks).map(([platform, data]) => {
                    const s = data as { url: string; visible: boolean };
                    if (!s || !s.visible) return null;
                    const Icon = (Icons as any)[platform.charAt(0).toUpperCase() + platform.slice(1)];
                    const isLinkValid = s.url && s.url.trim() !== '' && s.url.trim() !== '#' && s.url.startsWith('http');
                    if (isLinkValid) { return ( <a key={platform} href={s.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 transition-all shadow-lg" aria-label={`Visit our ${platform} page`}> {Icon && <Icon className="w-5 h-5" />} </a> ); }
                    return null;
                    })}
                  </div>
              </div>
            </section>
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
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
    </div>
  );


  return (
    <>
      {/* Global Background Gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-[#050b1d] pointer-events-none"></div>
      
      <div className="relative z-10 min-h-screen transition-colors duration-300 main-app-container flex flex-col font-sans">
        <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm supports-[backdrop-filter]:bg-white/70">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onDoubleClick={() => setIsAdminOpen(true)}>
              {/* Dynamic Logo Size applied here */}
              <div 
                  className={`flex items-center justify-center transition-transform group-hover:rotate-6 ${!settings.siteLogo ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl text-white font-black text-xl shadow-lg shadow-emerald-500/20' : ''}`}
                  style={{ width: `${settings.logoSize}px`, height: `${settings.logoSize}px` }}
              >
                {settings.siteLogo ? <img src={settings.siteLogo} alt={`شعار ${t.title}`} className="w-full h-full object-contain drop-shadow-sm" /> : "L"}
              </div>
              <div className="flex flex-col">
                <div className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{t.title}</div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hidden md:block">Syria Exchange Rates</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav aria-label={t.mainNavigation} className="hidden md:flex items-center gap-1 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
               <a href="#home" className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeView === 'home' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                 <Icons.Home /> {t.home}
               </a>
               <div className="relative" onMouseEnter={() => setIsServicesMenuOpen(true)} onMouseLeave={() => setIsServicesMenuOpen(false)}>
                 <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 w-full ${['converter', 'calculator', 'electricity'].includes(activeView) ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                   <Icons.Services /> {t.services}
                   <Icons.ArrowSwap className={`w-3 h-3 transition-transform ${isServicesMenuOpen ? '-rotate-90' : 'rotate-90'}`} />
                 </button>
                 {isServicesMenuOpen && services.length > 0 && (
                   <div className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 p-2 z-50 transform origin-top animate-in fade-in zoom-in-95 duration-200">
                     {services.map(service => (
                       <a key={service.view} href={`#${service.view}`} onClick={() => setIsServicesMenuOpen(false)} className="w-full text-right flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 font-bold text-sm text-slate-700 dark:text-slate-200 transition-colors">
                         <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                            <service.icon className="w-4 h-4" />
                         </div>
                         {service.label}
                       </a>
                     ))}
                   </div>
                 )}
               </div>
            </nav>

            <div className="flex items-center gap-2">
               <button 
                onClick={toggleBgAnimation} 
                className={`p-2.5 rounded-xl transition-all hidden sm:block ${isBgAnimationEnabled ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                aria-label={isBgAnimationEnabled ? t.toggleAnimationOff : t.toggleAnimationOn}
                title={isBgAnimationEnabled ? t.toggleAnimationOff : t.toggleAnimationOn}
              >
                <Icons.Animation className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
                aria-label={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
              >
                {theme === 'light' ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} 
                className="h-10 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10"
                aria-label={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              >
                {lang === 'ar' ? 'EN' : 'عربي'}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav aria-label={t.mainNavigation} className="md:hidden p-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center gap-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <a href="#home" className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${activeView === 'home' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <Icons.Home className="w-4 h-4" /> {t.home}
            </a>
            <div className="relative flex-1" onClick={() => setIsServicesMenuOpen(prev => !prev)}>
                <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${['converter', 'calculator', 'electricity'].includes(activeView) ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    <Icons.Services className="w-4 h-4" /> {t.services}
                </button>
                {isServicesMenuOpen && services.length > 0 && (
                   <div className="absolute bottom-full left-0 mb-3 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in slide-in-from-bottom-5">
                     {services.map(service => (
                       <a key={service.view} href={`#${service.view}`} onClick={(e) => { e.stopPropagation(); setIsServicesMenuOpen(false); }} className="w-full text-right flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-sm dark:text-white border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                         <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg"><service.icon className="w-4 h-4" /></div>
                         {service.label}
                       </a>
                     ))}
                   </div>
                 )}
            </div>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10 flex-grow w-full relative z-10">
          {isViewLoading ? <LoadingIndicator /> : renderActiveView()}
        </main>
        
        {safeFeatures.showBloodEffect && (
          <div className="bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white py-2 overflow-hidden whitespace-nowrap border-y border-red-900 shadow-inner text-xs font-bold uppercase tracking-wider my-8 relative z-10">
            <div className="flex items-center gap-12 animate-[marquee_30s_linear_infinite]">{Array.from({ length: 15 }).map((_, i) => (<span key={i} className="flex items-center gap-2"><Icons.BloodDrop className="w-3 h-3 text-red-200 drop-shadow-sm" /> {settings.bloodEffectText}</span>))}</div>
          </div>
        )}

        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative z-10">
          <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded-md flex items-center justify-center text-white dark:text-slate-900 text-xs font-black">L</div>
                    <span className="font-black dark:text-white">{t.title}</span>
                </div>
                <p className="text-xs font-bold dark:text-white/40 text-slate-600/60">© {new Date().getFullYear()} - جميع الحقوق محفوظة</p>
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
                <a href="#privacy" className="hover:text-emerald-600 dark:hover:text-white transition-colors py-2">{t.privacyPolicy}</a>
                <a href="#contact" className="hover:text-emerald-600 dark:hover:text-white transition-colors py-2">{t.contactUs}</a>
            </div>
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
