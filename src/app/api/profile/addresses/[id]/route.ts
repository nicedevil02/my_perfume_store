import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ویرایش آدرس
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const addressId = params.id;
    const body = await req.json();
    const { title, receiverName, receiverPhone, province, city, postalCode, address, isDefault } = body;

    // بررسی مالکیت آدرس
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "آدرس یافت نشد یا دسترسی ندارید." }, { status: 404 });
    }

    // اگر این آدرس پیش‌فرض می‌شود، بقیه را غیرپیش‌فرض کن
    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        title: title ?? existingAddress.title,
        receiverName: receiverName ?? existingAddress.receiverName,
        receiverPhone: receiverPhone ?? existingAddress.receiverPhone,
        province: province ?? existingAddress.province,
        city: city ?? existingAddress.city,
        postalCode: postalCode ?? existingAddress.postalCode,
        address: address ?? existingAddress.address,
        isDefault: isDefault ?? existingAddress.isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Failed to update address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// حذف آدرس
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const addressId = params.id;

    // بررسی مالکیت
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "آدرس یافت نشد یا دسترسی ندارید." }, { status: 404 });
    }

    const wasDefault = existingAddress.isDefault;

    await prisma.address.delete({
      where: { id: addressId },
    });

    // اگر آدرس پیش‌فرض حذف شد، اولین آدرس باقی‌مانده را پیش‌فرض کن
    if (wasDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'asc' },
      });

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ message: "آدرس با موفقیت حذف شد." });
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
