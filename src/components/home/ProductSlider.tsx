// src/components/home/ProductSlider.tsx
"use client"; // اسلایدرها نیاز به جاوااسکریپت در کلاینت دارند

import React from 'react';
// وارد کردن کامپوننت‌ها و استایل‌های Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useInView } from '@/lib/hooks/useInView';
import ProductCard from '@/components/products/ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// داده‌های نمونه برای محصولات (بعداً از API خوانده می‌شود)
const sampleProducts = [
  { name: 'عطر دل‌انگیز بهاری', brand: 'برند A', price: '۱,۲۰۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/400x400/a0c4ff/333333?text=عطر+۱&font=sina', href: '/product/delangiz-bahari' },
  { name: 'عطر مرموز شبانه', brand: 'برند B', price: '۲,۵۰۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/400x400/bdb2ff/333333?text=عطر+۲&font=sina', href: '/product/marmouz-shabane' },
  { name: 'عطر کلاسیک مردانه', brand: 'برند C', price: '۱,۸۵۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/400x400/ffc6ff/333333?text=عطر+۳&font=sina', href: '/product/classic-mardane' },
  { name: 'عطر مدرن یونیسکس', brand: 'برند D', price: '۳,۱۰۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/400x400/fffffc/333333?text=عطر+۴&font=sina', href: '/product/modern-unisex' },
  { name: 'رایحه اقیانوس', brand: 'برند E', price: '۱,۴۰۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/400x400/c7f9cc/22577a?text=عطر+۵&font=sina', href: '/product/rayehe-oghyanoos' },
  { name: 'عطر شرقی تند', brand: 'برند F', price: '۲,۹۰۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/400x400/ffadad/a4133c?text=عطر+۶&font=sina', href: '/product/sharghi-tond' },
];

const ProductSlider = ({ title, subtitle }: { title: string, subtitle: string }) => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);
  
  return (
    <section 
      ref={ref}
      id="product-slider" 
      className="py-20 lg:py-28 bg-transparent-50"
    >
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center sm:text-right">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">{title}</h2>
            <p className="mt-2 text-md lg:text-lg text-gray-600">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-reverse space-x-3">
            <button 
              ref={navigationPrevRef} 
              className="p-2.5 rounded-xl bg-transparent shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" 
              aria-label="اسلاید قبلی"
            >
              <ArrowRight size={24} className="text-gray-700" />
            </button>
            <button 
              ref={navigationNextRef} 
              className="p-2.5 rounded-xl bg-transparent shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" 
              aria-label="اسلاید بعدی"
            >
              <ArrowLeft size={24} className="text-transparent-700" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1.2}
          pagination={{ 
            clickable: true,
            bulletActiveClass: 'bg-purple-600 !w-6 transition-all duration-300',
            bulletClass: 'inline-block w-2 h-2 rounded-full bg-transparent-300 mx-1 transition-all duration-300'
          }}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = navigationNextRef.current;
          }}
          breakpoints={{
            480: { slidesPerView: 1.5, spaceBetween: 20 },
            640: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="pb-12"
        >
          {sampleProducts.map((product, index) => (
            <SwiperSlide 
              key={product.name} 
              className="h-auto"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`
              }}
            >
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductSlider;