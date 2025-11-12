"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Slider from '@radix-ui/react-slider';

interface PriceSliderProps {
  min: number;
  max: number;
}

export default function PriceSlider({ min, max }: PriceSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [value, setValue] = useState([
    Number(searchParams.get('minPrice')) || min,
    Number(searchParams.get('maxPrice')) || max
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('minPrice', value[0].toString());
      params.set('maxPrice', value[1].toString());
      router.push(`/shop?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="space-y-6">
      <h3 className="font-medium">محدوده قیمت</h3>
      
      <Slider.Root
        className="relative flex items-center w-full h-5"
        value={value}
        max={max}
        min={min}
        step={1000}
        onValueChange={setValue}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-purple-600 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-purple-600 rounded-full hover:bg-purple-50 focus:outline-none"
          aria-label="حداقل قیمت"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-purple-600 rounded-full hover:bg-purple-50 focus:outline-none"
          aria-label="حداکثر قیمت"
        />
      </Slider.Root>

      <div className="flex justify-between text-sm">
        <span>{new Intl.NumberFormat('fa-IR').format(value[0])} تومان</span>
        <span>{new Intl.NumberFormat('fa-IR').format(value[1])} تومان</span>
      </div>
    </div>
  );
}
