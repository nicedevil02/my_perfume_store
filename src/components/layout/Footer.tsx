// src/components/layout/Footer.tsx
import Link from 'next/link';
import React from 'react';
import { Mail, Phone, MapPin, Twitter, Instagram, Send } from 'lucide-react'; // آیکون‌ها

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* ستون اول: درباره ما و لوگو */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-extrabold text-white">AQS</Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              فروشگاه عطر AQS، مقصدی برای کشف رایحه‌های خاص و لوکس. ما به ارائه عطرهای اصیل و تجربه‌ای بی‌نظیر برای شما متعهد هستیم.
            </p>
            <div className="flex space-x-reverse space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Telegram">
                <Send size={20} />
              </a>
            </div>
          </div>

          {/* ستون دوم: لینک‌های سریع */}
          <div>
            <h3 className="text-md font-semibold text-white tracking-wider uppercase mb-4">لینک‌های سریع</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">فروشگاه</Link></li>
              <li><Link href="/bestsellers" className="text-sm text-gray-400 hover:text-white transition-colors">پرفروش‌ترین‌ها</Link></li>
              <li><Link href="/brands" className="text-sm text-gray-400 hover:text-white transition-colors">برندها</Link></li>
              <li><Link href="/special-offers" className="text-sm text-gray-400 hover:text-white transition-colors">پیشنهادات ویژه</Link></li>
            </ul>
          </div>

          {/* ستون سوم: پشتیبانی */}
          <div>
            <h3 className="text-md font-semibold text-white tracking-wider uppercase mb-4">پشتیبانی</h3>
            <ul className="space-y-3">
              <li><Link href="/contact-us" className="text-sm text-gray-400 hover:text-white transition-colors">تماس با ما</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">سوالات متداول</Link></li>
              <li><Link href="/shipping-returns" className="text-sm text-gray-400 hover:text-white transition-colors">رویه ارسال و بازگشت</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">حریم خصوصی</Link></li>
            </ul>
          </div>

          {/* ستون چهارم: خبرنامه */}
          <div>
            <h3 className="text-md font-semibold text-white tracking-wider uppercase mb-4">عضویت در خبرنامه</h3>
            <p className="text-sm text-gray-400 mb-4">از آخرین تخفیف‌ها و جدیدترین محصولات ما با خبر شو.</p>
            <form className="flex items-center">
              <input 
                type="email" 
                placeholder="ایمیل شما..."
                className="w-full bg-gray-800 text-white placeholder-gray-500 px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-500 border-none text-sm"
              />
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-l-md transition-colors" aria-label="عضویت">
                <Send size={20} />
              </button>
            </form>
          </div>

        </div>

        {/* بخش پایینی فوتر */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} فروشگاه عطر AQS. تمام حقوق محفوظ است.</p>
          <div className="mt-4">
             {/* اینجا می‌توانی نمادهای اعتماد مثل اینماد را قرار دهی */}
             {/* <Image src="/path/to/enamad.png" alt="نماد اعتماد الکترونیکی" width={80} height={80} /> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;