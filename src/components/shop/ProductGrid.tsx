import ProductCard from "@/components/products/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: { name: string };
  variants: { price: number }[];
  images: { url: string }[];
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">محصولی با این مشخصات یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          brand={product.brand.name}
          price={`${product.variants[0]?.price.toLocaleString('fa-IR')} تومان`}
          imageUrl={product.images[0]?.url || '/images/placeholder.jpg'}
          href={`/product/${product.slug}`}
        />
      ))}
    </div>
  );
}
