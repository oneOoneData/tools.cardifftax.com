const isProd = process.env.NODE_ENV === 'production'
const base = '/reasonablecomp'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isProd ? base : '',
  assetPrefix: isProd ? `${base}/` : '',
  images: { unoptimized: true },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
