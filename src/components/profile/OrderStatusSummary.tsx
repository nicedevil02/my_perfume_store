"use client";

import React from "react";
import Link from "next/link";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const OrderStatusSummary = () => {
  const { data, error, isLoading } = useSWR('/api/orders', fetcher);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-center py-8 text-red-500">خطا در بارگذاری اطلاعات سفارشات.</div>;
  }

  const { counts, recentOrders } = data;

  return (
    <div className="space-y-8">
      {/* خلاصه سفارشات */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">وضعیت سفارش‌ها</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{counts.returned || 0}</div>
            <div className="text-gray-600">مرجوع شده</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{counts.delivered || 0}</div>
            <div className="text-gray-600">تحویل شده</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{counts.current || 0}</div>
            <div className="text-gray-600">جاری</div>
          </div>
        </div>
      </div>
      
      {/* بخش سفارشات اخیر */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">سفارشات اخیر</h2>
          <Link href="/profile/orders" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
            مشاهده همه
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentOrders && recentOrders.length > 0 ? (
            recentOrders.map((order: any) => (
              <div key={order.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">سفارش شماره #{order.id.substring(0, 8)}</h3>
                    <p className="text-sm text-gray-500 mt-1">تاریخ: {new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                    {order.status.toLowerCase()}
                  </span>
                </div>
                {order.orderItems[0] && (
                  <div className="mt-3">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img 
                          src={order.orderItems[0].productImage || "/placeholder.png"} 
                          alt={order.orderItems[0].productName}
                          className="w-14 h-14 object-cover rounded"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{order.orderItems[0].productName}</h4>
                        <p className="text-sm text-gray-500">و {order.orderItems.length - 1} مورد دیگر</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              هیچ سفارش اخیری برای نمایش وجود ندارد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusSummary;
