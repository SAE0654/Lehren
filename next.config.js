const withPWA = require('next-pwa');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  target: "serverless",
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  },
  images: {
    domains: ['www.productoslehren.com/', 'sae-files.s3.amazonaws.com/'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    ACCESS_KEY: process.env.ACCESS_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME,
    MONGO_URI: process.env.MONGO_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
    SECRET_KEY: process.env.SECRET_KEY,
    
  }
})

module.exports = nextConfig
