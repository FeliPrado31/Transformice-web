import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
      {
        source: "/Transformice.swf",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Content-Type",
            value: "application/x-shockwave-flash",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Proxy para servir assets locales cuando el SWF intenta cargar desde transformice.com
      {
        source: "/transformice-proxy/images/x_transformice/:path*",
        destination: "/images/x_transformice/:path*",
      },
    ];
  },
};

export default nextConfig;
