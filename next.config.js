/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/old-route', destination: '/new-route' }
    ];
  },
  // config อื่น ๆ
}

module.exports = nextConfig;
