/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // can't resolve 'fs' module
      config.resolve.fallback.fs = false;
      // can't resolve 'net'
      config.resolve.fallback.net = false;
    }
    return config;
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/enrollments',
        permanent: true
      }
    ]
  }
};

export default nextConfig;
