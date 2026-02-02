import React from 'react';
import { Icons } from './Icons';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-slate-800 text-slate-300 p-4 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto my-4 border border-slate-700 shadow-inner">
    <code>{children}</code>
  </pre>
);

const ApiDocs: React.FC = () => {
    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api';

    return (
        <article className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-12 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300">
            <header className="mb-12 text-center">
                <div className="inline-block p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
                    <Icons.Services className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white">واجهة ليرتنا البرمجية (API)</h1>
                <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                    أهلاً بك في صفحة المطورين! يمكنك استخدام واجهتنا البرمجية المجانية لدمج خدمات أسعار الصرف وتحويل العملات وحساب الكهرباء في تطبيقاتك.
                </p>
            </header>

            <section className="space-y-12">

                {/* Authentication */}
                <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                        <Icons.Security className="w-5 h-5 text-emerald-500" />
                        المصادقة (Authentication)
                    </h2>
                    <p>الواجهة حالياً مفتوحة ولا تتطلب مفتاح API (API Key). يمكنك إجراء الطلبات مباشرة.</p>
                </div>
                
                {/* Endpoint 1: Exchange Rates */}
                <div>
                    <h3 className="text-2xl font-bold mb-1 text-slate-800 dark:text-white">أسعار الصرف</h3>
                    <p className="mb-4 text-slate-500">لجلب آخر أسعار الصرف من المصرف المركزي والسوق الموازية.</p>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded-full text-xs sm:text-sm font-bold">GET</span>
                        <code className="text-sm sm:text-base font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">{baseUrl}/rates</code>
                    </div>
                    
                    <h4 className="font-bold mt-6 mb-2">المعلمات (Query Parameters):</h4>
                    <p><code className="font-mono text-sm bg-slate-200 dark:bg-slate-700 p-1 rounded">currencies</code> (اختياري): قائمة بالعملات مفصولة بفاصلة. مثال: <code className="font-mono text-sm">USD,EUR,TRY</code>.</p>

                    <h4 className="font-bold mt-6 mb-2">مثال للاستجابة الناجحة:</h4>
                    <CodeBlock>{`{
  "cbsRates": [
    { "currency": "دولار أمريكي", "buy": 13500, "sell": 13600, ... }
  ],
  "blackMarketRates": [
    { "currency": "دولار أمريكي", "buy": 14500, "sell": 14600, ... }
  ],
  "timestampUtc": "2024-01-01T12:00:00Z"
}`}</CodeBlock>
                </div>

                {/* Endpoint 2: Currency Converter */}
                <div>
                    <h3 className="text-2xl font-bold mb-1 text-slate-800 dark:text-white">محول العملة (قديم/جديد)</h3>
                    <p className="mb-4 text-slate-500">للتحويل بين فئات الليرة السورية القديمة والجديدة.</p>
                     <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded-full text-xs sm:text-sm font-bold">GET</span>
                        <code className="text-sm sm:text-base font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">{baseUrl}/convert</code>
                    </div>

                    <h4 className="font-bold mt-6 mb-2">المعلمات (Query Parameters):</h4>
                    <ul className="list-disc pr-5 space-y-1">
                        <li><code className="font-mono text-sm bg-slate-200 dark:bg-slate-700 p-1 rounded">amount</code> (إجباري): المبلغ المراد تحويله.</li>
                        <li><code className="font-mono text-sm bg-slate-200 dark:bg-slate-700 p-1 rounded">from</code> (إجباري): 'old' أو 'new'.</li>
                        <li><code className="font-mono text-sm bg-slate-200 dark:bg-slate-700 p-1 rounded">to</code> (إجباري): 'old' أو 'new'.</li>
                    </ul>

                    <h4 className="font-bold mt-6 mb-2">مثال للطلب:</h4>
                    <code className="text-sm sm:text-base font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block overflow-x-auto">{baseUrl}/convert?amount=50000&from=old&to=new</code>

                    <h4 className="font-bold mt-6 mb-2">مثال للاستجابة الناجحة:</h4>
                    <CodeBlock>{`{
  "input": { "amount": 50000, "from": "old" },
  "output": { "amount": 500, "to": "new" },
  "rate": 100
}`}</CodeBlock>

                    <h4 className="font-bold mt-6 mb-2">مثال لاستجابة خاطئة:</h4>
                    <CodeBlock>{`{
  "error": "Missing required parameter: amount"
}`}</CodeBlock>
                </div>

                {/* Endpoint 3: Electricity Calculator */}
                <div>
                    <h3 className="text-2xl font-bold mb-1 text-slate-800 dark:text-white">حاسبة الكهرباء</h3>
                    <p className="mb-4 text-slate-500">لحساب تكلفة فاتورة الكهرباء بناءً على الاستهلاك ونوع الاشتراك.</p>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded-full text-xs sm:text-sm font-bold">GET</span>
                        <code className="text-sm sm:text-base font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">{baseUrl}/electricity</code>
                    </div>

                    <h4 className="font-bold mt-6 mb-2">المعلمات (Query Parameters):</h4>
                     <ul className="list-disc pr-5 space-y-1">
                        <li><code className="font-mono text-sm bg-slate-200 dark:bg-slate-700 p-1 rounded">consumption</code> (إجباري): كمية الاستهلاك بالكيلو واط.</li>
                        <li><code className="font-mono text-sm bg-slate-200 dark:bg-slate-700 p-1 rounded">tariffId</code> (إجباري): نوع الاشتراك (مثال: 'household', 'commercial').</li>
                    </ul>

                     <h4 className="font-bold mt-6 mb-2">مثال للطلب:</h4>
                    <code className="text-sm sm:text-base font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block overflow-x-auto">{baseUrl}/electricity?consumption=450&tariffId=household</code>

                    <h4 className="font-bold mt-6 mb-2">مثال للاستجابة الناجحة:</h4>
                    <CodeBlock>{`{
  "total": 205000,
  "breakdown": [
    { "tier": "الشريحة 1", "consumption": 300, "rate": 600, "cost": 180000 },
    { "tier": "الشريحة 2", "consumption": 150, "rate": 1400, "cost": 25000 }
  ]
}`}</CodeBlock>
                </div>
            </section>
        </article>
    );
};

export default ApiDocs;
