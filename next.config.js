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
    domains: ['lehren-productos.vercel.app', 'sae-files.s3.amazonaws.com/'],
    formats: ['image/avif', 'image/webp'],
  },
})

module.exports = nextConfig
