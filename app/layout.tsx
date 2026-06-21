import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
	title: "Jimo Command Centre",
	description: "CMS for Jimo Property Development Limited",
	robots: "noindex, nofollow", // Prevent indexing of admin pages
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geist.variable} ${geistMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}