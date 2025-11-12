import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: 'شناسه (ایمیل یا شماره موبایل) الزامی است.' },
        { status: 400 }
      );
    }

    // تولید کد تصادفی 6 رقمی
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 دقیقه اعتبار

    // ابتدا رکورد قدیمی را حذف می‌کنیم (اگر وجود داشته باشد)
    await prisma.verificationCode.deleteMany({
      where: { identifier },
    });

    // سپس رکورد جدید را ایجاد می‌کنیم
    const newCode = await prisma.verificationCode.create({
      data: {
        identifier,
        code: verificationCode,
        expiresAt,
      },
    });

    // در محیط توسعه، کد را در کنسول نمایش می‌دهیم
    console.log(`✅ کد تایید برای ${identifier}: ${verificationCode}`);

    return NextResponse.json({
      success: true,
      message: 'کد تایید با موفقیت ارسال شد.'
    });

  } catch (error) {
    console.error('❌ خطا در API ارسال کد:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست. لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}
