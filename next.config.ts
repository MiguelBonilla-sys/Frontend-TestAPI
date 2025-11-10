import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Habilitar standalone output para Docker
  output: 'standalone',
  // Optimizaciones para producción
  compress: true,
  // Configuración de imágenes si es necesario
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.railway.app',
      },
      {
        protocol: 'https',
        hostname: '**.rawg.io',
      },
    ],
  },
};

export default nextConfig;
