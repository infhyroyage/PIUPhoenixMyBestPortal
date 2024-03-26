/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.GITHUB_ACTIONS
    ? "/PIUPhoenixMyBestPortal/"
    : undefined,
  basePath: process.env.GITHUB_ACTIONS ? "/PIUPhoenixMyBestPortal" : undefined,
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
