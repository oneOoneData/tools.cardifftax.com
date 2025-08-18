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
};

module.exports = nextConfig; 