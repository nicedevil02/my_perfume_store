"use client";

import Link from 'next/link';

const categories = [
  { name: 'عطرهای مردانه', slug: 'men', icon: '👔', color: 'from-blue-500 to-blue-600' },
  { name: 'عطرهای زنانه', slug: 'women', icon: '👗', color: 'from-pink-500 to-pink-600' },
  { name: 'یونیسکس', slug: 'unisex', icon: '✨', color: 'from-purple-500 to-purple-600' },
  { name: 'ست هدیه', slug: 'gift-sets', icon: '🎁', color: 'from-green-500 to-green-600' },
];

export default function PopularCategories() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          دسته‌بندی‌های محبوب
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-square"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} transition-transform duration-300 group-hover:scale-110`} />
              <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}