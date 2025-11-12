import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-reverse space-x-2 text-sm text-gray-500">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && <ChevronLeft size={16} className="mx-2" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-purple-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
