"use client";

import useSWR from 'swr';
import ProductCard from '@/components/products/ProductCard';
import { Loader2, HeartCrack } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function WishlistPage() {
  const { data: wishlistItems, error, isLoading } = useSWR('/api/wishlist', fetcher);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لیست علاقه‌مندی‌ها</h1>
      
      <div className="min-h-[300px]">
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}
        {error && <div className="text-center py-16 text-red-500">خطا در بارگذاری لیست علاقه‌مندی‌ها.</div>}
        {!isLoading && !error && (
          wishlistItems && wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {wishlistItems.map((item: any) => (
                <ProductCard
                  key={item.id}
                  name={item.product.name}
                  brand={item.product.brand?.name || ''}
                  price={`${item.product.variants[0]?.price.toLocaleString('fa-IR')} تومان`}
                  imageUrl={item.product.images[0]?.url || '/placeholder.png'}
                  href={`/product/${item.product.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <HeartCrack size={64} strokeWidth={1.5} className="text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600">لیست علاقه‌مندی‌های شما خالی است</p>
              <p className="text-sm text-gray-500 mt-1">محصولات مورد علاقه خود را برای دسترسی آسان‌تر به اینجا اضافه کنید.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
