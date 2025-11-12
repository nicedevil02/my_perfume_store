"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams?.get('sort') || 'newest';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('sort', value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="px-4 py-2 border rounded-lg text-sm"
    >
      <option value="newest">جدیدترین</option>
      <option value="price-asc">قیمت: کم به زیاد</option>
      <option value="price-desc">قیمت: زیاد به کم</option>
      <option value="popular">محبوب‌ترین</option>
    </select>
  );
}
