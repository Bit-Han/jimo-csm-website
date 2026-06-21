// components/public/home/ContactCTA.tsx
"use client";

import { useState } from "react";

type FormState = {
	name: string;
	email: string;
	enquiry: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function ContactCTA() {
	const [form, setForm] = useState<FormState>({
		name: "",
		email: "",
		enquiry: "",
	});
	const [submitState, setSubmitState] = useState<SubmitState>("idle");

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitState("loading");

		try {
			const res = await fetch("/api/leads", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: form.name,
					email: form.email,
					message: form.enquiry,
					source: "website",
					sourcePage: "/",
					formType: "general_contact",
				}),
			});

			if (res.ok) {
				setSubmitState("success");
				setForm({ name: "", email: "", enquiry: "" });
			} else {
				setSubmitState("error");
			}
		} catch {
			setSubmitState("error");
		}
	}

	return (
		<section className="w-full bg-white py-16 md:py-20 lg:py-24 border-t border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
					{/* Left — Text */}
					<div>
						<h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#CC1718] leading-tight max-w-sm">
							Let&apos;s Build Something Great Together
						</h2>
						<p className="mt-5 text-sm md:text-base text-gray-600 leading-relaxed max-w-md">
							Whether you&apos;re a buyer, investor, or partner — we&apos;d love
							to hear from you. Fill in the form and our team will be in touch
							within 24 hours.
						</p>
					</div>

					{/* Right — Form */}
					<div>
						{submitState === "success" ? (
							<div className="p-6 bg-green-50 border border-green-200 rounded-sm">
								<p className="text-sm font-medium text-green-700">
									Thank you! We&apos;ll be in touch shortly.
								</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Name */}
								<div>
									<input
										type="text"
										name="name"
										value={form.name}
										onChange={handleChange}
										placeholder="Name"
										required
										className="w-full px-0 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-[#CC1718] transition-colors"
									/>
								</div>

								{/* Email */}
								<div>
									<input
										type="email"
										name="email"
										value={form.email}
										onChange={handleChange}
										placeholder="Email"
										required
										className="w-full px-0 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-[#CC1718] transition-colors"
									/>
								</div>

								{/* Enquiry */}
								<div>
									<textarea
										name="enquiry"
										value={form.enquiry}
										onChange={handleChange}
										placeholder="Enquires"
										rows={4}
										required
										className="w-full px-0 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-[#CC1718] transition-colors resize-none"
									/>
								</div>

								{submitState === "error" && (
									<p className="text-xs text-red-600">
										Something went wrong. Please try again.
									</p>
								)}

								<div className="flex justify-end pt-2">
									<button
										type="submit"
										disabled={submitState === "loading"}
										className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
									>
										{submitState === "loading" ? "Sending..." : "Send enquiry"}
										{submitState !== "loading" && (
											<span aria-hidden="true">→</span>
										)}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
