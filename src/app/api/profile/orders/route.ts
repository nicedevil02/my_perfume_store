import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");

  let statusFilter: OrderStatus[] | undefined;

  switch (statusParam) {
    case 'current':
      statusFilter = [OrderStatus.PENDING, OrderStatus.PROCESSING];
      break;
    case 'delivered':
      statusFilter = [OrderStatus.DELIVERED];
      break;
    case 'returned':
      statusFilter = [OrderStatus.REFUNDED];
      break;
    case 'canceled':
      statusFilter = [OrderStatus.CANCELLED, OrderStatus.FAILED];
      break;
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        ...(statusFilter && { status: { in: statusFilter } }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(orders);

  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
