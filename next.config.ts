// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: [
				"localhost:3000",
				"jimodevelopment.com",
				"www.jimodevelopment.com",
			],
		},
	},
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
