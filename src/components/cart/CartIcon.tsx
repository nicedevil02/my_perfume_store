"use client";

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function CartIcon() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Link
      href="/cart"
      className="relative text-gray-700 dark:text-gray-300 hover:text-brand-primary transition"
      aria-label="سبد خرید"
    >
      <ShoppingCart size={22} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
