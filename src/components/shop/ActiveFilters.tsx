"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

export default function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const brands = searchParams?.getAll('brand') || [];
  const gender = searchParams?.get('gender');
  const scents = searchParams?.get('scent')?.split(',') || [];
  const minPrice = searchParams?.get('minPrice');
  const maxPrice = searchParams?.get('maxPrice');

  const removeFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (value && key === 'brand') {
      params.delete('brand');
      brands.forEach(b => {
        if (b !== value) params.append('brand', b);
      });
    } else if (value && key === 'scent') {
      const filtered = scents.filter(s => s !== value);
      params.delete('scent');
      if (filtered.length > 0) params.set('scent', filtered.join(','));
    } else {
      params.delete(key);
    }
    
    router.push(`/shop?${params.toString()}`);
  };

  const hasFilters = brands.length > 0 || gender || scents.length > 0 || minPrice || maxPrice;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {brands.map(brand => (
        <button
          key={brand}
          onClick={() => removeFilter('brand', brand)}
          className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
        >
          <span>{brand}</span>
          <X size={14} />
        </button>
      ))}
      {gender && (
        <button
          onClick={() => removeFilter('gender')}
          className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
        >
          <span>{gender}</span>
          <X size={14} />
        </button>
      )}
      {scents.map(scent => (
        <button
          key={scent}
          onClick={() => removeFilter('scent', scent)}
          className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
        >
          <span>{scent}</span>
          <X size={14} />
        </button>
      ))}
    </div>
  );
}
