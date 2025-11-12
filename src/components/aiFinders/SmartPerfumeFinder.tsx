// src/components/aiFinders/SmartPerfumeFinder.tsx
"use client"; 

import React, { useState, useTransition } from 'react'; // useTransition را اضافه کن
import { Sparkles, LoaderCircle } from 'lucide-react';
// تابع Server Action را وارد کن
import { getSmartPerfumeSuggestionAction } from '@/lib/actions/aiActions'; 

export default function SmartPerfumeFinder() {
  const [occasion, setOccasion] = useState('');
  const [scentPreference, setScentPreference] = useState('');
  const [personality, setPersonality] = useState('');
  
  const [results, setResults] = useState('');
  const [error, setError] = useState<string | null>(null); // برای نمایش خطاهای احتمالی
  
  // useTransition برای مدیریت حالت pending بدون بلاک کردن UI
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // پاک کردن خطای قبلی
    setResults(''); // پاک کردن نتایج قبلی

    startTransition(async () => { // اجرای Server Action داخل startTransition
      const response = await getSmartPerfumeSuggestionAction({ 
        occasion, 
        scentPreference, 
        personality 
      });

      if (response.error) {
        setError(response.error);
        setResults(''); // در صورت خطا، نتایج را خالی کن
      } else if (response.suggestion) {
        setResults(response.suggestion);
        setError(null);
      }
    });
  };

  return (
    <section id="aiPerfumeFinder" className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6 sm:p-8 rounded-xl shadow-lg border border-purple-200">
      <div className="flex items-center mb-4">
        <Sparkles size={28} className="text-purple-600 ml-3" />
        <h3 className="text-2xl font-semibold text-purple-700">کشف عطر هوشمند</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        هنوز عطر ایده‌آل خود را پیدا نکرده‌ای؟ به چند سوال پاسخ بده تا هوش مصنوعی ما بهترین‌ها را به تو پیشنهاد دهد!
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* فیلدهای ورودی بدون تغییر باقی می‌مانند */}
        <div>
          <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">
            مناسبت (مثلاً: روزمره، مهمانی شب، رسمی)
          </label>
          <input 
            type="text" 
            id="occasion" 
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="مثلاً: یک قرار عاشقانه"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label htmlFor="scent_preference" className="block text-sm font-medium text-gray-700 mb-1">
            نوع رایحه مورد علاقه (مثلاً: گلی، چوبی، شیرین)
          </label>
          <input 
            type="text" 
            id="scent_preference" 
            value={scentPreference}
            onChange={(e) => setScentPreference(e.target.value)}
            placeholder="مثلاً: رایحه‌های خنک و دریایی"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-1">
            شخصیت خود را چگونه توصیف می‌کنی (مثلاً: پر انرژی، آرام، جسور)
          </label>
          <input 
            type="text" 
            id="personality" 
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="مثلاً: فردی با اعتماد به نفس و مدرن"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending} // دکمه در هنگام پردازش غیرفعال می‌شود
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {isPending ? ( // نمایش آیکون لودینگ بر اساس isPending
            <LoaderCircle size={20} className="animate-spin ml-2" />
          ) : (
            <Sparkles size={20} className="ml-2" />
          )}
          دریافت پیشنهاد هوشمند
        </button>
      </form>

      {/* نمایش خطا */}
      {error && (
        <div className="mt-6 p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          <p className="font-semibold">خطا:</p>
          {error}
        </div>
      )}

      {/* نمایش نتایج (فقط اگر خطایی نباشد و نتیجه‌ای موجود باشد) */}
      {results && !error && (
        <div className="mt-6 p-4 rounded-lg text-sm whitespace-pre-wrap bg-green-50 text-green-800 border border-green-200">
          <p className="font-semibold mb-2">پیشنهاد هوشمند برای تو:</p>
          {results}
        </div>
      )}

      {/* نمایش پیام لودینگ اولیه (اگر نیاز بود) */}
      {isPending && !results && !error && (
         <div className="mt-6 p-4 rounded-lg text-sm bg-purple-50 text-purple-700">
            در حال پردازش با هوش مصنوعی...
         </div>
      )}
    </section>
  );
}