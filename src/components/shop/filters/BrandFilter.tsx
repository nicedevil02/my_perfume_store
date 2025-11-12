"use client";

import { useRouter, useSearchParams } from 'next/navigation';

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface BrandFilterProps {
  brands: Brand[];
  selectedBrands?: string | string[];
}

export default function BrandFilter({ brands }: BrandFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrands = searchParams?.getAll('brand') || [];

  const toggleBrand = (slug: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (selectedBrands.includes(slug)) {
      params.delete('brand');
      selectedBrands.forEach(b => {
        if (b !== slug) params.append('brand', b);
      });
    } else {
      params.append('brand', slug);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">برندها</h3>
      <div className="space-y-2">
        {brands.map(brand => (
          <label key={brand.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand.slug)}
              onChange={() => toggleBrand(brand.slug)}
              className="rounded text-purple-600"
            />
            <span className="mr-2 text-sm">{brand.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
