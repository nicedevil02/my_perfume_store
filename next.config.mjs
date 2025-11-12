/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-image-cdn.com', // نمونه CDN تصاویر
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // domains: ['your-image-cdn.com'], // در صورت نیاز فعال کن
  },
  // سایر تنظیمات اولیه را اینجا اضافه کن
  // experimental: {
  //   serverActions: true,
  // },
};

export default nextConfig;
