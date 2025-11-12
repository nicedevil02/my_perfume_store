// src/components/aiFinders/MoodPerfumeFinder.tsx
"use client";

import React, { useState } from 'react';
import { MessageSquareText, LoaderCircle, Wand2 } from 'lucide-react'; // آیکون‌ها

// شبیه‌سازی تابع فراخوانی API (بعداً با Server Action یا API Route واقعی جایگزین شود)
async function fetchMoodPerfumeSuggestion(moodDescription: string): Promise<string> {
  // در اینجا باید API واقعی Gemini را فراخوانی کنی
  // این فقط یک شبیه‌سازی با تاخیر است:
  return new Promise(resolve => {
    setTimeout(() => {
      if (!moodDescription.trim()) {
        resolve("لطفاً توصیف حال و هوا یا مناسبت خود را وارد کنید.");
        return;
      }
      resolve(`بر اساس توصیف شما ("${moodDescription}"), پیشنهاد می‌کنیم "عطر رویای شب (برند الهام)" را امتحان کنید. این عطر با نت‌های آرامش‌بخش اسطوخودوس و گرمای وانیل، فضایی دنج و رویایی برای شما ایجاد می‌کند.`);
    }, 2500);
  });
}

export default function MoodPerfumeFinder() {
  const [moodDescription, setMoodDescription] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setResults('در حال پردازش با هوش مصنوعی...');
    const suggestion = await fetchMoodPerfumeSuggestion(moodDescription);
    setResults(suggestion);
    setIsLoading(false);
  };

  return (
    <section id="moodPerfumeFinder" className="bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 p-6 sm:p-8 rounded-xl shadow-lg border border-cyan-200">
      <div className="flex items-center mb-4">
        <Wand2 size={28} className="text-cyan-600 ml-3" />
        <h3 className="text-2xl font-semibold text-cyan-700">الهام‌بخش خرید شما</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        حال و هوای امروزت یا مناسبت خاصی که در پیش داری را توصیف کن تا یک عطر بی‌نظیر به تو پیشنهاد دهیم!
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mood_description" className="block text-sm font-medium text-gray-700 mb-1">
            توصیف حال و هوا یا مناسبت:
          </label>
          <textarea 
            id="mood_description" 
            value={moodDescription}
            onChange={(e) => setMoodDescription(e.target.value)}
            rows={3} 
            placeholder="مثلاً: 'می‌خواهم برای یک مصاحبه کاری مهم، عطری باوقار و حرفه‌ای داشته باشم' یا 'برای یک عصر دل‌انگیز پاییزی کنار شومینه به دنبال یک رایحه گرم و دنج هستم'"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-sm"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <LoaderCircle size={20} className="animate-spin ml-2" />
          ) : (
            <MessageSquareText size={20} className="ml-2" />
          )}
          برایم یک عطر پیشنهاد کن
        </button>
      </form>
      {results && (
        <div className={`mt-6 p-4 rounded-lg text-sm whitespace-pre-wrap ${isLoading ? 'bg-cyan-50 text-cyan-700' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {results}
        </div>
      )}
    </section>
  );
}