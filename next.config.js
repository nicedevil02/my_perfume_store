/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizeCss: true,
    scrollRestoration: true
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/unified',
        destination: '/auth/login',
        permanent: true,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        default: false,
        vendors: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
