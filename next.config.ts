// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	staticPageGenerationTimeout: 180,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
};

export default nextConfig;
