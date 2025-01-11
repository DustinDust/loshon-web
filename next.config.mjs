/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        hostname: '127.0.0.1',
      },
      {
        hostname: '0.0.0.0',
      },
    ],
  },
};

export default nextConfig;
