import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // دریافت تمام سفارشات برای شمارش
    const allOrders = await prisma.order.findMany({
      where: { userId },
      select: { status: true },
    });

    // شمارش سفارشات بر اساس وضعیت
    const orderCounts = allOrders.reduce((acc, order) => {
      const status = order.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // دریافت ۳ سفارش اخیر
    const recentOrders = await prisma.order.findMany({
      where: { userId },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          take: 1, // فقط یک آیتم برای نمایش
        },
      },
    });

    return NextResponse.json({
      counts: {
        delivered: orderCounts.delivered || 0,
        returned: orderCounts.refunded || 0, // فرض می‌کنیم مرجوعی همان بازپرداخت شده است
        current: (orderCounts.pending || 0) + (orderCounts.processing || 0),
      },
      recentOrders,
    });

  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}