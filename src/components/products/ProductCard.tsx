// src/components/products/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  name: string;
  brand: string;
  price: string;
  imageUrl: string;
  href: string;
}

export default function ProductCard({ name, brand, price, imageUrl, href }: ProductCardProps) {
  return (
    <Link href={href} className="group block bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-lg aspect-square">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{brand}</p>
        <p className="text-sm font-bold text-gray-900 mt-2">{price || 'ناموجود'}</p>
      </div>
    </Link>
  );
}