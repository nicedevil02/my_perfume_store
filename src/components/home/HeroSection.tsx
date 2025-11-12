"use client";

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm mb-6">
          <Sparkles size={16} />
          <span>فروشگاه تخصصی عطر اورجینال</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          دنیای عطر را
          <br />
          کشف کنید
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          مجموعه کامل از بهترین برندهای عطر دنیا، با تضمین اصالت و کیفیت
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/shop"
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition shadow-2xl"
          >
            مشاهده محصولات
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white rounded-full font-bold hover:bg-white/30 transition"
          >
            کشف عطرهای جدید
          </Link>
        </div>
      </div>
    </section>
  );
}