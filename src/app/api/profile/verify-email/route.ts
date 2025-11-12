import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[verify-email] No session found");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { email, code } = await req.json();
    console.log("[verify-email] Request received:", { userId: session.user.id, email, codeLength: code?.length });

    if (!email || !code) {
      console.error("[verify-email] Missing email or code");
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    // 1. Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: email.toLowerCase(), 
        NOT: { id: session.user.id } 
      },
    });
    
    if (existingUser) {
      console.error("[verify-email] Email already taken by another user:", existingUser.id);
      return NextResponse.json({ error: "این ایمیل قبلاً توسط کاربر دیگری استفاده شده است." }, { status: 409 });
    }

    // 2. Verify the code
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        identifier: email.toLowerCase(),
        code,
        expiresAt: { gt: new Date() },
        used: false,
      },
    });

    if (!verificationRecord) {
      console.error("[verify-email] Invalid or expired code for email:", email);
      return NextResponse.json({ error: "کد تایید نامعتبر یا منقضی شده است." }, { status: 400 });
    }

    console.log("[verify-email] Code verified successfully:", verificationRecord.id);

    // 3. Update user's email
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { email: email.toLowerCase(), emailVerified: new Date() },
    });

    console.log("[verify-email] User email updated successfully:", updatedUser.id, updatedUser.email);

    // 4. Mark code as used
    await prisma.verificationCode.update({
      where: { id: verificationRecord.id },
      data: { used: true },
    });

    console.log("[verify-email] Verification code marked as used");

    return NextResponse.json({ message: "ایمیل با موفقیت تایید و به‌روزرسانی شد." });

  } catch (error: any) {
    console.error("[verify-email] CRITICAL ERROR:", error);
    console.error("[verify-email] Error details:", error.message, error.stack);
    return NextResponse.json({ error: "خطای داخلی سرور. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
