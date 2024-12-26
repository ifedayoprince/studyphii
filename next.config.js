import nextPwa from 'next-pwa';

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
    skipWaiting: true,
    // important to avoid running the generation everytime on your local environment
    disable: process.env.NODE_ENV === 'development',
});

export default withPwa(config);
