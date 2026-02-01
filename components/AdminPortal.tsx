import React, { useState, useRef, useEffect } from 'react';
import { AdminSettings } from '../types';
import { Icons } from './Icons';
import { supabase } from '../services/supabaseClient';

interface AdminPortalProps {
  settings: AdminSettings;
  updateSettings: (newSettings: AdminSettings) => void;
  onClose: () => void;
}

const SETTINGS_KEY_TO_COLUMN_MAP: { [K in keyof Omit<AdminSettings, 'adminPassword'>]: string } = {
  isMaintenanceMode: 'is_maintenance_mode',
  startHour: 'start_hour',
  endHour: 'end_hour',
  enabledFeatures: 'enabled_features',
  bloodEffectText: 'blood_effect_text',
  socialLinks: 'social_links',
  mobileApp: 'mobile_app',
  siteLogo: 'site_logo',
  preloaderImage: 'preloader_image',
};

const AdminPortal: React.FC<AdminPortalProps> = ({ settings, updateSettings, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  const [activeTab, setActiveTab] = useState<'stats' | 'social' | 'maintenance' | 'features' | 'security'>('stats');
  const [localSettings, setLocalSettings] = useState(settings);
  const [newPass, setNewPass] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({ pageViews: 0, operations: 0 });
  const [isSupabaseReady, setIsSupabaseReady] = useState(!!supabase);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingPreloader, setIsDraggingPreloader] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string; key: number } | null>(null);
  const [isResettingViews, setIsResettingViews] = useState(false);
  const [isResettingOps, setIsResettingOps] = useState(false);
  
  const isWriteDisabled = !isSupabaseReady;
  const writeDisabledTooltip = isWriteDisabled ? 'الكتابة معطلة. فشل الاتصال بقاعدة البيانات.' : '';

  const featureLabels: { [key in keyof AdminSettings['enabledFeatures']]: string } = {
    converter: 'محول العملات',
    calculator: 'حاسبة الباقي',
    marketRates: 'أسعار الصرف الحية',
    showBloodEffect: 'شريط التضامن العلوي',
    electricityCalculator: 'حاسبة الكهرباء',
    enableAnalytics: 'تفعيل الإحصائيات والتتبع'
  };

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const fetchStats = async () => {
    if (!supabase) return;
    try {
      const { count: viewsCount } = await supabase.from('analytics').select('id', { count: 'exact' }).eq('event_type', 'PAGE_VIEW');
      const { count: opsCount } = await supabase.from('analytics').select('id', { count: 'exact' }).eq('event_type', 'CONVERSION_OP');
      setAnalyticsData({ pageViews: viewsCount || 0, operations: opsCount || 0 });
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
    }
  };

  useEffect(() => {
    if (isSupabaseReady && isAuthenticated) {
      fetchStats();
    }
  }, [isSupabaseReady, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (Date.now() < lockoutTime) {
      const remainingSeconds = Math.ceil((lockoutTime - Date.now()) / 1000);
      setLoginError(`محاولات كثيرة خاطئة. يرجى الانتظار ${remainingSeconds} ثانية.`);
      return;
    }

    setLoginError(false);
    setIsLoggingIn(true);

    setTimeout(() => {
      const trimmedPassword = passwordInput.trim();
      if (settings.adminPassword && trimmedPassword === settings.adminPassword) {
        setIsAuthenticated(true);
        setLoginAttempts(0);
        setLockoutTime(0);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 6) {
          setLockoutTime(Date.now() + 60000); // Lock for 1 minute
          setLoginError('تم حظرك لمدة دقيقة بسبب كثرة المحاولات الخاطئة.');
          setLoginAttempts(0);
        } else {
          setLoginError(`كلمة مرور خاطئة. ${6 - newAttempts} محاولات متبقية.`);
        }
      }
      setPasswordInput('');
      setIsLoggingIn(false);
    }, 600);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const showSaveStatus = (type: 'success' | 'error', message: string) => {
    setSaveStatus({ type, message, key: Date.now() });
  };
  
  const updateSingleSetting = async <K extends keyof typeof SETTINGS_KEY_TO_COLUMN_MAP>(
    settingKey: K,
    value: AdminSettings[K]
  ) => {
    if (isWriteDisabled) {
      showSaveStatus('error', 'فشل الحفظ: لا يوجد اتصال بقاعدة البيانات.');
      return;
    }
    setIsSaving(true);
    try {
      const columnName = SETTINGS_KEY_TO_COLUMN_MAP[settingKey];
      const { error } = await supabase
        .from('admin_settings')
        .update({ [columnName]: value })
        .eq('id', 1);

      if (error) throw error;
      
      const newSettings = { ...settings, [settingKey]: value };
      updateSettings(newSettings);
      setLocalSettings(newSettings);
      showSaveStatus('success', 'تم حفظ التغييرات بنجاح!');

    } catch (e: any) {
      console.error(`Failed to update setting '${settingKey}':`, e);
      let alertMessage = 'خطأ في الحفظ السحابي. يرجى التحقق من اتصالك بالإنترنت.';
      if (e.message && e.message.includes('security policy')) {
        alertMessage = 'فشل الحفظ بسبب قيود الأمان في قاعدة البيانات (RLS).';
      }
      showSaveStatus('error', alertMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPass) {
        showSaveStatus('error', 'الرجاء إدخال كلمة مرور جديدة.');
        return;
    }
    if (isWriteDisabled) {
        showSaveStatus('error', 'فشل تغيير كلمة المرور: لا يوجد اتصال بقاعدة البيانات.');
        return;
    }

    setIsPasswordSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ admin_password_hash: newPass })
        .eq('id', 1);

      if (error) throw error;

      updateSettings({ ...settings, adminPassword: newPass });
      setNewPass('');
      showSaveStatus('success', 'تم تغيير كلمة المرور بنجاح!');
    } catch (e: any) {
      console.error("Password change error:", e);
      let alertMessage = 'حدث خطأ أثناء تغيير كلمة المرور.';
      if (e.message && e.message.includes('security policy')) {
        alertMessage = 'فشل تغيير كلمة المرور بسبب قيود الأمان في قاعدة البيانات (RLS).';
      }
      showSaveStatus('error', alertMessage);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleResetAnalytics = async (eventType: 'PAGE_VIEW' | 'CONVERSION_OP') => {
    const eventName = eventType === 'PAGE_VIEW' ? 'الزيارات' : 'عمليات التحويل';
    if (!window.confirm(`هل أنت متأكد أنك تريد تصفير عداد ${eventName}؟ لا يمكن التراجع عن هذا الإجراء.`)) {
        return;
    }

    if (isWriteDisabled) {
        showSaveStatus('error', 'فشل التصفير: لا يوجد اتصال بقاعدة البيانات.');
        return;
    }

    if (eventType === 'PAGE_VIEW') setIsResettingViews(true);
    else setIsResettingOps(true);

    try {
        const { error } = await supabase
            .from('analytics')
            .delete()
            .eq('event_type', eventType);

        if (error) throw error;
        
        showSaveStatus('success', `تم تصفير عداد ${eventName} بنجاح.`);
        await fetchStats(); 

    } catch (e: any) {
        console.error(`Failed to reset analytics for '${eventType}':`, e);
        showSaveStatus('error', 'حدث خطأ أثناء عملية التصفير.');
    } finally {
        if (eventType === 'PAGE_VIEW') setIsResettingViews(false);
        else setIsResettingOps(false);
    }
  };


  const tabs = [
    { id: 'stats', label: 'الرئيسية والإحصائيات', icon: Icons.Stats },
    { id: 'social', label: 'التواصل الاجتماعي', icon: Icons.Social },
    { id: 'maintenance', label: 'إعدادات الصيانة', icon: Icons.Maintenance },
    { id: 'features', label: 'الميزات المفعلة', icon: Icons.Features },
    { id: 'security', label: 'الأمان وقاعدة البيانات', icon: Icons.Security },
  ];
  
  const processImageFile = (file: File, type: 'siteLogo' | 'preloaderImage') => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) { 
        showSaveStatus('error', 'حجم الصورة كبير جداً. الحد الأقصى 2 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSingleSetting(type, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      showSaveStatus('error', 'الرجاء رفع ملف صورة صالح.');
    }
  };

  const ImageUploader: React.FC<{ type: 'siteLogo' | 'preloaderImage' }> = ({ type }) => {
    const isDragging = type === 'siteLogo' ? isDraggingLogo : isDraggingPreloader;
    const setIsDragging = type === 'siteLogo' ? setIsDraggingLogo : setIsDraggingPreloader;
    const imageSrc = localSettings[type];
    const title = type === 'siteLogo' ? 'شعار الموقع' : 'صورة التحميل';

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold mb-4 dark:text-white flex items-center gap-2">
            <Icons.Upload className="w-5 h-5 text-emerald-500" />
            {title}
          </h4>
          <label 
              title={writeDisabledTooltip}
              onDragOver={(e) => { e.preventDefault(); if (!isWriteDisabled) setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (!isWriteDisabled && e.dataTransfer.files?.[0]) { processImageFile(e.dataTransfer.files[0], type); } }}
              className={`relative w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all overflow-hidden ${isWriteDisabled ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800/50' : 'cursor-pointer'} ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 scale-105' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 bg-slate-50 dark:bg-slate-900'}`}
          >
              <input type="file" disabled={isWriteDisabled} accept="image/*" onChange={(e) => { if (!isWriteDisabled && e.target.files?.[0]) { processImageFile(e.target.files[0], type); } }} className="hidden" />
              {imageSrc ? (
                  <img src={imageSrc} alt={title} className="w-full h-full object-contain p-2" />
              ) : (
                  <div className={`text-slate-400 flex flex-col items-center gap-2 ${isWriteDisabled ? 'opacity-50' : ''}`}>
                      <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm">
                        <Icons.Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-600 dark:text-slate-300">اختر صورة للرفع</p>
                        <p className="text-[10px] mt-1">PNG, JPG, SVG (Max 2MB)</p>
                      </div>
                  </div>
              )}
          </label>
          {imageSrc && (
              <button onClick={() => updateSingleSetting(type, null)} disabled={isWriteDisabled} title={writeDisabledTooltip} className="w-full mt-3 py-2 text-xs text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1">
                  <Icons.Trash className="w-3 h-3" /> إزالة الصورة
              </button>
          )}
        </div>
    );
  };

  const toggleSocialVisibility = (platform: string) => {
    const newSocialLinks = {
      ...localSettings.socialLinks,
      [platform]: {
        ...(localSettings.socialLinks as any)[platform],
        visible: !(localSettings.socialLinks as any)[platform].visible,
      },
    };
    setLocalSettings(prev => ({...prev, socialLinks: newSocialLinks}));
    updateSingleSetting('socialLinks', newSocialLinks as any);
  };


  const toggleFeature = (feature: keyof AdminSettings['enabledFeatures']) => {
    const newFeatures = { ...localSettings.enabledFeatures, [feature]: !localSettings.enabledFeatures[feature] };
    setLocalSettings(prev => ({...prev, enabledFeatures: newFeatures}));
    updateSingleSetting('enabledFeatures', newFeatures);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 dir-rtl font-['Tajawal'] animate-in fade-in duration-300">
      {!isAuthenticated ? (
        <div className={`w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 text-center relative transition-all border border-slate-200 dark:border-slate-800 ${loginError ? 'shake' : ''}`}>
          <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-red-500 transition-colors">
            <Icons.Close className="w-6 h-6" />
          </button>
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30 text-white rounded-3xl flex items-center justify-center mb-6 transform -rotate-3">
            <Icons.Settings className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black mb-2 dark:text-white">بوابة الإدارة</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">مرحباً بك، يرجى إثبات هويتك للمتابعة</p>
          <form onSubmit={handleLogin}>
            <div className="relative mb-6 group">
                <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold text-lg tracking-widest focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                placeholder="رمز الدخول"
                autoFocus
                />
            </div>
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <Icons.Security className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <button 
              type="submit" 
              disabled={isLoggingIn || Date.now() < lockoutTime}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                  <>
                    الدخول
                    <Icons.ArrowSwap className="w-4 h-4 rotate-180" />
                  </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-7xl bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-full max-h-[95vh] md:h-[85vh] md:flex-row relative border border-slate-200 dark:border-slate-800">
          
          {/* Sidebar */}
          <div className="w-full md:w-72 md:flex-shrink-0 bg-white dark:bg-slate-900 p-4 md:p-8 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-sm">
            <div className="hidden md:flex items-center gap-4 mb-10 px-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                  <Icons.Settings className="w-5 h-5" />
              </div>
              <div>
                  <h2 className="text-lg font-black dark:text-white leading-tight">لوحة التحكم</h2>
                  <p className="text-xs text-slate-400 font-bold">إدارة ليرتنا v2.0</p>
              </div>
            </div>
            
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 md:w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105 md:translate-x-2' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'}`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-emerald-400 dark:text-emerald-600' : ''}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-auto hidden md:block pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
               <button onClick={handleLogout} className="w-full flex items-center justify-start gap-3 px-4 py-3 text-slate-500 font-bold text-sm hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/10 rounded-2xl transition-colors">
                 <Icons.Logout className="w-5 h-5" />
                 تسجيل الخروج
               </button>
               <button onClick={onClose} className="w-full flex items-center justify-start gap-3 px-4 py-3 text-slate-500 font-bold text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 rounded-2xl transition-colors">
                 <Icons.Close className="w-5 h-5" />
                 إغلاق اللوحة
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50 dark:bg-slate-950 relative scroll-smooth">
             {/* Header for Mobile */}
             <div className="md:hidden flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black dark:text-white">الإعدادات</h2>
                 <button onClick={onClose} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full"><Icons.Close className="w-5 h-5" /></button>
             </div>

            {activeTab === 'stats' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {!isSupabaseReady && (
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-200 rounded-3xl text-center font-bold border border-amber-200 dark:border-amber-900/50 flex flex-col items-center gap-2">
                    <Icons.Maintenance className="w-8 h-8 opacity-50" />
                    <p>ميزات الإحصائيات معطلة بسبب فشل الاتصال بقاعدة البيانات.</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icons.Visitors className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600"><Icons.Visitors className="w-5 h-5" /></div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-wider">إجمالي الزيارات</p>
                        </div>
                        <p className="text-5xl font-black text-slate-800 dark:text-white tracking-tight">{analyticsData.pageViews.toLocaleString()}</p>
                        <div className="mt-4 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-3 py-1 rounded-full">
                            + مشاهدة حية للصفحات
                        </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icons.Converter className="w-32 h-32" />
                    </div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600"><Icons.Calculator className="w-5 h-5" /></div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-wider">العمليات الحسابية</p>
                        </div>
                        <p className="text-5xl font-black text-slate-800 dark:text-white tracking-tight">{analyticsData.operations.toLocaleString()}</p>
                        <div className="mt-4 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 inline-block px-3 py-1 rounded-full">
                            تحويل عملة + حساب فواتير
                        </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ImageUploader type="siteLogo" />
                    <ImageUploader type="preloaderImage" />
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2 opacity-70">
                      <Icons.Trash className="w-5 h-5" /> منطقة الخطر
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                          onClick={() => handleResetAnalytics('PAGE_VIEW')}
                          disabled={isWriteDisabled || isResettingViews}
                          title={writeDisabledTooltip}
                          className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 text-red-500 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group disabled:opacity-50"
                      >
                          <span className="flex items-center gap-3">
                              {isResettingViews ? <span className="animate-spin">⏳</span> : <Icons.Trash className="w-5 h-5" />}
                              تصفير الزيارات
                          </span>
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-red-700 dark:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">تأكيد</span>
                      </button>
                      <button 
                          onClick={() => handleResetAnalytics('CONVERSION_OP')}
                          disabled={isWriteDisabled || isResettingOps}
                          title={writeDisabledTooltip}
                          className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 text-red-500 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group disabled:opacity-50"
                      >
                          <span className="flex items-center gap-3">
                              {isResettingOps ? <span className="animate-spin">⏳</span> : <Icons.Trash className="w-5 h-5" />}
                              تصفير العمليات
                          </span>
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-red-700 dark:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">تأكيد</span>
                      </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/50 flex items-start gap-4">
                    <Icons.Globe className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-blue-800 dark:text-blue-300">إدارة الروابط الخارجية</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">قم بتحديث الروابط لتظهر في أسفل الصفحة الرئيسية وقسم "من نحن". الروابط المخفية لن تظهر للزوار.</p>
                    </div>
                </div>
                
                <div className="grid gap-4">
                  {Object.entries(localSettings.socialLinks || {}).map(([platform, data]) => {
                    const s = data as { url: string; visible: boolean };
                    const Icon = (Icons as any)[platform.charAt(0).toUpperCase() + platform.slice(1)] || Icons.Globe;
                    return (
                      <div key={platform} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-500/30 group">
                        <div className={`p-3 rounded-xl ${s.visible ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                             <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-sm capitalize dark:text-white">{platform}</span>
                                <button disabled={isWriteDisabled} onClick={() => toggleSocialVisibility(platform)} title={writeDisabledTooltip} className="focus:outline-none">
                                {s.visible ? <Icons.ToggleOn className="w-10 h-6 text-emerald-500" /> : <Icons.ToggleOff className="w-10 h-6 text-slate-300" />}
                                </button>
                            </div>
                            <input 
                                type="text" 
                                disabled={isWriteDisabled} 
                                title={writeDisabledTooltip}
                                value={s.url || ''} 
                                placeholder={`https://${platform}.com/...`}
                                onChange={e => {
                                    const newUrl = e.target.value;
                                    setLocalSettings(prev => ({
                                        ...prev,
                                        socialLinks: {
                                            ...prev.socialLinks,
                                            [platform]: { ...(prev.socialLinks as any)[platform], url: newUrl }
                                        }
                                    }))
                                }}
                                onBlur={() => {
                                    if (!isWriteDisabled && JSON.stringify(localSettings.socialLinks) !== JSON.stringify(settings.socialLinks)) {
                                        updateSingleSetting('socialLinks', localSettings.socialLinks);
                                    }
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs md:text-sm px-3 py-2 font-mono text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-50" 
                            />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black dark:text-white mb-6 px-2">التحكم بالميزات والخدمات</h3>
                {Object.keys(featureLabels).map((featureKey) => {
                  const feature = featureKey as keyof AdminSettings['enabledFeatures'];
                  const isActive = localSettings.enabledFeatures[feature];
                  return (
                    <div key={feature} className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${isActive ? 'bg-white dark:bg-slate-900 border-emerald-500/30 shadow-sm' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 grayscale-[0.5]'}`}>
                      <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${isActive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                             <Icons.Features className="w-6 h-6" />
                          </div>
                          <div>
                              <span className={`block font-black text-lg ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-500'}`}>{featureLabels[feature]}</span>
                              <span className="text-xs text-slate-400 font-bold">{isActive ? 'مفعل حالياً' : 'معطل'}</span>
                          </div>
                      </div>
                      <button disabled={isWriteDisabled} onClick={() => toggleFeature(feature)} title={writeDisabledTooltip} className="focus:outline-none transform transition-transform active:scale-90">
                        {isActive ? <Icons.ToggleOn className="w-14 h-8 text-emerald-500" /> : <Icons.ToggleOff className="w-14 h-8 text-slate-300" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${localSettings.isMaintenanceMode ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-full ${localSettings.isMaintenanceMode ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                            <Icons.Maintenance className="w-8 h-8" />
                        </div>
                        <div>
                            <span className="block font-black text-xl dark:text-white">وضع الصيانة</span>
                            <span className="text-sm text-slate-500 font-bold">عند التفعيل، لن يظهر الموقع للزوار</span>
                        </div>
                      </div>
                      <button disabled={isWriteDisabled} onClick={() => updateSingleSetting('isMaintenanceMode', !localSettings.isMaintenanceMode)} title={writeDisabledTooltip} className="focus:outline-none">
                        {localSettings.isMaintenanceMode ? <Icons.ToggleOn className="w-16 h-10 text-amber-500" /> : <Icons.ToggleOff className="w-16 h-10 text-slate-300" />}
                      </button>
                  </div>
                  {localSettings.isMaintenanceMode && (
                      <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-800 dark:text-amber-200 text-sm font-bold flex gap-2">
                          <Icons.About className="w-5 h-5" />
                          يمكنك الدخول كمسؤول في أي وقت عبر الزر العائم في صفحة الصيانة.
                      </div>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                      <Icons.BloodDrop className="w-6 h-6 text-red-500" />
                      <h3 className="font-black text-lg dark:text-white">شريط الأخبار / التضامن</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500">النص الظاهر في الشريط المتحرك</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            disabled={isWriteDisabled}
                            title={writeDisabledTooltip} 
                            value={localSettings.bloodEffectText} 
                            onChange={e => setLocalSettings(prev => ({...prev, bloodEffectText: e.target.value}))}
                            onBlur={() => {
                                if (!isWriteDisabled && localSettings.bloodEffectText !== settings.bloodEffectText) {
                                    updateSingleSetting('bloodEffectText', localSettings.bloodEffectText);
                                }
                            }}
                            className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white font-bold disabled:opacity-50" 
                        />
                        <Icons.Features className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">* يتطلب تفعيل ميزة "شريط التضامن العلوي" من تبويب الميزات.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/50">
                  <h4 className="font-black text-xl text-emerald-800 dark:text-emerald-400 flex items-center gap-3 mb-4">
                    <Icons.Security className="w-8 h-8" />
                    حالة الاتصال بقاعدة البيانات
                  </h4>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${isSupabaseReady ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                              {isSupabaseReady ? 'متصل بنجاح (Supabase Active)' : 'غير متصل (Check Configuration)'}
                          </span>
                      </div>
                      <p className="text-emerald-900/70 dark:text-emerald-300/70 text-sm leading-relaxed max-w-2xl bg-white/50 dark:bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                        لكي يتم حفظ التغييرات (مثل الشعار، الروابط، والميزات)، يجب عليك السماح بالكتابة في قاعدة بيانات Supabase. هذا يتطلب إعداد سياسات الأمان (Row Level Security - RLS) على جداول 
                        <code className="text-xs bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded mx-1 font-mono font-bold" dir="ltr">admin_settings</code> و 
                        <code className="text-xs bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded mx-1 font-mono font-bold" dir="ltr">analytics</code>.
                        يجب إنشاء سياسة جديدة تسمح بعمليات <b className="font-black">INSERT</b> و <b className="font-black">UPDATE</b> للدور <b className="font-black">anon</b>.
                      </p>
                      <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                         <span>📚</span> قراءة التوثيق الرسمي
                      </a>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xl font-bold dark:text-white mb-6">تغيير رمز المرور</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input type="password" disabled={isWriteDisabled} title={writeDisabledTooltip} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="اكتب الرمز الجديد هنا" className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 outline-none transition-all dark:text-white font-bold text-center tracking-widest disabled:opacity-50" />
                    <button 
                      onClick={handlePasswordChange} 
                      className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2" 
                      disabled={isWriteDisabled || isPasswordSaving}
                      title={writeDisabledTooltip}
                    >
                      {isPasswordSaving ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : 'تحديث الرمز'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile Footer for Actions */}
            <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 md:hidden space-y-3 pb-20">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-amber-50 text-amber-700 font-bold rounded-2xl dark:bg-amber-900/20 dark:text-amber-200">
                <Icons.Logout className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </div>
          </div>
          
          {/* Toast Notification */}
          {saveStatus && (
             <div key={saveStatus.key} className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white font-bold text-sm shadow-2xl animate-in fade-in slide-in-from-bottom-5 z-[3000] flex items-center gap-3 backdrop-blur-md ${saveStatus.type === 'success' ? 'bg-emerald-600/90' : 'bg-red-600/90'}`}>
                {saveStatus.type === 'success' ? <Icons.ToggleOn className="w-5 h-5" /> : <Icons.Close className="w-5 h-5" />}
                {saveStatus.message}
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPortal;