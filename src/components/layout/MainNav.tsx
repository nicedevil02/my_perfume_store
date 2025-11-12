"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const productMenuItems = [
  {
    title: "مردانه",
    href: "/shop?gender=men",
    description: "مجموعه عطرهای مردانه"
  },
  {
    title: "زنانه",
    href: "/shop?gender=women",
    description: "مجموعه عطرهای زنانه"
  },
  {
    title: "یونیسکس",
    href: "/shop?gender=unisex",
    description: "مجموعه عطرهای یونیسکس"
  },
  {
    title: "مجموعه هدیه",
    href: "/shop?type=gift_set",
    description: "ست‌های هدیه ویژه"
  }
];

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      <button
        className="flex items-center gap-1 py-2 text-gray-700 hover:text-purple-600"
        onMouseEnter={() => setIsOpen(true)}
      >
        محصولات
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-100"
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul className="space-y-2">
            {productMenuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block p-2 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <span className="font-medium block">{item.title}</span>
                  <span className="text-sm text-gray-500">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
