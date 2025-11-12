import { PrismaClient } from '@prisma/client';

// این کد از ایجاد نمونه‌های متعدد PrismaClient در محیط توسعه جلوگیری می‌کنه
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;