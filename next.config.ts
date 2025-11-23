import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
