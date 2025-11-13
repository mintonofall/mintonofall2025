import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: "avatars.githubusercontent.com",
            },
            {
                hostname: "imagedelivery.net",
            },
            {
                hostname: "extranet.bwf.sport",
            },
            {
                hostname: "img.bwfbadminton.com",
            },
        ],
    },
};

export default nextConfig;
