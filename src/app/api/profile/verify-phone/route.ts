import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[verify-phone] No session found");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { phone, code } = await req.json();
    console.log("[verify-phone] Request received:", { userId: session.user.id, phone, codeLength: code?.length });

    if (!phone || !code) {
      console.error("[verify-phone] Missing phone or code");
      return NextResponse.json({ error: "Phone number and code are required" }, { status: 400 });
    }

    // 1. Check if phone is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: { 
        phone, 
        NOT: { id: session.user.id } 
      },
    });
    
    if (existingUser) {
      console.error("[verify-phone] Phone already taken by another user:", existingUser.id);
      return NextResponse.json({ error: "این شماره موبایل قبلاً توسط کاربر دیگری استفاده شده است." }, { status: 409 });
    }

    // 2. Verify the code
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        identifier: phone,
        code,
        expiresAt: { gt: new Date() },
        used: false,
      },
    });

    if (!verificationRecord) {
      console.error("[verify-phone] Invalid or expired code for phone:", phone);
      return NextResponse.json({ error: "کد تایید نامعتبر یا منقضی شده است." }, { status: 400 });
    }

    console.log("[verify-phone] Code verified successfully:", verificationRecord.id);

    // 3. Update user's phone number
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { phone },
    });

    console.log("[verify-phone] User phone updated successfully:", updatedUser.id, updatedUser.phone);

    // 4. Mark code as used
    await prisma.verificationCode.update({
      where: { id: verificationRecord.id },
      data: { used: true },
    });

    console.log("[verify-phone] Verification code marked as used");

    return NextResponse.json({ message: "شماره موبایل با موفقیت تایید و به‌روزرسانی شد." });

  } catch (error: any) {
    console.error("[verify-phone] CRITICAL ERROR:", error);
    console.error("[verify-phone] Error details:", error.message, error.stack);
    return NextResponse.json({ error: "خطای داخلی سرور. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
