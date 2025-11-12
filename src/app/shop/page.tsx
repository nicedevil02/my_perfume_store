import { getProducts } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";
import { getAllBrands } from "@/lib/data/brands";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import ActiveFilters from "@/components/shop/ActiveFilters";
import SortDropdown from "@/components/shop/SortDropdown";

interface ShopPageProps {
  searchParams: {
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    gender?: string;
    scent?: string | string[]; // تغییر به string | string[]
    sort?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [products, categories, brands] = await Promise.all([
    getProducts({
      brandSlugs: typeof searchParams.brand === "string" ? [searchParams.brand] : searchParams.brand,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      sort: searchParams.sort,
    }),
    getAllCategories(),
    getAllBrands(),
  ]);

  const selectedScents = typeof searchParams.scent === "string" 
    ? searchParams.scent.split(",") 
    : searchParams.scent || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-gray-800">فروشگاه عطر</h1>
        <p className="text-gray-600 mt-2">مجموعه کامل عطرهای اورجینال</p>
        <ActiveFilters />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar 
          categories={categories} 
          brands={brands}
          selectedBrands={searchParams.brand}
          minPrice={searchParams.minPrice}
          maxPrice={searchParams.maxPrice}
          selectedGender={searchParams.gender}
          selectedScents={selectedScents}
        />
        
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl">
            <span className="text-sm text-gray-700">
              نمایش {products.length} محصول
            </span>
            <SortDropdown />
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
