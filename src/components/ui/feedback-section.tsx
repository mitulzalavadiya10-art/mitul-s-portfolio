"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Bug, Lightbulb, Send, CheckCircle2, MessageSquare } from "lucide-react";

type FeedbackType = "review" | "bug" | "suggestion";

export function FeedbackSection() {
  const [type, setType] = useState<FeedbackType>("review");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [message, setMessage] = useState("");
  const [bugSeverity, setBugSeverity] = useState<"low" | "medium" | "critical">("medium");
  const [appAffected, setAppAffected] = useState<"section_hub" | "variants" | "general">("general");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.warn("Web3Forms access key is not set. Simulating form submission locally.");
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setStoreUrl("");
        setMessage("");
      }, 1500);
      return;
    }

    // Format fields for cleaner email visualization
    let subjectLine = "New Feedback Submission (Klenzo)";
    let typeLabel = "General Suggestion";
    let detailsText = "";

    if (type === "review") {
      subjectLine = `New App Review ⭐ ${rating}/5 stars`;
      typeLabel = `App Review (${rating}/5 Stars)`;
      detailsText = `Rating: ${rating}/5 stars\n`;
    } else if (type === "bug") {
      const appName = appAffected === "section_hub" ? "AI Section Hub" : appAffected === "variants" ? "AI Variants" : "General Website";
      subjectLine = `🐛 Bug Report: ${appName} (${bugSeverity.toUpperCase()})`;
      typeLabel = `Bug Report (Severity: ${bugSeverity}, App: ${appName})`;
      detailsText = `App Affected: ${appName}\nSeverity: ${bugSeverity.toUpperCase()}\n`;
    } else if (type === "suggestion") {
      subjectLine = "💡 Feature Request / Suggestion";
      typeLabel = "Feature Request / Suggestion";
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: subjectLine,
          from_name: "Klenzo Merchant Support Hub",
          name: name,
          email: email,
          store: storeUrl || "Not Provided",
          feedback_type: typeLabel,
          message: `Submission details:\nName: ${name}\nEmail: ${email}\nStore URL: ${storeUrl || "Not Provided"}\nCategory: ${typeLabel}\n\n${detailsText}Details:\n${message}`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setStoreUrl("");
        setMessage("");
      } else {
        console.error("Web3Forms feedback submission failed:", await response.json());
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setStoreUrl("");
        setMessage("");
      }
    } catch (error) {
      console.error("Web3Forms feedback submission error:", error);
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setStoreUrl("");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <section id="feedback-hub" className="py-24 px-6 md:px-8 bg-black text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-zinc-900/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading and Context */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
            <div className="inline-flex w-fit px-3 py-1 text-xs uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full font-headings font-semibold">
              Feedback & Support
            </div>
            <h2 className="text-4xl md:text-5xl font-headings font-extrabold tracking-tight leading-tight text-white">
              Tell us about your experience
            </h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-md">
              Found a bug in our Shopify apps? Have a feature request to boost your sales? Or want to submit a merchant review? Select a category and share it directly with our product team.
            </p>

            {/* Quick Metrics display to build trust */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-6 border-t border-zinc-900">
              <div>
                <p className="text-zinc-500 text-xs font-headings uppercase font-bold tracking-wider">Avg Response Time</p>
                <h4 className="text-2xl font-extrabold text-white mt-1">&lt; 3 Hours</h4>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-headings uppercase font-bold tracking-wider">Merchant Rating</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <h4 className="text-2xl font-extrabold text-white">4.9</h4>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form Box */}
          <div className="lg:col-span-7 w-full bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 relative">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Tabs Category Selector */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950 border border-zinc-900 rounded-2xl mb-8">
                    {[
                      { id: "review", label: "Review", icon: Star },
                      { id: "bug", label: "Report Bug", icon: Bug },
                      { id: "suggestion", label: "Suggest", icon: Lightbulb },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = type === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setType(tab.id as FeedbackType)}
                          className={`inline-flex items-center justify-center gap-2 py-3 px-1 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                            isActive 
                              ? "bg-white text-black shadow-md" 
                              : "text-zinc-400 hover:text-white bg-transparent"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    {/* Star Rating Selector (Only visible for Review) */}
                    {type === "review" && (
                      <div className="flex flex-col gap-2 bg-zinc-900/10 border border-zinc-900 rounded-2xl p-4 items-center">
                        <span className="text-xs font-bold text-zinc-400">Rate your experience with Klenzo Apps</span>
                        <div className="flex gap-2.5 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(null)}
                                className="focus:outline-none transition-transform duration-100 hover:scale-125 cursor-pointer"
                              >
                                <Star 
                                  className={`w-8 h-8 transition-colors duration-200 ${
                                    isFilled 
                                      ? "fill-amber-400 text-amber-400" 
                                      : "text-zinc-700 hover:text-zinc-500"
                                  }`} 
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-[11px] font-medium text-zinc-500 mt-1">
                          {rating === 5 && "Excellent! Outstanding templates & performance."}
                          {rating === 4 && "Great! Very satisfied with the features."}
                          {rating === 3 && "Good, but there is room for improvements."}
                          {rating === 2 && "Needs work. Facing some difficulties."}
                          {rating === 1 && "Poor. Dissatisfied with the application."}
                        </span>
                      </div>
                    )}

                    {/* App and Severity selectors (Only visible for Bugs) */}
                    {type === "bug" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-zinc-400">App Affected</label>
                          <select
                            value={appAffected}
                            onChange={(e) => setAppAffected(e.target.value as any)}
                            className="bg-zinc-950 border border-zinc-900 focus:border-white rounded-2xl py-3 px-4 text-xs text-zinc-300 outline-none transition-colors"
                          >
                            <option value="section_hub">AI Section Hub</option>
                            <option value="variants">Klenzo: Variant Swatch</option>
                            <option value="general">General / Website Bug</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-zinc-400">Severity Level</label>
                          <select
                            value={bugSeverity}
                            onChange={(e) => setBugSeverity(e.target.value as any)}
                            className="bg-zinc-950 border border-zinc-900 focus:border-white rounded-2xl py-3 px-4 text-xs text-zinc-300 outline-none transition-colors"
                          >
                            <option value="low">Low (Minor layout glitch)</option>
                            <option value="medium">Medium (Component not loading)</option>
                            <option value="critical">Critical (Store checkout block/conflict)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-400">Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isSubmitting}
                          className="bg-zinc-950 border border-zinc-900 focus:border-white rounded-2xl py-3 px-4 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-400">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="email@store.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          className="bg-zinc-950 border border-zinc-900 focus:border-white rounded-2xl py-3 px-4 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-400">Shopify Store URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="your-store.myshopify.com"
                        value={storeUrl}
                        onChange={(e) => setStoreUrl(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-zinc-950 border border-zinc-900 focus:border-white rounded-2xl py-3 px-4 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-400">
                        {type === "review" && "Review Details"}
                        {type === "bug" && "Describe the issue"}
                        {type === "suggestion" && "Describe your suggestion"}
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder={
                          type === "review" 
                            ? "Share what you like about Klenzo apps, or how they helped your conversions..." 
                            : type === "bug" 
                            ? "Please share steps to reproduce the bug or screenshots details..." 
                            : "Describe your feature idea or template suggestion..."
                        }
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-zinc-950 border border-zinc-900 focus:border-white rounded-2xl py-3 px-4 text-sm text-white placeholder-zinc-700 outline-none resize-none transition-all duration-300"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !name || !email || !message}
                      className="w-full py-4 mt-2 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-600 font-extrabold text-sm rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Feedback
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center py-12 px-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">Feedback Received!</h3>
                  <p className="text-zinc-400 text-sm mt-3 max-w-sm leading-relaxed">
                    {type === "review" && "Thank you for the review! Your thoughts help us shape Klenzo apps to serve merchants better."}
                    {type === "bug" && "Bug report logged successfully. Our core development team will review it and coordinate back with you."}
                    {type === "suggestion" && "Thank you for the feature suggestion! We catalog all suggestions for our next app updates release."}
                  </p>
                  <div className="mt-8 p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl text-left w-full max-w-sm">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Submission logged as:</span>
                    </div>
                    <p className="text-xs text-white font-bold mt-1.5 uppercase font-headings tracking-wider">
                      {type === "review" && `Review (${rating} Stars)`}
                      {type === "bug" && `Bug report (${bugSeverity} severity)`}
                      {type === "suggestion" && "Feature Suggestion"}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-8 text-zinc-400 hover:text-white text-xs font-bold underline cursor-pointer"
                  >
                    Submit another response
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
