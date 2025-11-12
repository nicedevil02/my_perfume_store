// لیست سفارشات کاربر
"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { Search, PackageSearch, Clock, CheckCircle, RefreshCw, XCircle, Loader2 } from 'lucide-react';

type TabKey = 'current' | 'delivered' | 'returned' | 'canceled';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'current', label: 'جاری', icon: <Clock className="w-4 h-4 ml-1" /> },
  { key: 'delivered', label: 'تحویل شده', icon: <CheckCircle className="w-4 h-4 ml-1" /> },
  { key: 'returned', label: 'مرجوع شده', icon: <RefreshCw className="w-4 h-4 ml-1" /> },
  { key: 'canceled', label: 'لغو شده', icon: <XCircle className="w-4 h-4 ml-1" /> },
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('current');
  const { data: orders, error, isLoading } = useSWR(`/api/profile/orders?status=${activeTab}`, fetcher);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* هدر */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">تاریخچه سفارشات</h1>
        <div className="text-gray-500 cursor-pointer p-2 rounded-full hover:bg-gray-100">
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* تب‌ها */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-3 flex items-center font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* محتوای صفحه */}
      <div className="min-h-[300px]">
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}
        {error && <div className="text-center py-16 text-red-500">خطا در بارگذاری سفارشات.</div>}
        {!isLoading && !error && (
          orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">سفارش #{order.id.substring(0, 8)}</h3>
                      <p className="text-sm text-gray-500 mt-1">تاریخ: {new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                      {order.status.toLowerCase()}
                    </span>
                  </div>
                  <div className="mt-4 border-t pt-4">
                    {order.orderItems.map((item: any) => (
                       <div key={item.id} className="flex items-center gap-4">
                         <img src={item.productImage || '/placeholder.png'} alt={item.productName} className="w-16 h-16 rounded-md object-cover" />
                         <div>
                           <p className="font-medium">{item.productName}</p>
                           <p className="text-sm text-gray-500">تعداد: {item.quantity}</p>
                         </div>
                       </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PackageSearch size={64} strokeWidth={1.5} className="text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600">هیچ سفارشی یافت نشد</p>
              <p className="text-sm text-gray-500 mt-1">شما هنوز هیچ سفارشی در وضعیت «{TABS.find(t => t.key === activeTab)?.label}» ندارید.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}