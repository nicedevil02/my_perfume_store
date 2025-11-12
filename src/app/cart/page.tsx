"use client";

import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          سبد خرید شما خالی است
        </h2>
        <p className="text-gray-600 mb-8">
          محصولات مورد علاقه خود را به سبد اضافه کنید
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">سبد خرید</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* لیست محصولات */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-grow">
                <Link
                  href={`/product/${item.productSlug}`}
                  className="text-lg font-semibold text-gray-800 hover:text-purple-600"
                >
                  {item.productName}
                </Link>
                <p className="text-sm text-gray-500">{item.brandName}</p>
                <p className="text-sm text-gray-600 mt-1">حجم: {item.size}ml</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="text-left">
                <p className="text-lg font-bold text-gray-900">
                  {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                </p>
                <p className="text-xs text-gray-500">
                  {item.price.toLocaleString('fa-IR')} × {item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.variantId)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* خلاصه سبد */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-white rounded-xl border border-gray-100 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              خلاصه سبد خرید
            </h3>

            <div className="space-y-3 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>جمع کل ({items.length} محصول)</span>
                <span>{getTotal().toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>هزینه ارسال</span>
                <span className="text-green-600">رایگان</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 text-lg font-bold">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-purple-600">
                {getTotal().toLocaleString('fa-IR')} تومان
              </span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              ادامه فرآیند خرید
            </button>

            <Link
              href="/shop"
              className="block text-center mt-4 text-purple-600 hover:underline"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
