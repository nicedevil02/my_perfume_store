import { NextResponse } from 'next/server';

// This is a mock API route - in a real implementation, you would connect to your database
// to fetch products where isFeatured = true
export async function GET() {
  // In a real application, this would fetch from your database:
  // const featuredProducts = await prisma.product.findMany({
  //   where: { isFeatured: true, isVisible: true },
  //   include: { 
  //     brand: true, 
  //     images: { where: { isMain: true } }, 
  //     variants: true 
  //   }
  // });

  // Mock data representing what would come from the database
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
    },
  ];

  return NextResponse.json(mockFeaturedProducts);
}