import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    // اعتبارسنجی داده‌ها
    if (!name || !email || !password || !phone) {
      return new NextResponse('لطفاً تمام فیلدها را پر کنید', { status: 400 });
    }

    // بررسی ایمیل تکراری
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new NextResponse('این ایمیل قبلاً ثبت شده است', { status: 400 });
    }

    // رمزنگاری پسورد
    const hashedPassword = await bcrypt.hash(password, 12);

    // ایجاد کاربر جدید
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        phone,
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    return new NextResponse('خطا در ثبت‌نام', { status: 500 });
  }
}
