"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ZoomIn } from "lucide-react";

interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="relative">
      {/* تصویر اصلی */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={images[activeImage].url}
          alt={images[activeImage].alt}
          fill
          className={`object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        <button className="absolute top-4 left-4 p-2 bg-white/80 rounded-lg">
          <ZoomIn size={20} />
        </button>
      </div>

      {/* تصاویر کوچک */}
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveImage(index)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
              index === activeImage ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
