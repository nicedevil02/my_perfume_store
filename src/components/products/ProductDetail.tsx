"use client";

type ProductDetailProps = {
  product: any;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  if (!product) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
        {/* گالری ساده */}
        <img
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.name}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.brand?.name}</p>
        <p className="text-gray-700 leading-7">{product.description || "بدون توضیحات"}</p>
        {/* قیمت از ارزان‌ترین واریانت */}
        {product.variants?.length > 0 && (
          <div className="mt-6">
            <span className="text-sm text-gray-500">شروع قیمت از</span>
            <div className="text-xl font-bold text-gray-900">
              {new Intl.NumberFormat("fa-IR").format(product.variants[0].price)} تومان
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
