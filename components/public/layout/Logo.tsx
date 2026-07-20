import Link from "next/link";
import Image from "next/image";
import siteLogo from "@/public/jimo-logo.png";
import { cn } from "@/lib/utils/helpers";

export interface LogoProps {
	className?: string;
	surface?: "on-light" | "on-dark";
}

export function Logo({ className, surface = "on-light" }: LogoProps) {
	return (
		<Link href="/" className={cn("flex items-center gap-3", className)}>
			<Image
								src={siteLogo}
								alt="Jimo Property Development Logo"
								width={100}
								height={100}
							/>
		</Link>
	);
}
