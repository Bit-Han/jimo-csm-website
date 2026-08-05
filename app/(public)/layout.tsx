//@/app/(public)/layout — updated, no html/body/metadata duplication
import type { ReactNode } from "react";
import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<>
			<Navbar />
			<main>{children}</main>
			<Footer />
		</>
	);
}