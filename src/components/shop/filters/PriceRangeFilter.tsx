"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
}

export default function PriceRangeFilter({ minPrice = 0, maxPrice = 10000000 }: PriceRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [min, setMin] = useState(searchParams?.get('minPrice') || '');
  const [max, setMax] = useState(searchParams?.get('maxPrice') || '');

  const handleChange = (value: string, type: 'min' | 'max') => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (type === 'min') {
      setMin(value);
      value ? params.set('minPrice', value) : params.delete('minPrice');
    } else {
      setMax(value);
      value ? params.set('maxPrice', value) : params.delete('maxPrice');
    }

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">محدوده قیمت</h3>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            value={min}
            onChange={(e) => handleChange(e.target.value, 'min')}
            placeholder="از"
            className="w-full p-2 text-sm border rounded-lg"
          />
        </div>
        <div className="relative flex-1">
          <input
            type="number"
            value={max}
            onChange={(e) => handleChange(e.target.value, 'max')}
            placeholder="تا"
            className="w-full p-2 text-sm border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
