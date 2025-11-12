import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          brand: true,
          variants: {
            orderBy: { price: 'asc' },
            take: 1,
          },
          images: {
            where: { isMain: true },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(wishlist);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { productId }: { productId: string } = await req.json();

  const wishlistItem = await prisma.wishlist.create({
    data: {
      userId: session.user.id,
      productId,
    },
  });

  return NextResponse.json(wishlistItem);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { productId }: { productId: string } = await req.json();

  await prisma.wishlist.deleteMany({
    where: {
      userId: session.user.id,
      productId,
    },
  });

  return NextResponse.json({ message: "Item removed from wishlist" });
}
