import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { Header1 } from "@/components/ui/header";
import { MinimalFooter } from "@/components/ui/minimal-footer";
import { ShieldAlert, ArrowLeft, Mail, Lock, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackAuthAction, trackEvent } from "@/components/ui/AnalyticsTracker";
import { useSEO } from "@/lib/useSEO";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ SEO: noindex — auth page has no crawl value
  useSEO({
    title: "Login — Klenzo Merchant Console",
    description: "Sign in to your Klenzo Merchant Console to manage AI Section Hub and Klenzo: Variant Swatch for your Shopify store.",
    canonical: "https://klenzo.app/login",
    noIndex: true,
  });
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    if (credentialResponse.credential) {
      const success = await login(credentialResponse.credential);
      if (success) {
        trackAuthAction('login', 'google');
        navigate("/dashboard");
      } else {
        setError("Failed to decode user credential profile.");
        trackEvent('Authentication', 'Login Failure', 'Google Token Decoding Error');
      }
    } else {
      setError("No user credentials received from Google.");
      trackEvent('Authentication', 'Login Failure', 'Missing Google Credentials');
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication process was interrupted or failed.");
    trackEvent('Authentication', 'Login Failure', 'Google OAuth Interrupted');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call for email/password authentication
    setTimeout(() => {
      setIsSubmitting(false);
      // For demonstration, create a dummy Google-like token and pass it to login
      const dummyPayload = {
        email: email,
        name: isSignUp ? name : email.split("@")[0],
        picture: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
      };
      // Encode dummy header.payload.signature
      const dummyHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const dummyBody = btoa(JSON.stringify(dummyPayload));
      const dummyToken = `${dummyHeader}.${dummyBody}.dummy-signature`;

      login(dummyToken);
      trackAuthAction(isSignUp ? 'sign_up' : 'login', 'email');
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden">
      <Header1 />

      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-zinc-800/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-zinc-700/10 blur-[120px] pointer-events-none" />

      <main className="flex-grow pt-36 pb-20 flex items-center justify-center px-6 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN — Brand Selling Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 hidden lg:flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 w-fit rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              Unified Merchant Center
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold font-headings text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tight leading-tight">
              Control Klenzo apps <br/>
              from a single dashboard
            </h1>
            
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
              Log in to sync your active Shopify stores, configure premium theme sections, design custom variants, and optimize conversion analytics in real time.
            </p>

            <ul className="flex flex-col gap-4 mt-4">
              {[
                "Real-time configuration syncing",
                "Instant section customization widgets",
                "Conversion analytics & store performance metrics",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-950 border border-zinc-800 text-emerald-400 shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT COLUMN — Unified Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 w-full max-w-md mx-auto"
          >
            {/* Back button */}
            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors duration-200 mb-6 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>

            {/* Glassmorphic Container */}
            <div 
              className="w-full bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 border border-zinc-800/80 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl relative"
              style={{
                boxShadow: "0 0 50px rgba(255, 255, 255, 0.02), 0 0 100px rgba(0, 0, 0, 0.8)"
              }}
            >
              <div className="text-center mb-8">
                <span className="inline-flex px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[10px] uppercase tracking-wider font-headings font-bold mb-3">
                  Klenzo Account
                </span>
                <h2 className="text-2xl font-bold font-headings text-white tracking-tight">
                  {isSignUp ? "Create your account" : "Welcome back"}
                </h2>
                <p className="text-zinc-500 text-xs mt-1.5">
                  {isSignUp 
                    ? "Get started with premium Shopify optimization" 
                    : "Sign in to manage your AI Shopify configurations"}
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-6 p-4 bg-red-950/20 border border-red-900/40 rounded-2xl flex items-start gap-3 text-red-400 text-xs"
                  >
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Input fields */}
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                
                {isSignUp && (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 border border-zinc-800 focus:border-zinc-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-300"
                    />
                  </div>
                )}

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="Merchant Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 border border-zinc-800 focus:border-zinc-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Account Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 border border-zinc-800 focus:border-zinc-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-300"
                  />
                </div>

                {!isSignUp && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-[11px] text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 font-extrabold text-sm rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg relative cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black" />
                  ) : isSignUp ? (
                    "Create Merchant Account"
                  ) : (
                    "Sign In with Email"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-grow h-[1px] bg-zinc-850" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">or continue with</span>
                <div className="flex-grow h-[1px] bg-zinc-850" />
              </div>

              {/* Google OAuth Login */}
              <div className="flex justify-center scale-105">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  width="280px"
                />
              </div>

              {/* Bottom Toggle mode link */}
              <p className="text-center text-xs text-zinc-500 mt-8">
                {isSignUp ? "Already have an account?" : "Don't have a merchant account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-white hover:underline font-bold transition-all cursor-pointer"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </motion.div>

        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}
