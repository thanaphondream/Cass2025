/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // { source: '/old-route', destination: '/new-route' }
    ];
  },
}

module.exports = nextConfig;
