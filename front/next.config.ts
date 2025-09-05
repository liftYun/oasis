import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  devImdicators: {
    buildActivity: false,
  },
};

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/offline',
  },
})(nextConfig);
