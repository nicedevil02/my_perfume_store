'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, ShoppingCart, Heart, HeartOff } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  id: string;
  name: string;
  description?: string;
  gender: 'MEN' | 'WOMEN' | 'UNISEX';
  brand: {
    id: string;
    name: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    isMain: boolean;
  }>;
  variants: Array<{
    id: string;
    size: number;
    price: number;
    stock: number;
  }>;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  isWishlisted?: boolean;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        const data = await response.json();
        // Map the API response to our component format
        const formattedProducts = data.map((product: any) => ({
          ...product,
          isWishlisted: false,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to mock data if API fails
        const mockFeaturedProducts = [
          {
            id: '1',
            name: 'Citrus Breeze',
            description: 'A refreshing citrus fragrance with notes of lemon and orange',
            gender: 'UNISEX',
            brand: { id: '1', name: 'Fragrance House' },
            images: [{ id: '1', url: 'https://placehold.co/300x300/F8F4E9/333333?text=Citrus+Breeze', alt: 'Citrus Breeze', isMain: true }],
            variants: [
              { id: '1', size: 50, price: 120000, stock: 15 },
              { id: '2', size: 100, price: 180000, stock: 8 }
            ],
            isFeatured: true,
            isVisible: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isWishlisted: false,
          },
          {
            id: '2',
            name: 'Ocean Mist',
            description: 'Fresh and aquatic scent with marine notes',
            gender: 'MEN',
            brand: { id: '2', name: 'Aquatic Scents' },
            images: [{ id: '2', url: 'https://placehold.co/300x300/E6F4F1/333333?text=Ocean+Mist', alt: 'Ocean Mist', isMain: true }],
            variants: [
              { id: '3', size: 75, price: 150000, stock: 12 }
            ],
            isFeatured: true,
            isVisible: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isWishlisted: true,
          },
          {
            id: '3',
            name: 'Midnight Orchid',
            description: 'Mysterious and floral with rich orchid notes',
            gender: 'WOMEN',
            brand: { id: '3', name: 'Floral Elegance' },
            images: [{ id: '3', url: 'https://placehold.co/300x300/EBE1F5/333333?text=Midnight+Orchid', alt: 'Midnight Orchid', isMain: true }],
            variants: [
              { id: '4', size: 50, price: 170000, stock: 6 },
              { id: '5', size: 100, price: 250000, stock: 4 }
            ],
            isFeatured: true,
            isVisible: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isWishlisted: false,
          },
          {
            id: '4',
            name: 'Golden Amber',
            description: 'Warm and sensual with amber and vanilla notes',
            gender: 'UNISEX',
            brand: { id: '1', name: 'Fragrance House' },
            images: [{ id: '4', url: 'https://placehold.co/300x300/F7EBC8/333333?text=Golden+Amber', alt: 'Golden Amber', isMain: true }],
            variants: [
              { id: '6', size: 75, price: 200000, stock: 10 }
            ],
            isFeatured: true,
            isVisible: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isWishlisted: false,
          },
          {
            id: '5',
            name: 'Wild Berries',
            description: 'Fruity and vibrant with mixed berry notes',
            gender: 'WOMEN',
            brand: { id: '4', name: 'Berry Scents' },
            images: [{ id: '5', url: 'https://placehold.co/300x300/F0E6EB/333333?text=Wild+Berries', alt: 'Wild Berries', isMain: true }],
            variants: [
              { id: '7', size: 30, price: 90000, stock: 20 },
              { id: '8', size: 60, price: 150000, stock: 14 }
            ],
            isFeatured: true,
            isVisible: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isWishlisted: true,
          },
        ];
        setProducts(mockFeaturedProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const toggleWishlist = (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, isWishlisted: !product.isWishlisted } 
          : product
      )
    );
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse">Featured Products of the Month</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Products of the Month</h2>
          <p className="text-gray-600 dark:text-gray-300">Currently, there are no featured products to display.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Products of the Month</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our handpicked selection of premium fragrances that are captivating our customers this month
          </p>
        </div>

        {/* Desktop view - Grid */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product) => {
            // Find the main image
            const mainImage = product.images.find(img => img.isMain) || product.images[0];
            // Get the lowest price variant as the base price
            const basePrice = Math.min(...product.variants.map(v => v.price));
            // Check if any variant is on discount
            const discountPrice = product.variants.some(v => v.price < basePrice) ? basePrice : undefined;

            return (
              <div 
                key={product.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img 
                    src={mainImage?.url || 'https://placehold.co/300x300'} 
                    alt={product.name} 
                    className="w-full h-48 object-contain p-4 bg-gray-50 dark:bg-gray-900"
                    width={300}
                    height={300}
                  />
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    aria-label={product.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {product.isWishlisted ? (
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    ) : (
                      <HeartOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {discountPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 h-10">{product.description}</p>
                  
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center">
                      {/* Placeholder for ratings - would be fetched from product reviews */}
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-4 h-4 text-gray-300 dark:text-gray-600" 
                        />
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-1 ml-1">(0)</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      {discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{discountPrice.toLocaleString()} تومان</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through mr-2">{basePrice.toLocaleString()} تومان</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{basePrice.toLocaleString()} تومان</span>
                      )}
                    </div>
                    <button className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile/Tablet view - Swiper */}
        <div className="lg:hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className="py-4"
          >
            {products.map((product) => {
              // Find the main image
              const mainImage = product.images.find(img => img.isMain) || product.images[0];
              // Get the lowest price variant as the base price
              const basePrice = Math.min(...product.variants.map(v => v.price));
              // Check if any variant is on discount
              const discountPrice = product.variants.some(v => v.price < basePrice) ? basePrice : undefined;

              return (
                <SwiperSlide key={product.id}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="relative">
                      <img 
                        src={mainImage?.url || 'https://placehold.co/300x300'} 
                        alt={product.name} 
                        className="w-full h-40 object-contain p-4 bg-gray-50 dark:bg-gray-900"
                        width={300}
                        height={300}
                      />
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        aria-label={product.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {product.isWishlisted ? (
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                        ) : (
                          <HeartOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {discountPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 h-10">{product.description}</p>
                      
                      <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                          {/* Placeholder for ratings */}
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-3 h-3 text-gray-300 dark:text-gray-600" 
                            />
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1 ml-1">(0)</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div>
                          {discountPrice ? (
                            <>
                              <span className="text-base font-bold text-gray-900 dark:text-white">{discountPrice.toLocaleString()} تومان</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 line-through mr-2">{basePrice.toLocaleString()} تومان</span>
                            </>
                          ) : (
                            <span className="text-base font-bold text-gray-900 dark:text-white">{basePrice.toLocaleString()} تومان</span>
                          )}
                        </div>
                        <button className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;