import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { identifier, code } = await req.json();

    console.log('🔍 بررسی کد برای:', identifier);

    // پیدا کردن کد تأیید
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        identifier,
        code,
        expiresAt: { gt: new Date() },
        used: false
      }
    });

    if (!verificationRecord) {
      console.log('❌ کد نامعتبر یا منقضی شده');
      return NextResponse.json(
        { message: "کد نامعتبر یا منقضی شده است" },
        { status: 400 }
      );
    }

    // علامت‌گذاری کد به عنوان استفاده شده
    await prisma.verificationCode.update({
      where: { id: verificationRecord.id },
      data: { used: true }
    });

    // بررسی وجود کاربر
    let user = await prisma.user.findUnique({
      where: { email: identifier }
    });

    // اگر کاربر وجود نداشت، ایجاد می‌کنیم
    if (!user) {
      console.log('📝 ایجاد کاربر جدید');
      user = await prisma.user.create({
        data: {
          email: identifier,
          emailVerified: new Date(),
        }
      });
      return NextResponse.json({ 
        requiresProfile: true,
        userId: user.id
      });
    }

    console.log('✅ ورود موفق');
    return NextResponse.json({ 
      success: true,
      userId: user.id
    });

  } catch (error) {
    console.error('❌ خطا در تأیید کد:', error);
    return NextResponse.json(
      { message: "خطا در تأیید کد" },
      { status: 500 }
    );
  }
}
