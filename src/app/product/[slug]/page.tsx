import { getProductBySlug } from "@/lib/data/products";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductDetail from "@/components/products/ProductDetail";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const items = [
    { label: "خانه", href: "/" },
    { label: "فروشگاه", href: "/shop" },
    { label: product.name },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={items as any} />
      <ProductDetail product={product} />
    </div>
  );
}
