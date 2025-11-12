import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

// دریافت اطلاعات پروفایل کاربر
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        nationalId: true,
        cardNumber: true,
        shebaNumber: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// به‌روزرسانی اطلاعات پروفایل کاربر
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, email, nationalId, cardNumber, shebaNumber } = body;

    // پاک‌سازی شماره کارت از خط فاصله قبل از ذخیره
    const cleanedCardNumber = cardNumber ? cardNumber.replace(/-/g, '') : null;

    // **اصلاح کلیدی**: ساخت دقیق‌تر updateData
    const updateData: any = {};

    // فقط فیلدهایی که واقعاً ارسال شده‌اند را اضافه کن
    if (name !== undefined) updateData.name = name || null;
    if (nationalId !== undefined) updateData.nationalId = nationalId || null;
    if (cardNumber !== undefined) updateData.cardNumber = cleanedCardNumber;
    if (shebaNumber !== undefined) updateData.shebaNumber = shebaNumber || null;
    
    // phone و email را فقط در صورت ارسال به‌روز کن
    if (phone !== undefined) updateData.phone = phone || null;
    if (email !== undefined) updateData.email = email || null;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user settings:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Check for unique constraint violation (P2002)
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('phone')) {
          return NextResponse.json({ error: "این شماره موبایل قبلاً استفاده شده است." }, { status: 409 });
        }
        if (target.includes('nationalId')) {
          return NextResponse.json({ error: "این کدملی قبلاً استفاده شده است." }, { status: 409 });
        }
        if (target.includes('shebaNumber')) {
          return NextResponse.json({ error: "این شماره شبا قبلاً استفاده شده است." }, { status: 409 });
        }
        return NextResponse.json({ error: "اطلاعات وارد شده تکراری است." }, { status: 409 });
      }
    }
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
