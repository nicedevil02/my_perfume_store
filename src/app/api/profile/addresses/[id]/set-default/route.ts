import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const addressId = params.id;

    // بررسی مالکیت
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ error: "آدرس یافت نشد یا دسترسی ندارید." }, { status: 404 });
    }

    // همه آدرس‌ها را غیرپیش‌فرض کن
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });

    // این آدرس را پیش‌فرض کن
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Failed to set default address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
