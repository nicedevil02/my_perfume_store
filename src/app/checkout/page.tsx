"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/checkout");
    }

    if (items.length === 0 && status === "authenticated") {
      router.replace("/cart");
    }
  }, [status, items, router]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // در اینجا باید API پرداخت را صدا بزنیم
      // فعلاً یک placeholder می‌گذاریم

      alert("سیستم پرداخت به زودی فعال می‌شود!");
      
      // clearCart();
      // router.push('/profile/orders');
    } catch (err: any) {
      setError(err.message || "خطا در فرآیند پرداخت");
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">تکمیل خرید</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              اطلاعات ارسال
            </h2>
            
            <p className="text-gray-600 mb-6">
              لطفاً از بخش پروفایل، آدرس خود را تکمیل کنید.
            </p>

            <button
              onClick={() => router.push('/profile/addresses')}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              مدیریت آدرس‌ها
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-white rounded-xl border border-gray-100 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              خلاصه سفارش
            </h3>

            <div className="space-y-3 pb-4 border-b border-gray-200">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.productName} ({item.quantity}×)
                  </span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString('fa-IR')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center py-4 text-lg font-bold">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-purple-600">
                {getTotal().toLocaleString('fa-IR')} تومان
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
              {isProcessing ? "در حال پردازش..." : "پرداخت"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
