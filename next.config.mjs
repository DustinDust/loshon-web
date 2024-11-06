/** @type {import('next').NextConfig} */
const nextConfig = {
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
