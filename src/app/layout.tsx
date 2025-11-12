import { vazirmatn } from "@/lib/fonts";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import Providers from "@/components/layout/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${vazirmatn.variable} font-sans 
                   bg-gradient-to-r from-brand-peach via-brand-pink to-brand-gold 
                   bg-[length:400%_400%] animate-gradient-bg`}
      >
        {/* افزودن یک لایه نیمه‌شفاف روی بک‌گراند */}
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm -z-10" />

        <div className="relative z-10">
          <Providers>
            <ClientLayout>
              <main className="min-h-screen">{children}</main>
            </ClientLayout>
          </Providers>
        </div>
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
