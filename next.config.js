/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'dbxce1spal1df.cloudfront.net',
      'cdn.cloudflare.steamstatic.com',
      'blz-contentstack-images.akamaized.net'
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig; 