import React from 'react';
import { RatesResponse, Translation } from '../types';

interface RatePrintViewProps {
  rates: RatesResponse | null;
  t: Translation;
  lang: 'ar' | 'en';
}

const getCurrencyNameForPrint = (currencyCode: string): string => {
    switch (currencyCode) {
        case 'USD': return 'الدولار الأمريكي';
        case 'EUR': return 'اليورو الأوروبي';
        case 'TRY': return 'الليرة التركية';
        default: return currencyCode;
    }
};

const RatePrintView: React.FC<RatePrintViewProps> = ({ rates, t, lang }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString(lang === 'ar' ? 'ar-SY' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatValue = (val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const hasData = rates && !rates.error && 
                  ((rates.cbsRates && rates.cbsRates.length > 0) || 
                   (rates.blackMarketRates && rates.blackMarketRates.length > 0));

  return (
    <div id="printable-document" className="absolute -top-[9999px] -left-[9999px] bg-white p-12 text-slate-900 dir-rtl font-['Tajawal'] w-[800px]">
      {/* Header */}
      <div className="border-b-4 border-emerald-600 pb-8 mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-black text-emerald-600 mb-2">ليرتنا</h1>
          <p className="text-xl font-bold text-slate-500">دليلك الموثوق لأسعار الصرف في سوريا</p>
        </div>
        <div className="text-left">
          <div className="text-2xl font-black mb-1">{dateStr}</div>
          <div className="text-xl font-bold text-emerald-600">{timeStr}</div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-black bg-slate-100 py-4 rounded-2xl inline-block px-12 border-2 border-slate-200">
          وثيقة أسعار الصرف الرسمية
        </h2>
      </div>

      {hasData ? (
        <div className="grid grid-cols-1 gap-12">
          {/* CBS Table */}
          {rates.cbsRates && rates.cbsRates.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6 border-r-8 border-emerald-500 pr-4">
                <h3 className="text-3xl font-black">{t.cbs}</h3>
              </div>
              <table className="w-full text-2xl border-collapse">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-800">
                    <th className="border-2 border-slate-200 p-4 text-right">العملة</th>
                    <th className="border-2 border-slate-200 p-4 text-center">{t.buy}</th>
                    <th className="border-2 border-slate-200 p-4 text-center">{t.sell}</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.cbsRates.map(rate => (
                    <tr key={rate.currency}>
                      <td className="border-2 border-slate-200 p-6 font-black">{getCurrencyNameForPrint(rate.currency)}</td>
                      <td className="border-2 border-slate-200 p-6 text-center font-black text-emerald-700">{formatValue(rate.buy)}</td>
                      <td className="border-2 border-slate-200 p-6 text-center font-black">{formatValue(rate.sell)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Black Market Table */}
          {rates.blackMarketRates && rates.blackMarketRates.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6 border-r-8 border-blue-500 pr-4">
                <h3 className="text-3xl font-black">{t.blackMarket}</h3>
              </div>
              <table className="w-full text-2xl border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-blue-800">
                    <th className="border-2 border-slate-200 p-4 text-right">العملة</th>
                    <th className="border-2 border-slate-200 p-4 text-center">{t.buy}</th>
                    <th className="border-2 border-slate-200 p-4 text-center">{t.sell}</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.blackMarketRates.map(rate => (
                    <tr key={rate.currency}>
                      <td className="border-2 border-slate-200 p-6 font-black">{getCurrencyNameForPrint(rate.currency)}</td>
                      <td className="border-2 border-slate-200 p-6 text-center font-black text-emerald-700">{formatValue(rate.buy)}</td>
                      <td className="border-2 border-slate-200 p-6 text-center font-black">{formatValue(rate.sell)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      ) : (
        <div className="text-center mt-20 p-8 border-4 border-dashed border-red-200 rounded-2xl">
          <h2 className="text-3xl font-black text-red-600">
            {rates?.error ? "خطأ في تحميل البيانات" : "لا توجد بيانات للطباعة"}
          </h2>
          <p className="text-xl text-slate-500 mt-4">
            {rates?.error ? "تعذر جلب أسعار الصرف من المصدر." : "يرجى التأكد من تحميل الأسعار في الصفحة الرئيسية أولاً."}
          </p>
        </div>
      )}


      {/* Footer Disclaimer */}
      <div className="mt-20 pt-10 border-t-2 border-slate-100 text-center">
        <p className="text-slate-400 text-xl font-bold mb-4 italic">
          * هذه الأسعار للاطلاع فقط وقد تتغير لحظياً حسب تقلبات السوق.
        </p>
        <div className="bg-emerald-600 text-white py-6 rounded-3xl">
          <p className="text-2xl font-black tracking-widest uppercase">WWW.LIRATNA.SY</p>
          <p className="text-lg opacity-80 mt-1 font-bold">المصدر الأول والوحيد للشفافية المالية في سوريا</p>
        </div>
      </div>
    </div>
  );
};

export default RatePrintView;