/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/reasonablecomp',
  trailingSlash: true,
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['postcss-loader'],
          as: '*.css',
        },
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
      '@lib': './lib',
    };
    return config;
  },
};

module.exports = nextConfig;
