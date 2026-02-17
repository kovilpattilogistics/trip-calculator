/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/trip-calculator',
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://trip-calculator-dusky.vercel.app/trip-calculator' : undefined,
    trailingSlash: true,
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
