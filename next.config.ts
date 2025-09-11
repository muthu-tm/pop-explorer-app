import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BLOCK_CYCLE: process.env.BLOCK_CYCLE || '30',
    ENABLE_BLOCK_REFRESH: process.env.ENABLE_BLOCK_REFRESH || 'false',
  },
};

export default nextConfig;
