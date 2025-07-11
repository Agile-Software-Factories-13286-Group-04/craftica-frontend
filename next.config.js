/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Comentado para permitir SPA dinámica
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
