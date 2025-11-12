"use client";

import { useSession } from "next-auth/react";
import { Award, TrendingUp, Package, Heart, MapPin, Settings, ChevronRight, ShieldCheck, CircleAlert } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import type { ReactNode } from "react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

// کامپوننت نمودار دایره‌ای پیشرفت
function ProgressRing({ progress, size = 120 }: { progress: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{progress}%</span>
        <span className="text-xs text-gray-500">تکمیل</span>
      </div>
    </div>
  );
}

// کامپوننت آمار
function StatCard({ icon: Icon, label, value, color, href }: any) {
  return (
    <Link href={href} className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </Link>
  );
}

// کامپوننت Quick Action
function QuickAction({ icon: Icon, label, href, color }: any) {
  return (
    <Link href={href} className="group flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
      <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300 mb-2`}>
        <Icon className="text-white" size={20} />
      </div>
      <span className="text-xs text-gray-700 font-medium text-center">{label}</span>
    </Link>
  );
}

function InsightCard({ icon, title, description, completed }: { icon: ReactNode; title: string; description: string; completed: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${completed ? "bg-emerald-50/70 border-emerald-200" : "bg-white/80 border-gray-100 hover:border-purple-200 hover:shadow-md"}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${completed ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500 mt-1 leading-6">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data: ordersData } = useSWR('/api/orders', fetcher);
  const { data: wishlistData } = useSWR('/api/wishlist', fetcher);
  
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "کاربر";
  const userEmail = session?.user?.email || "";
  
  const orderCounts = {
    current: ordersData?.counts?.current ?? 0,
    delivered: ordersData?.counts?.delivered ?? 0,
    returned: ordersData?.counts?.returned ?? 0,
  };
  const wishlistCount = wishlistData?.length ?? 0;
  const hasOrders = orderCounts.current + orderCounts.delivered + orderCounts.returned > 0;
  const hasWishlist = wishlistCount > 0;
  const hasPhone = Boolean((session?.user as any)?.phone);
  const profileProgress = Math.min(
    100,
    [
      session?.user?.name ? 25 : 0,
      session?.user?.email ? 25 : 0,
      hasPhone ? 25 : 0,
      hasOrders || hasWishlist ? 25 : 0,
    ].reduce((sum, value) => sum + value, 0)
  );
  const insights = [
    {
      title: "تکمیل اطلاعات حساب",
      description: session?.user?.name
        ? "نام شما ثبت شده است."
        : "با وارد کردن نام کامل در تنظیمات، پروفایلتان کامل‌تر می‌شود.",
      completed: Boolean(session?.user?.name),
      icon: (session?.user?.name ? <ShieldCheck size={18} /> : <CircleAlert size={18} />),
    },
    {
      title: "تایید شماره موبایل",
      description: hasPhone
        ? `شماره تایید شده: ${(session?.user as any)?.phone}`
        : "با تایید شماره موبایل، امنیت حساب افزایش می‌یابد.",
      completed: hasPhone,
      icon: (hasPhone ? <ShieldCheck size={18} /> : <CircleAlert size={18} />),
    },
    {
      title: "افزودن علاقه‌مندی",
      description: hasWishlist
        ? "محصولات محبوب خود را ذخیره کرده‌اید."
        : "برای دسترسی سریع، محصولات دلخواه را به علاقه‌مندی‌ها اضافه کنید.",
      completed: hasWishlist,
      icon: (hasWishlist ? <ShieldCheck size={18} /> : <CircleAlert size={18} />),
    },
    {
      title: "ثبت سفارش",
      description: hasOrders
        ? "سفارشات شما در یک نگاه در دسترس است."
        : "اولین سفارش خود را ثبت کنید تا تجربه کاربری کامل‌تر شود.",
      completed: hasOrders,
      icon: (hasOrders ? <ShieldCheck size={18} /> : <CircleAlert size={18} />),
    },
  ];

  const profileProgressText = profileProgress === 100 ? "پروفایل شما کامل است، از مزایای ویژه لذت ببرید." : "با تکمیل اطلاعات، تجربه شخصی‌سازی‌شده‌تری دریافت کنید.";

  return (
    <div className="space-y-6">
      {/* هدر پروفایل با Progress Ring */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold border-4 border-white/30">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">سلام، {userName}! 👋</h1>
              <p className="text-white/80 text-sm">{userEmail}</p>
              <p className="text-white/70 text-xs sm:text-sm mt-2">{profileProgressText}</p>
            </div>
          </div>
          <div className="animate-fade-in-up">
            <ProgressRing progress={profileProgress} size={140} />
          </div>
        </div>
      </div>

      {/* آمار سریع */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="سفارشات"
          value={orderCounts.current}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          href="/profile/orders"
        />
        <StatCard
          icon={TrendingUp}
          label="تحویل شده"
          value={orderCounts.delivered}
          color="bg-gradient-to-br from-green-500 to-green-600"
          href="/profile/orders?status=delivered"
        />
        <StatCard
          icon={Heart}
          label="علاقه‌مندی‌ها"
          value={wishlistCount}
          color="bg-gradient-to-br from-pink-500 to-rose-600"
          href="/profile/wishlist"
        />
        <StatCard
          icon={MapPin}
          label="آدرس‌ها"
          value={0}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          href="/profile/addresses"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-purple-600" />
          دسترسی سریع
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAction icon={Package} label="سفارش جدید" href="/shop" color="bg-gradient-to-br from-blue-500 to-blue-600" />
          <QuickAction icon={Heart} label="علاقه‌مندی‌ها" href="/profile/wishlist" color="bg-gradient-to-br from-pink-500 to-rose-600" />
          <QuickAction icon={MapPin} label="آدرس‌ها" href="/profile/addresses" color="bg-gradient-to-br from-green-500 to-green-600" />
          <QuickAction icon={Settings} label="تنظیمات" href="/profile/settings" color="bg-gradient-to-br from-purple-500 to-purple-600" />
        </div>
      </div>

      {/* مسیر تکمیل پروفایل */}
      {insights && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-md">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-500" />
            مسیر تکمیل پروفایل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((item) => (
              <InsightCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                completed={item.completed}
              />
            ))}
          </div>
        </div>
      )}

      {/* سفارشات اخیر */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package size={20} className="text-purple-600" />
            آخرین سفارشات
          </h2>
          <Link href="/profile/orders" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 group">
            مشاهده همه
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {ordersData?.recentOrders?.length > 0 ? (
          <div className="space-y-4">
            {ordersData.recentOrders.slice(0, 3).map((order: any) => (
              <div key={order.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">سفارش #{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">هنوز سفارشی ندارید</p>
            <Link href="/shop" className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              شروع خرید
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}