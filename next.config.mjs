/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript:{
        ignoreDuringBuilds:true,
        ignoreBuildErrors:true,
        ignoreDevErrors:true,
        ignoreServerErrors:true,
        ignoreClientErrors:true
    },
    eslint:{
        ignoreDuringBuilds:true
    }
};

export default nextConfig;
