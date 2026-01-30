import React, { useState, useRef, useEffect } from 'react';
import { AdminSettings } from '../types';
import { Icons } from './Icons';
import { supabase, setAndInitializeSupabase, usingFallbackKey } from '../services/supabaseClient';

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
};

const AdminPortal: React.FC<AdminPortalProps> = ({ settings, updateSettings, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'stats' | 'social' | 'maintenance' | 'features' | 'security'>('stats');
  const [localSettings, setLocalSettings] = useState(settings);
  const [newPass, setNewPass] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({ pageViews: 0, operations: 0 });
  const [isSupabaseReady, setIsSupabaseReady] = useState(!!supabase);
  const [isDragging, setIsDragging] = useState(false);
  
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    setIsLoggingIn(true);

    if (!supabase) {
        alert('لا يمكن التحقق من كلمة المرور. لم يتم تكوين Supabase.');
        setLoginError(true);
        setTimeout(() => setLoginError(false), 820);
        setIsLoggingIn(false);
        return;
    }

    try {
        const { data, error } = await supabase
            .from('admin_settings')
            .select('admin_password_hash')
            .eq('id', 1)
            .single();

        if (error) throw error;
        
        if (data && data.admin_password_hash === passwordInput) {
            setIsAuthenticated(true);
        } else {
            setLoginError(true);
            setTimeout(() => setLoginError(false), 820);
        }
    } catch (err) {
        console.error("Login error:", err);
        alert('حدث خطأ أثناء محاولة تسجيل الدخول. يرجى التحقق من اتصالك بالإنترنت.');
        setLoginError(true);
        setTimeout(() => setLoginError(false), 820);
    } finally {
        setPasswordInput('');
        setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  const updateSingleSetting = async <K extends keyof typeof SETTINGS_KEY_TO_COLUMN_MAP>(
    settingKey: K,
    value: AdminSettings[K]
  ) => {
    if (!supabase) {
      alert('خطأ في الإعداد: لم يتم تكوين Supabase. لا يمكن حفظ التغييرات.');
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
      
      updateSettings(prevSettings => ({
        ...prevSettings,
        [settingKey]: value
      }));
    } catch (e) {
      console.error(`Failed to update setting '${settingKey}':`, e);
      alert('خطأ في الحفظ السحابي');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPass) {
      alert("الرجاء إدخال كلمة مرور جديدة.");
      return;
    }
    if (!supabase) {
      alert("لا يمكن تغيير كلمة المرور. لم يتم تكوين Supabase.");
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
      alert('تم تغيير كلمة المرور بنجاح!');
    } catch (e) {
      console.error("Password change error:", e);
      alert('حدث خطأ أثناء تغيير كلمة المرور.');
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
  
  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSingleSetting('siteLogo', reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('الرجاء رفع ملف صورة صالح.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
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

  const handleSaveKey = () => {
    if (setAndInitializeSupabase(keyInput)) {
      setIsSupabaseReady(true);
      setKeyInput('');
      alert('تم حفظ مفتاح Supabase بنجاح! سيتم الآن تفعيل الميزات.');
    } else {
      alert('المفتاح الذي تم إدخاله غير صالح. يرجى التحقق مرة أخرى.');
    }
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
        <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full max-h-[95vh] md:h-[90vh] md:flex-row">
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
                    <p className="mb-2">ميزات الإحصائيات معطلة لأن مفتاح Supabase غير موجود.</p>
                    <button onClick={() => setActiveTab('security')} className="text-sm underline">انتقل إلى قسم الأمان لإضافته الآن</button>
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
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                  <h4 className="font-bold mb-4 dark:text-white">شعار الموقع</h4>
                  <label 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`w-full h-36 cursor-pointer rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'}`}
                  >
                      <input type="file" disabled={!isSupabaseReady} accept="image/*" onChange={handleFileChange} className="hidden" />
                      {localSettings.siteLogo ? (
                          <img src={localSettings.siteLogo} alt="Site Logo" className="max-h-full max-w-full object-contain p-2 rounded-lg" />
                      ) : (
                          <div className="text-slate-400 flex flex-col items-center">
                              <Icons.Upload className="w-10 h-10 mb-2" />
                              <p className="font-bold text-sm">اسحب وأفلت الصورة هنا</p>
                              <p className="text-xs">أو انقر للاختيار من ملفاتك</p>
                          </div>
                      )}
                  </label>
                  {localSettings.siteLogo && (
                      <button onClick={() => updateSingleSetting('siteLogo', null)} className="w-full mt-3 py-2 text-xs text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors">
                          إزالة الشعار
                      </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                {!isSupabaseReady && (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-center font-bold border border-amber-200">
                    <p>لا يمكن تعديل الروابط بدون مفتاح Supabase. <button onClick={() => setActiveTab('security')} className="underline">أضف المفتاح</button></p>
                  </div>
                )}
                <h3 className="text-xl font-bold dark:text-white">روابط التواصل الاجتماعي</h3>
                <div className="space-y-3">
                  {Object.entries(localSettings.socialLinks || {}).map(([platform, data]) => {
                    const s = data as { url: string; visible: boolean };
                    return (
                      <div key={platform} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border dark:border-slate-700">
                        <button disabled={!isSupabaseReady} onClick={() => toggleSocialVisibility(platform)}>
                          {s.visible ? <Icons.ToggleOn className="w-8 h-8 text-emerald-600" /> : <Icons.ToggleOff className="w-8 h-8 text-slate-300" />}
                        </button>
                        <span className="font-bold text-sm w-20 capitalize">{platform}</span>
                        <input 
                            type="text" 
                            disabled={!isSupabaseReady} 
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
                                if (JSON.stringify(localSettings.socialLinks) !== JSON.stringify(settings.socialLinks)) {
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
                {!isSupabaseReady && (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-center font-bold border border-amber-200">
                    <p>لا يمكن تعديل الميزات بدون مفتاح Supabase. <button onClick={() => setActiveTab('security')} className="underline">أضف المفتاح</button></p>
                  </div>
                )}
                {Object.keys(localSettings.enabledFeatures || {}).map((feature) => (
                  <div key={feature} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border dark:border-slate-700">
                    <span className="font-bold capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                    <button disabled={!isSupabaseReady} onClick={() => toggleFeature(feature as any)}>
                      {localSettings.enabledFeatures[feature as keyof AdminSettings['enabledFeatures']] ? <Icons.ToggleOn className="w-10 h-10 text-emerald-600" /> : <Icons.ToggleOff className="w-10 h-10 text-slate-300" />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                {!isSupabaseReady && (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-center font-bold border border-amber-200">
                    <p>لا يمكن تعديل الصيانة بدون مفتاح Supabase. <button onClick={() => setActiveTab('security')} className="underline">أضف المفتاح</button></p>
                  </div>
                )}
                <div className="flex items-center justify-between p-6 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-4">
                    <Icons.Maintenance className="w-6 h-6 text-amber-600" />
                    <span className="font-bold">وضع الصيانة الكامل</span>
                  </div>
                  <button disabled={!isSupabaseReady} onClick={() => updateSingleSetting('isMaintenanceMode', !localSettings.isMaintenanceMode)}>
                    {localSettings.isMaintenanceMode ? <Icons.ToggleOn className="w-12 h-12 text-emerald-600" /> : <Icons.ToggleOff className="w-12 h-12 text-slate-300" />}
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">نص التضامن العلوي</label>
                  <input 
                    type="text" 
                    disabled={!isSupabaseReady} 
                    value={localSettings.bloodEffectText} 
                    onChange={e => setLocalSettings(prev => ({...prev, bloodEffectText: e.target.value}))}
                    onBlur={() => {
                        if (localSettings.bloodEffectText !== settings.bloodEffectText) {
                            updateSingleSetting('bloodEffectText', localSettings.bloodEffectText);
                        }
                    }}
                    className="w-full p-4 rounded-xl border dark:bg-slate-800 disabled:opacity-50" />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                  <h3 className="text-xl font-bold dark:text-white mb-4">إعدادات Supabase</h3>
                   {usingFallbackKey && (
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm border border-blue-200 dark:border-blue-800/50">
                      <p className="font-bold text-blue-700 dark:text-blue-300">
                        ملاحظة: يتم حالياً استخدام مفتاح اتصال افتراضي.
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 mt-1">
                        للسيطرة الكاملة على بياناتك وإحصائياتك، يوصى بشدة بإضافة مفتاحك الخاص من مشروع Supabase.
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-slate-500 mb-4">
                    لربط التطبيق بقاعدة بياناتك، يرجى إدخال المفتاح العام (anon key) الخاص بمشروعك في Supabase.
                    <br />
                    يمكنك العثور عليه في: <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded-md" dir="ltr">Project Settings &gt; API</code>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text" 
                      value={keyInput} 
                      onChange={e => setKeyInput(e.target.value)} 
                      placeholder="الصق مفتاح anon العام هنا" 
                      className="flex-1 p-4 rounded-xl border dark:bg-slate-800" 
                      dir="ltr"
                    />
                    <button onClick={handleSaveKey} className="px-6 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">حفظ المفتاح</button>
                  </div>
                   {isSupabaseReady && !usingFallbackKey && <p className="text-sm text-emerald-600 mt-3 font-bold">تم تكوين Supabase بنجاح باستخدام مفتاحك الخاص!</p>}
                   <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg text-sm border border-red-200 dark:border-red-800/50">
                    <p className="font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                      <Icons.Security className="w-4 h-4"/>
                      تحذير أمني هام:
                    </p>
                    <p className="text-red-600 dark:text-red-400 mt-1">
                      استخدم فقط المفتاح العام الذي يبدأ بـ <code className="text-xs" dir="ltr">eyJ...</code> (anon key). 
                      <strong className="font-black"> لا تستخدم أبداً</strong> المفتاح السري (service_role key) هنا، فذلك يعرض قاعدة بياناتك لخطر الاختراق الكامل.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold dark:text-white">تغيير رمز المرور</h3>
                  <div className="space-y-2 mt-4">
                    <input type="password" disabled={!isSupabaseReady} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="الرمز الجديد" className="w-full p-4 rounded-xl border dark:bg-slate-800 disabled:opacity-50" />
                    <button 
                      onClick={handlePasswordChange} 
                      className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:bg-slate-400 flex items-center justify-center" 
                      disabled={!isSupabaseReady || isPasswordSaving}
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
        </div>
      )}
    </div>
  );
};

export default AdminPortal;