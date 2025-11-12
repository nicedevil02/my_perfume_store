"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Heart, MapPin, Settings, LogOut } from "lucide-react";

const UserSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const userInitial =
    session?.user?.name?.charAt(0)?.toUpperCase() ||
    session?.user?.email?.charAt(0)?.toUpperCase() ||
    "ک";
  const userName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "کاربر";
  const userContact = session?.user?.email || "";
  const userPhone = (session?.user as any)?.phone as string | undefined;

  const menuItems = [
    { icon: Home, title: "داشبورد", href: "/profile" },
    { icon: Package, title: "سفارش‌ها", href: "/profile/orders" },
    { icon: Heart, title: "علاقه‌مندی‌ها", href: "/profile/wishlist" },
    { icon: MapPin, title: "آدرس‌ها", href: "/profile/addresses" },
    { icon: Settings, title: "تنظیمات", href: "/profile/settings" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* هدر کاربر */}
      <div className="p-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border-4 border-white/30">
            {userInitial}
          </div>
          <div>
            <h2 className="font-bold text-lg">{userName}</h2>
            <p className="text-white/80 text-xs">{userContact}</p>
            {userPhone ? (
              <p className="text-white/70 text-xs mt-1">
                شماره تایید شده: {userPhone}
              </p>
            ) : (
              <Link
                href="/profile/settings"
                className="text-white/70 text-xs mt-1 underline underline-offset-4"
              >
                تکمیل اطلاعات تماس
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* منوی سایدبار */}
      <div className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-purple-600"
                }
              />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl w-full text-red-600 hover:bg-red-50 transition-all duration-300 mt-4"
        >
          <LogOut size={20} />
          <span className="font-medium">خروج از حساب</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
