// middleware.ts
export { default } from "next-auth/middleware";

// مسیرهایی که می‌خواهیم امن‌سازی شوند را مشخص می‌کنیم
export const config = { matcher: ["/profile/:path*"] };