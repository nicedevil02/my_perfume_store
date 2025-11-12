// src/lib/data/products.ts
import prisma from "@/lib/prisma"; // نمونه Prisma Client که قبلاً ساختیم

type GetProductsParams = {
  categorySlug?: string;
  brandSlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
};

export async function getProducts({ categorySlug, brandSlugs, minPrice, maxPrice, sort = 'newest' }: GetProductsParams = {}) {
  try {
    const whereClause: any = {
      isVisible: true, // فقط محصولاتی که قابل نمایش هستند را برگردان
    };

    if (categorySlug) {
      whereClause.categories = { some: { category: { slug: categorySlug } } };
    }

    if (brandSlugs && brandSlugs.length > 0) {
      whereClause.brand = { slug: { in: brandSlugs } };
    }

    if (minPrice || maxPrice) {
      whereClause.variants = {
        some: {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        },
      };
    }

    let orderBy: any;
    switch (sort) {
      case 'price-asc':
        orderBy = { variants: { price: 'asc' } };
        break;
      case 'price-desc':
        orderBy = { variants: { price: 'desc' } };
        break;
      case 'popular':
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        brand: true,       // اطلاعات برند را هم واکشی کن
        variants: {        // فقط اولین یا ارزان‌ترین variant را برای نمایش قیمت اولیه می‌گیریم
          orderBy: {
            price: 'asc',
          },
          take: 1,
        },
        images: {          // فقط تصویر اصلی را می‌گیریم
          where: {
            isMain: true,
          },
          take: 1,
        }
      },
      orderBy
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // در یک اپلیکیشن واقعی، بهتر است خطا را به شکل بهتری مدیریت کنی
    return []; 
  }
}

// Export default function برای سازگاری با کد قبلی
export const getAllProducts = getProducts;

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        variants: {
          orderBy: { price: 'asc' },
        },
        images: true,
      },
    });
    return product;
  } catch (error) {
    console.error(`Failed to fetch product with slug ${slug}:`, error);
    return null;
  }
}