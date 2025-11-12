import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// دریافت لیست آدرس‌های کاربر
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' }, // پیش‌فرض اول
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// افزودن آدرس جدید
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, receiverName, receiverPhone, province, city, postalCode, address, isDefault } = body;

    // اعتبارسنجی
    if (!title || !receiverName || !receiverPhone || !province || !city || !postalCode || !address) {
      return NextResponse.json({ error: "تمام فیلدهای الزامی را پر کنید." }, { status: 400 });
    }

    // بررسی کدپستی (باید ۱۰ رقم باشد)
    if (!/^\d{10}$/.test(postalCode)) {
      return NextResponse.json({ error: "کدپستی باید ۱۰ رقم باشد." }, { status: 400 });
    }

    // اگر این آدرس پیش‌فرض است، بقیه را غیرپیش‌فرض کن
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        title,
        receiverName,
        receiverPhone,
        province,
        city,
        postalCode,
        address,
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Failed to create address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
