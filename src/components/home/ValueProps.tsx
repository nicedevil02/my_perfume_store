"use client";

import React from 'react';
import { ShieldCheck, Truck, MessagesSquare, ArrowLeftSquare } from 'lucide-react';
import { useInView } from '@/lib/hooks/useInView';

// داده‌های مربوط به هر کارت
const propositions = [
  {
    icon: ShieldCheck,
    title: 'تضمین اصالت کالا',
    description: 'تمام محصولات ۱۰۰٪ اصل و با ضمانت کامل ارائه می‌شوند تا با خیال راحت خرید کنی.',
  },
  {
    icon: Truck,
    title: 'ارسال سریع و مطمئن',
    description: 'سفارش تو در کوتاه‌ترین زمان ممکن و با بسته‌بندی ایمن به سراسر کشور ارسال می‌شود.',
  },
  {
    icon: MessagesSquare,
    title: 'مشاوره تخصصی رایگان',
    description: 'کارشناسان ما آماده‌اند تا برای انتخاب بهترین عطر، به صورت رایگان به تو مشاوره دهند.',
  },
  {
    icon: ArrowLeftSquare,
    title: 'ضمانت بازگشت کالا',
    description: 'تا ۷ روز پس از خرید، امکان بازگشت محصول طبق قوانین سایت برایت فراهم است.',
  },
];

const ValueProps = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section 
      ref={ref}
      id="value-propositions" 
      className="py-20 lg:py-28 relative"
    >
      {/* کمی تیره‌تر کردن پس‌زمینه برای خوانایی بهتر */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      <div className={`container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            چرا خرید از فروشگاه ما؟
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            ما به ارائه بهترین تجربه خرید برای تو متعهد هستیم.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {propositions.map((prop, index) => (
            <div 
              key={prop.title} 
              className="group bg-white/20 backdrop-blur-sm p-8 rounded-2xl text-center 
                border border-white/30 hover:border-purple-300/50 
                hover:bg-white/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
                transition-all duration-500 hover:-translate-y-2"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`
              }}
            >
              <div className="flex justify-center mb-6">
                <div className="relative bg-white/40 text-purple-700 p-4 rounded-xl 
                  transform rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500
                  before:absolute before:inset-0 before:rounded-xl before:bg-purple-500/5 before:opacity-0 
                  group-hover:before:opacity-100 before:transition-opacity">
                  <prop.icon size={32} strokeWidth={1.5} className="relative z-10 group-hover:text-purple-800" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-800">
                {prop.title}
              </h3>
              <p className="text-base text-gray-700 leading-relaxed group-hover:text-gray-900">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;