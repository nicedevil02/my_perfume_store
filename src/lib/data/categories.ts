// src/lib/data/categories.ts
import prisma from "@/lib/prisma";

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc', // بر اساس نام مرتب کن
      }
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}