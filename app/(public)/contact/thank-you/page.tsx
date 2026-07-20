import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You — Jimo Property Development",
  description:
    "Thank you for reaching out to Jimo Property Development. We will be in touch shortly.",
};

export default function ThankYouPage() {
  return (
		<section className="w-full bg-white min-h-[70vh] flex items-center justify-center px-4 py-20">
			<div className="max-w-lg w-full text-center">
				{/* Icon */}
				<div className="flex justify-center mb-6">
					<div className="w-16 h-16 rounded-full bg-[#CC1718]/10 flex items-center justify-center">
						<CheckCircle2 className="w-8 h-8 text-[#CC1718]" />
					</div>
				</div>

				{/* Heading */}
				<h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
					Thank You for Reaching Out
				</h1>

				{/* Body */}
				<p className="mt-4 text-sm md:text-base text-gray-500 leading-relaxed max-w-md mx-auto">
					We have received your enquiry and a member of our team will be in
					touch within 24 hours. In the meantime, feel free to explore our
					latest projects.
				</p>

				{/* Divider */}
				<div className="my-8 w-12 h-0.5 bg-[#CC1718] mx-auto" />

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-5">
					<ButtonLink href="/" variant="accent" size="md">
						Back to Home
						<span aria-hidden="true">→</span>
					</ButtonLink>
					<ButtonLink href="/projects" variant="primary" size="md">
						View Our Projects
						<span aria-hidden="true">→</span>
					</ButtonLink>
				</div>
			</div>
		</section>
	);
}