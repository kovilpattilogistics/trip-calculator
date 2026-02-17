/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/trip-calculator',
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
