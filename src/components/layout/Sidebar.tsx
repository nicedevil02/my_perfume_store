import React from "react";
import Link from "next/link";

const Sidebar = () => (
  <aside className="w-64 bg-gray-100 p-4 rounded shadow">
    <nav className="flex flex-col gap-4">
      <Link href="/" className="hover:text-brand-primary">داشبورد</Link>
      <Link href="/orders" className="hover:text-brand-primary">سفارش‌ها</Link>
      <Link href="/profile" className="hover:text-brand-primary">پروفایل</Link>
      <Link href="/settings" className="hover:text-brand-primary">تنظیمات</Link>
    </nav>
  </aside>
);

export default Sidebar;
