// src/app/page.tsx
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import PopularCategories from '@/components/home/PopularCategories';
import TopBrands from '@/components/home/TopBrands';
import ProductSlider from '@/components/home/ProductSlider';

export const metadata = {
  title: 'فروشگاه عطر من',
  description: 'بهترین عطرها و ادکلن‌ها را اینجا پیدا کن'
};

export default function HomePage() {
  return (
    <main className="overflow-x-hidden mt-[100px] sm:mt-0"> {/* اضافه کردن مارجین برای جبران ارتفاع هدر موبایل */}
      {/* === بخش ۱: Hero === */}
      <HeroSection />

      {/* === بخش ۲: دسته‌بندی‌های محبوب (Placeholder) === */}
      <PopularCategories />
        
        {/* === بخش ۳: اسلایدر محصولات محبوب === */}
        <ProductSlider 
        title="جدیدترین محصولات"
        subtitle="تازه‌ترین رایحه‌هایی که به مجموعه ما اضافه شده‌اند"
      />
        
        {/* === بخش ۵: برندهای برتر === */}
        <TopBrands />
    </main>
  );
}