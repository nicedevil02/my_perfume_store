"use client";

import { Filter } from 'lucide-react';
import Link from 'next/link';
import PriceRangeFilter from './filters/PriceRangeFilter';
import BrandFilter from './filters/BrandFilter';
import GenderFilter from './filters/GenderFilter';
import ScentFilter from './filters/ScentFilter';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  selectedBrands?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  selectedGender?: string;
  selectedScents?: string[];
  activeCategorySlug?: string;
}

export default function FilterSidebar({
  categories,
  brands,
  selectedBrands,
  minPrice,
  maxPrice,
  selectedGender,
  selectedScents = [],
  activeCategorySlug,
}: FilterSidebarProps) {
  return (
    <aside className="w-full lg:w-1/4 xl:w-1/5">
      <div className="sticky top-32 p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Filter size={20} className="ml-2 text-purple-600" />
          فیلترها
        </h2>

        <div className="space-y-6 divide-y divide-gray-100">
          {/* فیلتر دسته‌بندی */}
          <div className="pb-6">
            <h3 className="font-medium mb-3">دسته‌بندی</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className={`block text-sm hover:text-purple-600 transition-colors ${
                    activeCategorySlug === category.slug ? 'text-purple-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* فیلتر برند */}
          <div className="pt-6 pb-6">
            <h3 className="font-medium mb-3">برند</h3>
            <div className="space-y-2">
              <BrandFilter brands={brands} selectedBrands={selectedBrands} />
            </div>
          </div>

          {/* فیلتر قیمت */}
          <div className="pt-6">
            <PriceRangeFilter minPrice={Number(minPrice)} maxPrice={Number(maxPrice)} />
          </div>

          {/* فیلتر جنسیت */}
          <div className="pt-6">
            <GenderFilter selectedGender={selectedGender} />
            <ScentFilter selectedScents={selectedScents} />
          </div>
        </div>
      </div>
    </aside>
  );
}
