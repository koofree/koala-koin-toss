/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.PORT,
    BUILD_TIME: process.env.BUILD_TIME,
  },
};

module.exports = nextConfig;
