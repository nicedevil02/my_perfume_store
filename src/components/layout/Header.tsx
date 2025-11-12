// src/components/layout/Header.tsx (نسخه اصلاح شده)
"use client";

import Link from 'next/link';
import { Search, User, Heart, ChevronDown, Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
// حذف Modal و هوش مصنوعی داخل Header؛ مودال در ClientLayout مدیریت می‌شود
// import Modal2 from '@/components/ui/Modal2';
// import SmartPerfumeFinder from '@/components/aiFinders/SmartPerfumeFinder';
// import MoodPerfumeFinder from '@/components/aiFinders/MoodPerfumeFinder';
import { useModalStore } from "@/store/useModalStore";
import { useSession, signOut } from "next-auth/react";
import CartIcon from '@/components/cart/CartIcon';

// نوع آیتم منو را تعریف می‌کنیم
type SubMenuItem = { label: string; href: string };
type MenuItem = {
  label: string;
  href: string;
  subItems?: SubMenuItem[];
};

// یک کامپوننت کوچک و بهینه شده برای آیتم‌های منو
const NavItem = ({ item }: { item: MenuItem }) => {
  return (
    <li className="relative group flex items-center h-full py-3">
      <Link
        href={item.href}
        className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors flex items-center select-none"
      >
        <span>{item.label}</span>
        {item.subItems && (
          <ChevronDown 
            size={16} 
            className="mr-1 opacity-70 group-hover:rotate-180 transition-transform duration-200" 
          />
        )}
      </Link>
      {/* کانتینر زیرمنو */}
      {item.subItems && (
        <div 
          className="absolute right-0 top-full pt-2 min-w-[180px]
                     opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                     transform group-hover:translate-y-0 translate-y-1
                     transition-all duration-200 ease-out 
                     pointer-events-none group-hover:pointer-events-auto"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700">
            <ul className="p-2 space-y-1">
              {item.subItems.map((sub: SubMenuItem) => (
                <li key={sub.label}>
                  <Link 
                    href={sub.href} 
                    className="block text-right px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white rounded-md transition-colors"
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};


export default function Header() {
  const cartItemCount = 0;
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openAiFinderModal } = useModalStore();
  const { data: session, status } = useSession();

  const mainMenuItems = [
    { label: 'خانه', href: '/' },
    { 
      label: 'محصولات', 
      href: '/shop', 
      subItems: [
        { label: 'مردانه', href: '/shop/men' },
        { label: 'زنانه', href: '/shop/women' },
        { label: 'یونی‌سکس', href: '/shop/unisex' },
        { label: 'مجموعه هدیه', href: '/shop/gift-sets' },
      ] 
    },
    { label: 'برندها', href: '/brands' },
    { label: 'پرفروش‌ترین‌ها', href: '/bestsellers' },
    { 
      label: 'پیشنهاد ویژه', 
      href: '/special-offers',
      subItems: [
        { label: 'حراج پایان فصل', href: '/special-offers/sale' },
        { label: 'مناسبت‌ها و وفاداری', href: '/special-offers/loyalty' },
      ]
    },
    { 
      label: 'درباره و تماس با ما', 
      href: '/about-contact',
      subItems: [
        { label: 'فرم تماس', href: '/about-contact#contact-form' },
        { label: 'اطلاعات تماس و آدرس', href: '/about-contact#info' },
        { label: 'داستان و چشم‌انداز', href: '/about-contact#story' },
        { label: 'تیم ما', href: '/about-contact#team' },
      ]
    },
    { 
      label: 'وبلاگ', 
      href: '/blog',
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > lastScrollY.current && currentY > 80) {
            setShowMainMenu(false); // اسکرول به پایین
          } else {
            setShowMainMenu(true); // اسکرول به بالا
          }
          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* دسکتاپ هدر */}
      <header className="sticky top-0 z-50 hidden sm:block">
        {/* نوار بالایی هدر */}
        <div className="relative z-[60] backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow-md border-b border-white/30 dark:border-gray-800/30 transition-colors duration-200 py-2 px-2 sm:py-3 sm:px-4 lg:px-8">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
              <div className="flex-shrink-0 flex items-center justify-between w-full sm:w-auto">
                <Link href="/" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-primary" style={{ fontFamily: 'var(--font-inter), Arial, sans-serif' }}>AQS</Link>
                <p className="hidden sm:block text-xs text-gray-500 ml-2" style={{ fontFamily: 'var(--font-inter), Arial, sans-serif' }}>BY BAHMAN</p>
              </div>
              <div className="w-full sm:flex-grow sm:max-w-xl mx-0 sm:mx-4 mt-2 sm:mt-0">
                <div className="relative">
                  <input type="search" placeholder="جستجوی عطر، برند، یا نت..." className="w-full bg-white/40 dark:bg-gray-800/40 backdrop-blur rounded-xl py-2 pr-10 pl-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white/70 dark:focus:bg-gray-900/70 text-sm border border-gray-200 dark:border-gray-700 transition" style={{ fontFamily: 'var(--font-inter), Arial, sans-serif' }} />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-500" /></div>
                </div>
              </div>
              <div className="flex items-center justify-end w-full sm:w-auto mt-2 sm:mt-0 space-x-reverse space-x-3">
                <Link href="/profile/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-brand-primary transition" aria-label="لیست علاقه‌مندی‌ها">
                  <Heart size={20} className="sm:size-[22px]" />
                </Link>
                <Link href="/cart" className="relative text-gray-700 dark:text-gray-300 hover:text-brand-primary transition" aria-label="سبد خرید">
                  <CartIcon />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* نمایش پویا بر اساس وضعیت سشن */}
                {status === "loading" && (
                  <div className="w-28 h-9 rounded-lg bg-gray-200 animate-pulse" />
                )}

                {status === "unauthenticated" && (
                  <Link
                    href="/auth/login"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-brand-primary transition"
                    aria-label="ورود یا ثبت نام"
                  >
                    <User size={20} className="ml-1 sm:size-[22px]" />
                    <span className="hidden sm:inline text-sm">ورود / ثبت‌نام</span>
                  </Link>
                )}

                {status === "authenticated" && (
                  <div className="relative z-[70]" ref={dropdownRef}>
                    <button
                      onClick={() => setIsMenuOpen((p) => !p)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="منوی کاربر"
                    >
                      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        {session.user?.name?.charAt(0)?.toUpperCase() || session.user?.email?.charAt(0)?.toUpperCase() || <User size={18} />}
                      </div>
                      <span className="hidden md:block text-sm font-medium text-gray-800 dark:text-gray-200">
                        {session.user?.name || "حساب کاربری"}
                      </span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute left-0 mt-2 w-48 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg z-[80]">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          پروفایل
                        </Link>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          خروج
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        {/* منوی اصلی - زیر نوار بالایی */}
        <nav className={`relative z-[50] backdrop-blur-md bg-white/50 dark:bg-gray-900/50 shadow-lg border-b border-white/20 dark:border-gray-800/20 transition-colors duration-200 transition-transform ease-in-out ${showMainMenu ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-10 opacity-0 pointer-events-none"}`} style={{ willChange: "transform, opacity" }}>
          <div className="container mx-auto px-2 sm:px-4 lg:px-8">
            <ul className="flex items-center justify-center space-x-reverse space-x-4">
              {mainMenuItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
              {/* دکمه کشف عطر شما */}
              <li className="flex items-center h-full py-3">
                <button
                  onClick={openAiFinderModal}
                  className="text-sm font-semibold py-1.5 px-3 rounded-lg flex items-center text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                >
                  <span className="ml-1.5">✨</span>
                  کشف عطر شما
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* موبایل هدر */}
      <header className="fixed top-0 left-0 right-0 z-[100] block sm:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
        <div className="flex items-center justify-between px-4 py-2">
          {/* منوی همبرگری - سمت راست */}
          <button
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="باز کردن منوی موبایل"
          >
            <MenuIcon size={24} />
          </button>

          {/* لوگو - وسط */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-brand-primary">
            AQS
          </Link>

          {/* آیکون‌ها - سمت چپ */}
          <div className="flex items-center space-x-reverse space-x-3">
            <Link href="/profile/wishlist" className="text-gray-700 dark:text-gray-300" aria-label="لیست علاقه‌مندی‌ها">
              <Heart size={20} />
            </Link>
            <Link href="/cart" className="relative text-gray-700 dark:text-gray-300" aria-label="سبد خرید">
              <CartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* وضعیت احراز هویت در موبایل */}
            {status !== "authenticated" ? (
              <Link href="/auth/login" className="text-gray-700 dark:text-gray-300" aria-label="ورود یا ثبت نام">
                <User size={20} />
              </Link>
            ) : (
              <button onClick={() => setIsMenuOpen((p) => !p)} className="text-gray-700 dark:text-gray-300" aria-label="منوی کاربر">
                <User size={20} />
              </button>
            )}
          </div>
        </div>

        {/* نوار جستجو */}
        <div className="px-4 pb-2">
          <div className="relative">
            <input
              type="search"
              placeholder="جستجوی عطر، برند، یا نت..."
              className="w-full bg-white/40 dark:bg-gray-800/40 backdrop-blur rounded-lg py-2 pr-9 pl-3 text-sm border border-gray-200 dark:border-gray-700"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* منوی کشویی موبایل */}
        <div className={`fixed inset-0 z-[110] flex h-[100dvh] transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className={`relative w-4/5 max-w-xs h-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
              <span className="text-lg font-bold text-brand-primary">منو</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <CloseIcon size={24} />
              </button>
            </div>
            <nav className="divide-y divide-gray-100 dark:divide-gray-800">
              {mainMenuItems.map((item) => (
                <div key={item.label} className="py-2">
                  <div className="flex items-center justify-between px-4">
                    <Link
                      href={item.href}
                      className="flex-grow py-2 text-gray-800 dark:text-gray-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.subItems && (
                      <button
                        onClick={() => setMobileSubMenu(mobileSubMenu === item.label ? null : item.label)}
                        className="p-2"
                      >
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${mobileSubMenu === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>
                  {item.subItems && mobileSubMenu === item.label && (
                    <ul className="bg-gray-50 dark:bg-gray-800/50 mt-1">
                      {item.subItems.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            href={sub.href}
                            className="block px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              
              {/* کشف عطر در منوی موبایل */}
              <div className="p-4">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAiFinderModal(); }}
                  className="flex items-center w-full py-2 px-4 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors font-medium"
                >
                  <span className="ml-2">✨</span>
                  کشف عطر شما
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
