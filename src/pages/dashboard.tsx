import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Header1 } from "@/components/ui/header";
import { MinimalFooter } from "@/components/ui/minimal-footer";
import { 
  LogOut, User, Sparkles, LayoutDashboard, ShieldCheck, 
  Store, Plus, ArrowUpRight, Check, Key, Activity, 
  Zap, Copy, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackStoreConnection, trackEvent } from "@/components/ui/AnalyticsTracker";
import { updateUserShopUrl } from "@/lib/blogStore";
import { useSEO } from "@/lib/useSEO";

export function DashboardPage() {
  const { user, logout } = useAuth();

  // ✅ SEO: noindex — protected app page, no crawl value
  useSEO({
    title: "Merchant Console — Mitul Dashboard",
    description: "Manage your Shopify apps, API credentials, and store connections from the Merchant Console.",
    canonical: "https://klenzo.app/dashboard",
    noIndex: true,
  });

  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<"overview" | "apps" | "credentials" | "activity">("overview");

  // Store Connection simulation state
  const [shopUrl, setShopUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedStoreName, setConnectedStoreName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load store connection from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("connected_store_url");
    const savedName = localStorage.getItem("connected_store_name");
    if (savedUrl && savedName) {
      setShopUrl(savedUrl);
      setConnectedStoreName(savedName);
      setIsConnected(true);
    }
  }, []);

  const handleConnectStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopUrl) return;
    
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      // Extract clean name
      const cleanName = shopUrl.replace("https://", "").replace("http://", "").split(".")[0];
      const parsedStoreName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + " Store";
      setConnectedStoreName(parsedStoreName);
      localStorage.setItem("connected_store_url", shopUrl);
      localStorage.setItem("connected_store_name", parsedStoreName);
      trackStoreConnection(parsedStoreName, true);
      if (user?.email) {
        updateUserShopUrl(user.email, shopUrl);
      }
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShopUrl("");
    setConnectedStoreName("");
    localStorage.removeItem("connected_store_url");
    localStorage.removeItem("connected_store_name");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    trackEvent('API Key', 'Copy Key', id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden">
      <Header1 />

      {/* Decorative Glowing Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-zinc-800/10 blur-[130px] pointer-events-none" />

      <main className="flex-grow pt-28 md:pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8"
        >
          {/* Dashboard Header Bar */}
          <div className="flex flex-row justify-between items-center gap-4 border-b border-zinc-900 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-extrabold font-headings tracking-tight text-white leading-tight">Merchant Console</h1>
                <p className="text-zinc-500 text-xs md:text-sm mt-0.5 hidden sm:block">Manage and sync your Shopify applications for your store</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs md:text-sm rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-md cursor-pointer group shrink-0"
            >
              <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-400 transition-colors" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex gap-1.5 p-1.5 bg-zinc-950 border border-zinc-900 rounded-2xl w-full overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "apps", label: "Apps Status", icon: Store },
              { id: "credentials", label: "API & Webhooks", icon: Key },
              { id: "activity", label: "Sync Logs", icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap flex-1 justify-center ${
                    isActive 
                      ? "bg-white text-black shadow-lg" 
                      : "text-zinc-400 hover:text-white bg-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <>
                  {/* Profile card — visible only on mobile, at top */}
                  <div className="lg:hidden col-span-1 bg-zinc-950 border border-zinc-900 rounded-3xl p-5 shadow-md flex flex-row items-center gap-4">
                    <div className="shrink-0">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="w-14 h-14 rounded-full border-2 border-zinc-800 object-cover shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center">
                          <User className="w-6 h-6 text-zinc-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-base font-bold text-white truncate">{user?.name || "Merchant"}</h3>
                      <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-zinc-400">Google Authenticated</span>
                      </div>
                    </div>
                  </div>

                  {/* Left Column stats & store builder */}
                  <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                    
                    {/* Live metrics widgets */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                      {[
                        { 
                          title: "Store Conversions", 
                          value: isConnected ? "3.48%" : "—", 
                          trend: isConnected ? "+1.2%" : "Pending", 
                          trendColor: isConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-900 text-zinc-500 border-zinc-800",
                          sub: isConnected ? "Avg conversion lift" : "Link store to track conversions" 
                        },
                        { 
                          title: "Active Sections", 
                          value: isConnected ? "14 / 100+" : "0 / 100+", 
                          trend: isConnected ? "Live" : "Inactive", 
                          trendColor: isConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-900 text-zinc-500 border-zinc-800",
                          sub: isConnected ? "Compiled templates" : "Link store to compile templates" 
                        },
                        { 
                          title: "Monthly Syncs", 
                          value: isConnected ? "142,852" : "—", 
                          trend: isConnected ? "100%" : "0%", 
                          trendColor: isConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-900 text-zinc-500 border-zinc-800",
                          sub: isConnected ? "Asynchronous webhook triggers" : "Link store to log webhooks" 
                        }
                      ].map((stat, i) => (
                        <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 md:p-6 shadow-md relative overflow-hidden">
                          <p className="text-zinc-500 text-[10px] md:text-xs font-medium uppercase tracking-wider">{stat.title}</p>
                          <div className="flex items-baseline justify-between mt-3">
                            <h4 className="text-xl md:text-2xl font-extrabold text-white">{stat.value}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stat.trendColor}`}>
                              {stat.trend}
                            </span>
                          </div>
                          <p className="text-[10px] md:text-[11px] text-zinc-500 mt-2">{stat.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Store Connector box */}
                    <div 
                      className="bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 border border-zinc-800/80 rounded-3xl p-5 md:p-8 shadow-xl relative"
                      style={{ boxShadow: "0 0 40px rgba(0,0,0,0.5)" }}
                    >
                      <h3 className="text-lg md:text-xl font-bold font-headings text-white flex items-center gap-3">
                        <Store className="w-5 h-5 text-zinc-400 shrink-0" />
                        {isConnected ? "Connected Shopify Store" : "Connect Shopify Store"}
                      </h3>
                      <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                        Enter your store URL to sync variants, swatches, and liquid section templates seamlessly.
                      </p>

                      <AnimatePresence mode="wait">
                        {!isConnected ? (
                          <motion.form 
                            key="form"
                            onSubmit={handleConnectStore}
                            className="flex flex-col gap-3 mt-6"
                          >
                            <input
                              type="text"
                              placeholder="my-cool-store.myshopify.com"
                              value={shopUrl}
                              onChange={(e) => setShopUrl(e.target.value)}
                              disabled={isConnecting}
                              className="w-full bg-zinc-900/60 hover:bg-zinc-900/80 border border-zinc-800 focus:border-zinc-700 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-300"
                            />
                            <button
                              type="submit"
                              disabled={isConnecting || !shopUrl}
                              className="w-full sm:w-auto sm:self-end px-6 py-3.5 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-600 font-extrabold text-sm rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                            >
                              {isConnecting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black" />
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  Link Store
                                </>
                              )}
                            </button>
                          </motion.form>
                        ) : (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 p-4 md:p-5 bg-emerald-950/20 border border-emerald-900/50 rounded-2xl flex flex-col gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">{connectedStoreName} Linked successfully</h4>
                                <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{shopUrl}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Live Syncing
                              </span>
                              <button
                                onClick={handleDisconnect}
                                className="text-zinc-500 hover:text-white text-xs font-bold underline cursor-pointer"
                              >
                                Disconnect
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* Right Column Profile — desktop only */}
                  <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
                    
                    {/* Profile Information */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-md text-center flex flex-col items-center">
                      <div className="relative mb-4 group">
                        <div className="absolute inset-0 bg-white/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        {user?.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-20 h-20 rounded-full border-2 border-zinc-800 object-cover shadow-lg relative"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center relative">
                            <User className="w-8 h-8 text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white">{user?.name || "Merchant"}</h3>
                      <p className="text-zinc-500 text-xs mt-1">{user?.email}</p>

                      <div className="w-full border-t border-zinc-900 mt-6 pt-6 flex flex-col gap-4 text-left">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Google Authenticated Session</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{isConnected ? "App Subscription active" : "Subscription pending connection"}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              )}

              {/* Tab 2: Apps Status */}
              {activeTab === "apps" && (
                <div className="lg:col-span-12 bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
                  <h3 className="text-xl font-bold font-headings text-white mb-6">Installed Applications</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* App 1 */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-bold font-headings">
                            SV
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isConnected 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-zinc-900 text-zinc-500 border-zinc-800"
                          }`}>
                            {isConnected ? "Connected" : "Not Connected"}
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-white mt-4">AI Section Hub</h4>
                        <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                          Synchronizes custom FAQ accordions, shoppable image/video reels, and direct liquid modules directly into the native theme manager.
                        </p>
                      </div>
                      {isConnected ? (
                        <a 
                          href="https://apps.shopify.com/ai-section-hub" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 text-white hover:text-zinc-300 font-bold text-xs mt-6 group w-fit"
                        >
                          Launch Configurator
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      ) : (
                        <button 
                          disabled
                          className="inline-flex items-center gap-2 text-zinc-600 font-bold text-xs mt-6 cursor-not-allowed w-fit"
                        >
                          Awaiting Store Connection
                        </button>
                      )}
                    </div>

                    {/* App 2 */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold font-headings">
                            AV
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isConnected 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-zinc-900 text-zinc-500 border-zinc-800"
                          }`}>
                            {isConnected ? "Connected" : "Not Connected"}
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-white mt-4">Variant Swatch</h4>
                        <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                          Replaces standard selector selectors on product detail screens with visual color grids and image swatches using AI mapping auto-detectors.
                        </p>
                      </div>
                      {isConnected ? (
                        <a 
                          href="https://apps.shopify.com/klenzo-product-variant-swatch" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 text-white hover:text-zinc-300 font-bold text-xs mt-6 group w-fit"
                        >
                          Configure Swatches
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      ) : (
                        <button 
                          disabled
                          className="inline-flex items-center gap-2 text-zinc-600 font-bold text-xs mt-6 cursor-not-allowed w-fit"
                        >
                          Awaiting Store Connection
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: API & Credentials */}
              {activeTab === "credentials" && (
                <div className="lg:col-span-12 bg-zinc-950 border border-zinc-900 rounded-3xl p-8 flex flex-col gap-8">
                  <div>
                    <h3 className="text-xl font-bold font-headings text-white">API Credentials</h3>
                    <p className="text-zinc-500 text-xs mt-1.5">Use your API tokens to trigger automated external updates or integrate with custom headless systems.</p>
                  </div>

                  {isConnected ? (
                    <div className="flex flex-col gap-6">
                      {[
                        { label: "Public Publishable Token", val: `pk_live_mitul_${connectedStoreName.toLowerCase().replace(/[^a-z0-9]/g, "") || "store"}_51782390aefd9021e1` },
                        { label: "Webhook Integration Secret", val: "whsec_908facc12019abddcc2a" }
                      ].map((key, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                          <span className="text-xs font-bold text-zinc-400">{key.label}</span>
                          <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-3 md:p-4">
                            <code className="text-xs text-zinc-300 font-mono flex-grow select-all overflow-hidden text-ellipsis whitespace-nowrap min-w-0">{key.val}</code>
                            <button
                              onClick={() => copyToClipboard(key.val, key.label)}
                              className="w-9 h-9 rounded-xl hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors duration-200 shrink-0 cursor-pointer"
                            >
                              {copiedKey === key.label ? (
                                <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-zinc-800/50 rounded-2xl flex flex-col items-center justify-center gap-3">
                      <Key className="w-8 h-8 text-zinc-600" />
                      <h4 className="text-sm font-bold text-white">No API Credentials Generated</h4>
                      <p className="text-zinc-500 text-xs max-w-sm">Please connect your Shopify store to generate publishable API tokens and webhook secrets.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Sync Logs */}
              {activeTab === "activity" && (
                <div className="lg:col-span-12 bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
                  <h3 className="text-xl font-bold font-headings text-white mb-6">Recent Activity Logs</h3>
                  
                  {isConnected ? (
                    <div className="flex flex-col gap-4">
                      {[
                        { action: "Webhook trigger success", detail: `Synchronized 14 sections on ${connectedStoreName || "main"} theme`, time: "Just now", status: "success" },
                        { action: "AI Swatches detect success", detail: "Color nodes loaded for Olive Green and Charcoal Gray", time: "5 minutes ago", status: "success" },
                        { action: "Token initialization success", detail: "Google credential login session validated", time: "1 hour ago", status: "success" },
                      ].map((log, i) => (
                        <div key={i} className="flex justify-between items-start gap-3 p-4 bg-zinc-900/25 border border-zinc-900 rounded-xl">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                              <Zap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white">{log.action}</h4>
                              <p className="text-zinc-500 text-[10px] mt-0.5 break-words">{log.detail}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-medium shrink-0 mt-0.5">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-zinc-800/50 rounded-2xl flex flex-col items-center justify-center gap-3">
                      <Activity className="w-8 h-8 text-zinc-600" />
                      <h4 className="text-sm font-bold text-white">No Activity Logs Found</h4>
                      <p className="text-zinc-500 text-xs max-w-sm">Connect a Shopify store to view real-time sync histories, API webhook events, and Liquid template compile logs.</p>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </motion.div>
      </main>

      <MinimalFooter />
    </div>
  );
}
