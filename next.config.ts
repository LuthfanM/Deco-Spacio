/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_OFF: process.env.API_OFF || "false",
  },
};

module.exports = nextConfig;
