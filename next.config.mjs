/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        hostname: 'files.edgestore.dev',
      },
    ],
  },
};

export default nextConfig;
