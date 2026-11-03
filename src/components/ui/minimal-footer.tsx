"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { addLead } from "@/lib/blogStore";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";

export function MinimalFooter() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !email.includes("@")) return;
		setIsSubmitting(true);

		// 1. Save lead to Neon Database & localStorage
		try {
			await addLead(email.trim(), "footer-newsletter");
		} catch (err) {
			console.warn("Failed to record newsletter lead in DB:", err);
		}

		// 2. Send email notification via Web3Forms if configured
		const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "f99f1a70-4774-46cf-9c2d-b4a712985a9b";

		try {
			await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					access_key: accessKey,
					subject: "New Newsletter Subscriber — Mitul Portfolio",
					from_name: "Mitul Zalavadiya Portfolio",
					email: email,
					message: `A user has subscribed to the newsletter. Email: ${email}`,
				}),
			});
			setIsSubmitted(true);
			setEmail("");
		} catch (error) {
			console.error("Web3Forms submission error:", error);
			setIsSubmitted(true);
			setEmail("");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative bg-[#050505] text-white border-t border-zinc-900 overflow-hidden">
			{/* ── Top Newsletter Bar ── */}
			<div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 pt-10 pb-8 border-b border-zinc-900/80">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
					<div className="lg:col-span-6 flex flex-col gap-1.5">
						<h3 className="text-lg md:text-xl font-bold font-headings text-white tracking-tight">
							Sign Up for Shopify Growth &amp; App Updates
						</h3>
						<p className="text-zinc-400 text-xs sm:text-sm">
							Receive updates on custom themes, high-converting Liquid sections, and new Shopify app launches.
						</p>
					</div>
					<div className="lg:col-span-6">
						{isSubmitted ? (
							<div className="p-3.5 bg-zinc-900/80 border border-emerald-500/30 rounded-xl flex items-center gap-3">
								<CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
								<div>
									<h4 className="text-sm font-bold text-white">Subscription Successful!</h4>
									<p className="text-xs text-zinc-400">Thank you for connecting with Mitul Zalavadiya.</p>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubscribe} className="flex flex-col gap-2">
								<div className="relative flex items-center">
									<input
										type="email"
										required
										placeholder="Enter your email for Shopify tips..."
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={isSubmitting}
										className="w-full bg-zinc-900/90 hover:bg-zinc-900 focus:bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 outline-none transition-all"
									/>
									<button
										type="submit"
										disabled={isSubmitting || !email}
										aria-label="Subscribe to newsletter"
										className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
									>
										{isSubmitting ? (
											<div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-black" />
										) : (
											<Send className="w-3.5 h-3.5" />
										)}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>

			{/* ── Halftone Wordmark Interactive Animated Canvas Footer ── */}
			<HalftoneWordmarkFooter
				wordmark="mitul"
				label="Mitul Zalavadiya"
				meta="Shopify Developer at Solvifytech • Surat, India"
				height="560px"
				dotGap={6}
				radius={90}
				preset="night"
				palette={{
					background: "#050505",
					ink: "#f4f4f5",
					warm: "#10b981",
				}}
			/>
		</div>
	);
}

export default MinimalFooter;
