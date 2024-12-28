import nextPwa from '@ducanh2912/next-pwa';

await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

const withPwa = nextPwa({
    dest: "public",
    register: true,
    // cacheOnFrontEndNav: true,
    disable: process.env.NODE_ENV === 'development',
    fallbacks: {
        document: "/~offline"
    }
});

export default withPwa(config);
