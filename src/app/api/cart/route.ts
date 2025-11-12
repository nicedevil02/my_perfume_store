import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// دریافت سبد خرید
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    brand: true,
                    images: {
                      where: { isMain: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// افزودن آیتم به سبد
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { variantId, quantity } = await req.json();

    if (!variantId || quantity < 1) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // چک کردن موجودی
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.stock < quantity) {
      return NextResponse.json({ error: "موجودی کافی نیست" }, { status: 400 });
    }

    // ایجاد یا یافتن سبد کاربر
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // افزودن یا به‌روزرسانی آیتم
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > variant.stock) {
        return NextResponse.json({ error: "موجودی کافی نیست" }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    return NextResponse.json({ message: "به سبد اضافه شد" });
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// به‌روزرسانی تعداد
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { variantId, quantity } = await req.json();

    if (quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.stock < quantity) {
      return NextResponse.json({ error: "موجودی کافی نیست" }, { status: 400 });
    }

    await prisma.cartItem.updateMany({
      where: {
        cartId: cart.id,
        variantId,
      },
      data: { quantity },
    });

    return NextResponse.json({ message: "به‌روز شد" });
  } catch (error) {
    console.error("Failed to update cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// حذف آیتم
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { variantId } = await req.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    return NextResponse.json({ message: "حذف شد" });
  } catch (error) {
    console.error("Failed to delete from cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}