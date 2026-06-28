/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.digikala.com' },
      { protocol: 'https', hostname: '**.technolife.ir' },
      { protocol: 'https', hostname: '**.basalam.com' },
    ],
  },
};
module.exports = nextConfig;
