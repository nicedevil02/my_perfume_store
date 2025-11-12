"use client";

import { useState } from 'react';
import { Heart, ShoppingCart, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductVariant {
  id: number;
  size: string;
  price: number;
  inStock: boolean;
}

interface Product {
  id: number;
  name: string;
  brand: {
    name: string;
    logo: string;
  };
  description: string;
  variants: ProductVariant[];
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

export default function ProductInfo({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const { addToCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();

  return (
    <div className="flex flex-col space-y-6">
      {/* برند و نام محصول */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center">
          <img src={product.brand.logo} alt={product.brand.name} className="h-8 ml-2" />
          <span className="text-gray-600">{product.brand.name}</span>
        </div>
      </div>

      {/* انتخاب حجم و قیمت */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">انتخاب حجم:</h3>
        <div className="flex flex-wrap gap-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                selectedVariant.id === variant.id
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-200'
              } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!variant.inStock}
            >
              <span className="block text-sm">{variant.size} میلی‌لیتر</span>
              <span className="block font-bold mt-1">
                {new Intl.NumberFormat('fa-IR').format(variant.price)} تومان
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* نت‌های رایحه */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">نت‌های رایحه:</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-700 mb-2">نت اولیه</h4>
            <ul className="space-y-1 text-amber-600">
              {product.notes.top.map(note => <li key={note}>{note}</li>)}
            </ul>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg">
            <h4 className="font-medium text-rose-700 mb-2">نت میانی</h4>
            <ul className="space-y-1 text-rose-600">
              {product.notes.middle.map(note => <li key={note}>{note}</li>)}
            </ul>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-700 mb-2">نت پایه</h4>
            <ul className="space-y-1 text-purple-600">
              {product.notes.base.map(note => <li key={note}>{note}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* توضیحات */}
      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      {/* دکمه‌های اقدام */}
      <div className="flex gap-4 pt-6">
        <button
          onClick={() => addToCart({ ...product, variant: selectedVariant })}
          disabled={!selectedVariant.inStock}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingCart size={20} />
          افزودن به سبد خرید
        </button>
        <button
          onClick={() => addToWishlist(product.id)}
          className="p-3 border border-gray-300 hover:border-purple-300 rounded-xl text-gray-600 hover:text-purple-600 transition-colors"
        >
          <Heart size={20} />
        </button>
      </div>

      {/* وضعیت موجودی */}
      {!selectedVariant.inStock && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle size={20} />
          <span>این حجم از محصول در حال حاضر ناموجود است</span>
        </div>
      )}
    </div>
  );
}
