"use client";

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // در یک پروژه واقعی، این داده‌ها از API دریافت می‌شوند
    fetch(`/api/products/related?categoryId=${categoryId}&exclude=${currentProductId}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [categoryId, currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16 mb-8">
      <h2 className="text-2xl font-bold mb-8">محصولات مرتبط</h2>
      
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1.2}
        navigation
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="related-products-slider"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard {...product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .related-products-slider {
          padding: 1rem;
          margin: -1rem;
        }
        .related-products-slider .swiper-button-next,
        .related-products-slider .swiper-button-prev {
          color: theme('colors.purple.600');
          background: theme('colors.white');
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .related-products-slider .swiper-button-next::after,
        .related-products-slider .swiper-button-prev::after {
          font-size: 1rem;
        }
      `}</style>
    </section>
  );
}
