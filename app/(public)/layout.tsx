// // app/(public)/layout.tsx
// import type { Metadata } from "next";
// import  Header  from "@/components/public/layout/Header";
// import Footer from "@/components/public/layout/Footer";

// export const metadata: Metadata = {
//   title: {
//     default: "Jimo Property Development Limited",
//     template: "%s | Jimo Property Development",
//   },
//   description:
//     "Developing Premium Real Estate with Structure, Insight, and Long-Term Value. Explore our projects in Lagos.",
//   metadataBase: new URL("https://jimopropertydevelopment.com"),
//   openGraph: {
//     type: "website",
//     siteName: "Jimo Property Development Limited",
//   },
// };

// export default function PublicLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-col min-h-screen ">
//       <Header />
//       <main className="flex-1">{children}</main>
//       <Footer />
//     </div>
//   );
// }

// src/app/(public)/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Jimo Property Development Limited",
		template: "%s | Jimo Property Development Limited",
	},
	description:
		"Premium residential, hospitality, and investment-led real estate developments in Lagos, built with structure, insight, and long-term value.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
				<Navbar />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}