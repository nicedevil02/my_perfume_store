import prisma from "@/lib/prisma";

export async function getAllBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
      }
    });
    return brands;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}
