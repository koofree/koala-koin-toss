/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.PORT,
    BUILD_TIME: process.env.BUILD_TIME,
  },
  output: 'export',
  images: {
    // Disables the static generation of `_next/image` references,
    // so Next.js won't rewrite your images to an optimization URL.
    unoptimized: true,
  },
};

module.exports = nextConfig;
