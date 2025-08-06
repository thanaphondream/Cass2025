/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/old-route', destination: '/new-route' }
    ]
  },
  // เพิ่ม config อื่น ๆ ตามต้องการ
}

module.exports = nextConfig
