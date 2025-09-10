import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BLOCK_CYCLE: process.env.BLOCK_CYCLE || '30',
  },
};

export default nextConfig;
