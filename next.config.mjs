/** @type {import('next').NextConfig} */
import nextPwa from 'next-pwa'

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    }); // 针对 SVG 的处理规则

    return config;
  },
}

const withPWA = nextPwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
})

export default withPWA(nextConfig)
