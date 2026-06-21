// components/public/services/ServicesContact.tsx
"use client";

import { useState } from "react";

type FormState = {
	fullName: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function ServicesContact() {
	const [form, setForm] = useState<FormState>({
		fullName: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
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
					name: form.fullName,
					email: form.email,
					phone: form.phone,
					message: `Subject: ${form.subject}\n\n${form.message}`,
					source: "website",
					sourcePage: "/services",
					formType: "general_contact",
				}),
			});
			if (res.ok) {
				setSubmitState("success");
				setForm({
					fullName: "",
					email: "",
					phone: "",
					subject: "",
					message: "",
				});
			} else {
				setSubmitState("error");
			}
		} catch {
			setSubmitState("error");
		}
	}

	return (
		<section className="w-full bg-white py-16 md:py-20 mt-5">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
					{/* Left — Text */}
					<div>
						<span className="text-xs font-bold tracking-widest uppercase text-[#CC1718]">
							Contact Us
						</span>
						<h2 className="mt-3 text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-tight max-w-xs">
							Let&apos;s Build Something Great Together
						</h2>
						<p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-sm">
							Whether you are a buyer, investor, landowner, or partner — we
							would love to hear from you. Our team will respond within 24
							hours.
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
								{/* Row 1 */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<input
										type="text"
										name="fullName"
										value={form.fullName}
										onChange={handleChange}
										placeholder="Full Name"
										required
										className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-sm focus:outline-none focus:border-[#CC1718] transition-colors bg-white"
									/>
									<input
										type="email"
										name="email"
										value={form.email}
										onChange={handleChange}
										placeholder="Email Address"
										required
										className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-sm focus:outline-none focus:border-[#CC1718] transition-colors bg-white"
									/>
								</div>

								{/* Row 2 */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<input
										type="tel"
										name="phone"
										value={form.phone}
										onChange={handleChange}
										placeholder="Phone Number"
										className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-sm focus:outline-none focus:border-[#CC1718] transition-colors bg-white"
									/>
									<input
										type="text"
										name="subject"
										value={form.subject}
										onChange={handleChange}
										placeholder="Subject"
										className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-sm focus:outline-none focus:border-[#CC1718] transition-colors bg-white"
									/>
								</div>

								{/* Message */}
								<textarea
									name="message"
									value={form.message}
									onChange={handleChange}
									placeholder="Message"
									rows={5}
									required
									className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-sm focus:outline-none focus:border-[#CC1718] transition-colors bg-white resize-none"
								/>

								{submitState === "error" && (
									<p className="text-xs text-red-600">
										Something went wrong. Please try again.
									</p>
								)}

								<div className="flex justify-end pt-1">
									<button
										type="submit"
										disabled={submitState === "loading"}
										className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
									>
										{submitState === "loading" ? "Sending..." : "Send Message"}
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
