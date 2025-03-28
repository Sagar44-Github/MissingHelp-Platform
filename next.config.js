/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "randomuser.me",
      "cloudflare-ipfs.com",
      "images.pexels.com",
    ],
  },
  experimental: {
    serverActions: true,
  },
  env: {
    MONGODB_URI: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

module.exports = nextConfig;
