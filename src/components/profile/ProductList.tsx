"use client";

import React from "react";
import Link from "next/link";
import useSWR from 'swr';
import ProductCard from "@/components/products/ProductCard"; // فرض بر وجود این کامپوننت

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ProductList = () => {
  const { data: wishlistItems, error, isLoading } = useSWR('/api/wishlist', fetcher);

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">آخرین علاقه‌مندی‌ها</h2>
          <Link href="/profile/wishlist" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
            مشاهده همه
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        )}

        {error && <div className="text-center py-8 text-red-500">خطا در بارگذاری لیست علاقه‌مندی‌ها.</div>}

        {!isLoading && !error && (
          wishlistItems && wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {wishlistItems.slice(0, 2).map((item: any) => {
                const price = item.product.variants[0]?.price
                  ? `${item.product.variants[0].price.toLocaleString('fa-IR')} تومان`
                  : 'ناموجود';
                
                return (
                  <ProductCard
                    key={item.id}
                    name={item.product.name}
                    brand={item.product.brand?.name || ''}
                    price={price}
                    imageUrl={item.product.images[0]?.url || '/placeholder.png'}
                    href={`/product/${item.product.slug}`}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              هیچ آیتمی در لیست علاقه‌مندی‌ها وجود ندارد.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductList;
