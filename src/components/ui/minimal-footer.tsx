import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2 } from "lucide-react";
import logo1 from "@/app logo/logo1.png";
import { addLead } from "@/lib/blogStore";

export function MinimalFooter() {
	const year = new Date().getFullYear();
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
			const response = await fetch("https://api.web3forms.com/submit", {
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

			if (response.ok) {
				setIsSubmitted(true);
				setEmail("");
			} else {
				setIsSubmitted(true);
				setEmail("");
			}
		} catch (error) {
			console.error("Web3Forms submission error:", error);
			setIsSubmitted(true);
			setEmail("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const company = [
		{
			title: 'About Us',
			href: '/about',
		},
		{
			title: 'Connect With Us',
			href: '/connect',
		},
		{
			title: 'Contact Us',
			href: '/contact',
		},
		{
			title: 'FAQs',
			href: '/faq',
		},
	];

	const resources = [
		{
			title: 'User Guide',
			href: '/guide',
		},
		{
			title: 'Privacy Policy',
			href: '/privacy',
		},
		{
			title: 'Terms of Service',
			href: '/terms',
		},
	];

	const products = [
		{
			title: 'AI Section Hub',
			href: 'https://apps.shopify.com/ai-section-hub',
		},
		{
			title: 'Klenzo: Variant Swatch',
			href: 'https://apps.shopify.com/klenzo-product-variant-swatch',
		},
		{
			title: 'Shopify Apps',
			href: '/shopify-apps',
		},
		{
			title: 'Shopify Websites',
			href: '/shopify-website',
		},
	];

	const socialLinks = [
		{
			icon: (
				<svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
					<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
				</svg>
			),
			link: 'https://youtube.com/@ai-section-hub?si=Rop3U0a3xRipzLpX',
		},
		{
			icon: (
				<svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
					<rect x="2" y="9" width="4" height="12" />
					<circle cx="4" cy="4" r="2" />
				</svg>
			),
			link: 'https://www.linkedin.com/in/mitul-zalavadiya-784873369?utm_source=share_via&utm_content=profile&utm_medium=member_android',
		},
		{
			icon: (
				<svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
					<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
					<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
				</svg>
			),
			link: 'https://www.instagram.com/_mitulzalavadiya_',
		},
		{
			icon: (
				<svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
				</svg>
			),
			link: 'https://x.com/mitul1125',
		},
		{
			icon: (
				<svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.35-4.24 3.71.79c.05.89.79 1.6 1.69 1.6 1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8c-.81 0-1.5.54-1.72 1.28l-3.97-.85c-.2-.04-.4.07-.46.27l-1.5 4.73c-2.49.04-4.75.68-6.42 1.7C3.36 9.79 2.46 9.3 1.5 9.3c-1.65 0-3 1.35-3 3 0 1.13.63 2.11 1.56 2.62-.06.29-.1.59-.1.88 0 3.69 4.19 6.7 9.35 6.7s9.35-3 9.35-6.7c0-.29-.04-.59-.1-.88.94-.51 1.56-1.5 1.56-2.62zm-18 2.71c0-1 1-1.8 1.8-1.8s1.8.8 1.8 1.8-1 1.8-1.8 1.8-1.8-.8-1.8-1.8zm7.55 3.32c-1.02 1.02-2.97 1.09-3.55 1.09-.59 0-2.54-.07-3.56-1.09-.19-.19-.19-.51 0-.7.19-.19.51-.19.7 0 .8.8 2.29.87 2.86.87.56 0 2.05-.07 2.85-.86.19-.19.51-.19.7 0 .2.19.2.51.01.7zm-.51-1.52c-.8 0-1.8-.8-1.8-1.8s1-1.8 1.8-1.8 1.8.8 1.8 1.8-1 1.8-1.8 1.8z" />
				</svg>
			),
			link: 'https://www.reddit.com/user/mitulzalavadiya1125/',
		},
		{
			icon: (
				<svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
					<rect x="2" y="4" width="20" height="16" rx="2" />
					<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
				</svg>
			),
			link: 'mailto:mitulzalavadiya10@gmail.com',
		},
	];

	return (
		<footer className="relative bg-black text-white border-t border-zinc-800 overflow-hidden">
			<div className="bg-[radial-gradient(35%_80%_at_30%_0%,rgba(255,255,255,0.05),transparent)] mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
				{/* Newsletter Signup Row */}
				<div className="border-b border-zinc-900 pb-10 pt-10 md:pb-12 md:pt-12">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
						<div className="lg:col-span-6 flex flex-col gap-2">
							<h3 className="text-lg md:text-xl font-extrabold font-headings text-white tracking-tight">
								Sign Up for Newsletter
							</h3>
							<p className="text-zinc-500 text-sm">
								Subscribe to receive store updates, product drops, and exclusive discounts directly in your inbox.
							</p>
						</div>
						<div className="lg:col-span-6">
							{isSubmitted ? (
								<div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
									<CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-pulse" />
									<div>
										<h4 className="text-sm font-bold text-white">Subscription Successful!</h4>
										<p className="text-xs text-zinc-500">Thank you for connecting with us. All updates will be sent to your email.</p>
									</div>
								</div>
							) : (
								<form onSubmit={handleSubscribe} className="flex flex-col gap-3">
									<div className="relative flex items-center">
										<input
											type="email"
											required
											placeholder="Enter your email..."
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											disabled={isSubmitting}
											className="w-full bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-900 border border-zinc-800 focus:border-white rounded-2xl py-3.5 pl-5 pr-14 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300"
										/>
										<button
											type="submit"
											disabled={isSubmitting || !email}
											className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-700 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md shrink-0"
										>
											{isSubmitting ? (
												<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black" />
											) : (
												<Send className="w-4 h-4" />
											)}
										</button>
									</div>
									<p className="text-[11px] text-zinc-600 leading-relaxed">
										By subscribing, you agree to our{" "}
										<a href="/terms" className="text-zinc-400 hover:text-white underline transition-colors">
											Terms and Conditions
										</a>{" "}
										and{" "}
										<a href="/privacy" className="text-zinc-400 hover:text-white underline transition-colors">
											Privacy Policy
										</a>.
									</p>
								</form>
							)}
						</div>
					</div>
				</div>

				{/* Main Footer Links */}
				<div className="pt-10 pb-8 md:pt-12">
					{/* Logo + Description + Socials */}
					<div className="flex flex-col gap-4 mb-8 md:mb-0 md:hidden">
						<a href="#" className="w-max">
							<img src={logo1} alt="Klenzo Logo" className="h-7 w-auto object-contain" style={{ filter: 'invert(0)' }} />
						</a>
						<p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
							Power your Shopify store with lightning-fast AI-powered theme sections and visual variant swatches. Built by Klenzo.
						</p>
						<div className="flex gap-2 flex-wrap">
							{socialLinks.map((item, i) => (
								<a
									key={i}
									className="hover:bg-zinc-800 rounded-md border border-zinc-800 p-2 duration-200 flex items-center justify-center text-zinc-400 hover:text-white"
									target="_blank"
									rel="noopener noreferrer"
									href={item.link}
								>
									{item.icon}
								</a>
							))}
						</div>
					</div>

					{/* Mobile: 3-col links grid */}
					<div className="grid grid-cols-3 gap-x-4 gap-y-8 md:hidden">
						{/* Products */}
						<div className="flex flex-col gap-2">
							<span className="text-zinc-400 mb-1 block text-[10px] font-headings font-bold uppercase tracking-wider">
								Products
							</span>
							{products.map(({ href, title }, i) => (
								href.startsWith("http") ? (
									<a
										key={i}
										className="text-xs text-zinc-400 duration-200 hover:text-white hover:underline leading-snug"
										target="_blank"
										rel="noreferrer"
										href={href}
									>
										{title}
									</a>
								) : (
									<Link
										key={i}
										className="text-xs text-zinc-400 duration-200 hover:text-white hover:underline leading-snug"
										to={href}
									>
										{title}
									</Link>
								)
							))}
						</div>
						{/* Company */}
						<div className="flex flex-col gap-2">
							<span className="text-zinc-400 mb-1 block text-[10px] font-headings font-bold uppercase tracking-wider">
								Company
							</span>
							{company.map(({ href, title }, i) => (
								<a
									key={i}
									className="text-xs text-zinc-400 duration-200 hover:text-white hover:underline leading-snug"
									href={href}
								>
									{title}
								</a>
							))}
						</div>
						{/* Resources */}
						<div className="flex flex-col gap-2">
							<span className="text-zinc-400 mb-1 block text-[10px] font-headings font-bold uppercase tracking-wider">
								Resources
							</span>
							{resources.map(({ href, title }, i) => (
								<a
									key={i}
									className="text-xs text-zinc-400 duration-200 hover:text-white hover:underline leading-snug"
									href={href}
								>
									{title}
								</a>
							))}
						</div>
					</div>

					{/* Desktop: original 12-col grid */}
					<div className="hidden md:grid grid-cols-12 gap-8">
						<div className="col-span-5 flex flex-col gap-5">
							<a href="#" className="w-max">
								<img src={logo1} alt="Klenzo Logo" className="h-8 w-auto object-contain" style={{ filter: 'invert(0)' }} />
							</a>
							<p className="text-zinc-400 max-w-sm text-sm text-balance">
								Power your Shopify store with lightning-fast AI-powered theme sections and visual variant swatches. Built by Klenzo.
							</p>
							<div className="flex gap-2">
								{socialLinks.map((item, i) => (
									<a
										key={i}
										className="hover:bg-zinc-800 rounded-md border border-zinc-800 p-1.5 duration-200 flex items-center justify-center text-zinc-400 hover:text-white"
										target="_blank"
										rel="noopener noreferrer"
										href={item.link}
									>
										{item.icon}
									</a>
								))}
							</div>
						</div>
						<div className="col-span-2 w-full">
							<span className="text-zinc-400 mb-3 block text-xs font-headings font-bold uppercase tracking-wider">
								Products
							</span>
							<div className="flex flex-col gap-2">
								{products.map(({ href, title }, i) => (
									href.startsWith("http") ? (
										<a
											key={i}
											className="w-max text-sm text-zinc-400 duration-200 hover:text-white hover:underline"
											target="_blank"
											rel="noreferrer"
											href={href}
										>
											{title}
										</a>
									) : (
										<Link
											key={i}
											className="w-max text-sm text-zinc-400 duration-200 hover:text-white hover:underline"
											to={href}
										>
											{title}
										</Link>
									)
								))}
							</div>
						</div>
						<div className="col-span-2 w-full">
							<span className="text-zinc-400 mb-3 block text-xs font-headings font-bold uppercase tracking-wider">
								Company
							</span>
							<div className="flex flex-col gap-2">
								{company.map(({ href, title }, i) => (
									<a
										key={i}
										className="w-max text-sm text-zinc-400 duration-200 hover:text-white hover:underline"
										href={href}
									>
										{title}
									</a>
								))}
							</div>
						</div>
						<div className="col-span-3 w-full">
							<span className="text-zinc-400 mb-3 block text-xs font-headings font-bold uppercase tracking-wider">
								Resources
							</span>
							<div className="flex flex-col gap-2">
								{resources.map(({ href, title }, i) => (
									<a
										key={i}
										className="w-max text-sm text-zinc-400 duration-200 hover:text-white hover:underline"
										href={href}
									>
										{title}
									</a>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-zinc-800 flex flex-col justify-between gap-2 py-6">
					<p className="text-zinc-500 text-center text-xs">
						&copy; {year} Mitul Zalavadiya. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
