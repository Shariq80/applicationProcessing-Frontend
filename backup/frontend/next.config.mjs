/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ];
    },
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          net: false,
          tls: false,
        }
      }
      return config
    },
  };
  
  export default nextConfig;
