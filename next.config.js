/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  output: 'export',
  basePath: isProd ? '/BuildSphere' : '',
  assetPrefix: isProd ? '/BuildSphere/' : '',
  images: { unoptimized: true },
  trailingSlash: true,
}
