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
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  
  const isWriteDisabled = !isSupabaseReady;
  const writeDisabledTooltip = isWriteDisabled ? 'الكتابة معطلة. فشل الاتصال بقاعدة البيانات.' : '';

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
    setLoginError(false);
    setIsLoggingIn(true);

    setTimeout(() => {
      const trimmedPassword = passwordInput.trim();
      if (settings.adminPassword && trimmedPassword === settings.adminPassword) {
        setIsAuthenticated(true);
      } else {
        setLoginError(true);
        setTimeout(() => setLoginError(false), 820);
      }
      setPasswordInput('');
      setIsLoggingIn(false);
    }, 300);
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


  const tabs = [
    { id: 'stats', label: 'الإحصائيات', icon: Icons.Stats },
    { id: 'social', label: 'التواصل', icon: Icons.Social },
    { id: 'maintenance', label: 'الصيانة', icon: Icons.Maintenance },
    { id: 'features', label: 'الميزات', icon: Icons.Features },
    { id: 'security', label: 'الأمان', icon: Icons.Security },
  ];
  
  const processImageFile = (file: File, type: 'siteLogo' | 'preloaderImage') => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
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
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
          <h4 className="font-bold mb-4 dark:text-white">{title}</h4>
          <label 
              title={writeDisabledTooltip}
              onDragOver={(e) => { e.preventDefault(); if (!isWriteDisabled) setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (!isWriteDisabled && e.dataTransfer.files?.[0]) { processImageFile(e.dataTransfer.files[0], type); } }}
              className={`w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-colors ${isWriteDisabled ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800/50' : 'cursor-pointer'} ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'}`}
          >
              <input type="file" disabled={isWriteDisabled} accept="image/*" onChange={(e) => { if (!isWriteDisabled && e.target.files?.[0]) { processImageFile(e.target.files[0], type); } }} className="hidden" />
              {imageSrc ? (
                  <img src={imageSrc} alt={title} className="max-h-full max-w-full object-contain p-2 rounded-lg" />
              ) : (
                  <div className={`text-slate-400 flex flex-col items-center ${isWriteDisabled ? 'opacity-50' : ''}`}>
                      <Icons.Upload className="w-10 h-10 mb-2" />
                      <p className="font-bold text-sm">اسحب وأفلت الصورة هنا</p>
                      <p className="text-xs">أو انقر للاختيار من ملفاتك</p>
                  </div>
              )}
          </label>
          {imageSrc && (
              <button onClick={() => updateSingleSetting(type, null)} disabled={isWriteDisabled} title={writeDisabledTooltip} className="w-full mt-3 py-2 text-xs text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none">
                  إزالة الصورة
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
    <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl font-['Tajawal']">
      {!isAuthenticated ? (
        <div className={`w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center relative transition-all ${loginError ? 'shake' : ''}`}>
          <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-red-500 transition-colors">
            <Icons.Close className="w-6 h-6" />
          </button>
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Icons.Security className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black mb-2 dark:text-white">الوصول مطلوب</h2>
          <p className="text-sm text-slate-500 mb-6">الرجاء إدخال كلمة المرور للوصول إلى لوحة الإدارة.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-4 rounded-xl border-2 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-center font-bold text-lg tracking-widest focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              placeholder="••••••••"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full mt-4 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:bg-slate-400 flex items-center justify-center"
            >
              {isLoggingIn ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full max-h-[95vh] md:h-[90vh] md:flex-row relative">
          <div className="w-full md:w-64 md:flex-shrink-0 bg-slate-50 dark:bg-slate-900/50 p-4 md:p-6 border-b md:border-b-0 md:border-l dark:border-slate-700 flex flex-col">
            <div className="hidden md:flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-600 rounded-lg text-white"><Icons.Security className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold dark:text-white">بوابة الإدارة</h2>
            </div>
            <nav className="flex flex-row md:flex-col gap-1 flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-auto hidden md:block pt-4 border-t dark:border-slate-700/50">
               <button onClick={handleLogout} className="w-full mt-4 flex items-center justify-center gap-2 p-3 text-amber-600 font-bold text-sm hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl">
                 <Icons.Logout className="w-4 h-4" />
                 تسجيل الخروج
               </button>
               <button onClick={onClose} className="w-full mt-2 flex items-center justify-center gap-2 p-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl">
                 <Icons.Close className="w-4 h-4" />
                 إغلاق الإدارة
               </button>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white dark:bg-slate-800">
            {activeTab === 'stats' && (
              <div className="space-y-8">
                {!isSupabaseReady && (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-center font-bold border border-amber-200">
                    <p>ميزات الإحصائيات معطلة بسبب فشل الاتصال بقاعدة البيانات.</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.Visitors className="w-4 h-4 text-emerald-600" />
                      <p className="text-xs font-black text-slate-400 uppercase">الزيارات</p>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{analyticsData.pageViews}</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.Converter className="w-4 h-4 text-blue-600" />
                      <p className="text-xs font-black text-slate-400 uppercase">عمليات التحويل</p>
                    </div>
                    <p className="text-3xl font-black text-blue-600">{analyticsData.operations}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploader type="siteLogo" />
                    <ImageUploader type="preloaderImage" />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                {isWriteDisabled && (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-center font-bold border border-amber-200">
                    <p>التعديل معطل بسبب فشل الاتصال بقاعدة البيانات.</p>
                  </div>
                )}
                <h3 className="text-xl font-bold dark:text-white">روابط التواصل الاجتماعي</h3>
                <div className="space-y-3">
                  {Object.entries(localSettings.socialLinks || {}).map(([platform, data]) => {
                    const s = data as { url: string; visible: boolean };
                    return (
                      <div key={platform} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border dark:border-slate-700">
                        <button disabled={isWriteDisabled} onClick={() => toggleSocialVisibility(platform)} title={writeDisabledTooltip}>
                          {s.visible ? <Icons.ToggleOn className="w-8 h-8 text-emerald-600" /> : <Icons.ToggleOff className="w-8 h-8 text-slate-300" />}
                        </button>
                        <span className="font-bold text-sm w-20 capitalize">{platform}</span>
                        <input 
                            type="text" 
                            disabled={isWriteDisabled} 
                            title={writeDisabledTooltip}
                            value={s.url || ''} 
                            onChange={e => {
                                const newUrl = e.target.value;
                                setLocalSettings(prev => ({
                                    ...prev,
                                    socialLinks: {
                                        ...prev.socialLinks,
                                        [platform]: {
                                            ...(prev.socialLinks as any)[platform],
                                            url: newUrl,
                                        }
                                    }
                                }))
                            }}
                            onBlur={() => {
                                if (!isWriteDisabled && JSON.stringify(localSettings.socialLinks) !== JSON.stringify(settings.socialLinks)) {
                                    updateSingleSetting('socialLinks', localSettings.socialLinks);
                                }
                            }}
                            className="flex-1 p-2 bg-white dark:bg-slate-800 border rounded-lg text-sm disabled:opacity-50" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-3">
                {isWriteDisabled && (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-center font-bold border border-amber-200">
                    <p>التعديل معطل بسبب فشل الاتصال بقاعدة البيانات.</p>
                  </div>
                )}
                {Object.keys(localSettings.enabledFeatures || {}).map((feature) => (
                  <div key={feature} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border dark:border-slate-700">
                    <span className="font-bold capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                    <button disabled={isWriteDisabled} onClick={() => toggleFeature(feature as any)} title={writeDisabledTooltip}>
                      {localSettings.enabledFeatures[feature as keyof AdminSettings['enabledFeatures']] ? <Icons.ToggleOn className="w-10 h-10 text-emerald-600" /> : <Icons.ToggleOff className="w-10 h-10 text-slate-300" />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                {isWriteDisabled && (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-center font-bold border border-amber-200">
                    <p>التعديل معطل بسبب فشل الاتصال بقاعدة البيانات.</p>
                  </div>
                )}
                <div className="flex items-center justify-between p-6 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-4">
                    <Icons.Maintenance className="w-6 h-6 text-amber-600" />
                    <span className="font-bold">وضع الصيانة الكامل</span>
                  </div>
                  <button disabled={isWriteDisabled} onClick={() => updateSingleSetting('isMaintenanceMode', !localSettings.isMaintenanceMode)} title={writeDisabledTooltip}>
                    {localSettings.isMaintenanceMode ? <Icons.ToggleOn className="w-12 h-12 text-emerald-600" /> : <Icons.ToggleOff className="w-12 h-12 text-slate-300" />}
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">نص التضامن العلوي</label>
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
                    className="w-full p-4 rounded-xl border dark:bg-slate-800 disabled:opacity-50" />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/50">
                  <h4 className="font-black text-lg text-emerald-800 dark:text-emerald-300 flex items-center gap-3 mb-3">
                    <Icons.About className="w-6 h-6" />
                    ملاحظة هامة لتفعيل الحفظ
                  </h4>
                  <p className="text-emerald-700 dark:text-emerald-400 text-sm leading-relaxed">
                    لكي يتم حفظ التغييرات (مثل الشعار، الروابط، والميزات)، يجب عليك السماح بالكتابة في قاعدة بيانات Supabase. هذا يتطلب إعداد سياسات الأمان (Row Level Security - RLS) على جداول 
                    <code className="text-xs bg-emerald-200 dark:bg-emerald-800 p-1 rounded-md mx-1" dir="ltr">admin_settings</code> و 
                    <code className="text-xs bg-emerald-200 dark:bg-emerald-800 p-1 rounded-md mx-1" dir="ltr">analytics</code>.
                    <br/>
                    يجب إنشاء سياسة جديدة تسمح بعمليات <b className="font-black">INSERT</b> و <b className="font-black">UPDATE</b> للدور <b className="font-black">anon</b>.
                    <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noopener noreferrer" className="underline font-bold block mt-2 hover:text-emerald-500">
                      اضغط هنا لزيارة التوثيق الرسمي لـ Supabase ومعرفة كيفية إعداد RLS.
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold dark:text-white">تغيير رمز المرور</h3>
                  <div className="space-y-2 mt-4">
                    <input type="password" disabled={isWriteDisabled} title={writeDisabledTooltip} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="الرمز الجديد" className="w-full p-4 rounded-xl border dark:bg-slate-800 disabled:opacity-50" />
                    <button 
                      onClick={handlePasswordChange} 
                      className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:bg-slate-400 flex items-center justify-center" 
                      disabled={isWriteDisabled || isPasswordSaving}
                      title={writeDisabledTooltip}
                    >
                      {isPasswordSaving ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : 'تغيير الرمز الآن'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Mobile-only footer for actions */}
            <div className="mt-8 pt-6 border-t dark:border-slate-700/50 md:hidden">
              <button onClick={handleLogout} className="w-full mb-2 flex items-center justify-center gap-2 p-3 text-amber-600 font-bold text-sm hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl">
                <Icons.Logout className="w-4 h-4" />
                تسجيل الخروج
              </button>
              <button onClick={onClose} className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl">
                <Icons.Close className="w-4 h-4" />
                إغلاق الإدارة
              </button>
            </div>
          </div>
          {saveStatus && (
             <div key={saveStatus.key} className={`fixed bottom-5 left-1/2 -translate-x-1/2 p-4 rounded-xl text-white font-bold text-sm shadow-2xl animate-in fade-in slide-in-from-bottom-5 z-[2000] ${saveStatus.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                {saveStatus.message}
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPortal;