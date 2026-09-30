import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";

import logo1 from "@/app logo/logo1.png"
import shopifyBadge from "@/images/shopify badge.png"
import { useAuth } from "@/context/AuthContext";
import { clearAnalyticsUserContext } from "@/components/ui/AnalyticsTracker";

function Header1() {
    const navigationItems = [
        {
            title: "Home",
            href: "/",
            description: "",
        },
        {
            title: "Company",
            description: "Learn more about Klenzo, tutorials, community and merchant resources.",
            items: [
                {
                    title: "About us",
                    href: "/about",
                },
                {
                    title: "Connect with us",
                    href: "/connect",
                },
                {
                    title: "Contact us",
                    href: "/contact",
                },
                {
                    title: "FAQs",
                    href: "/faq",
                },
                {
                    title: "User Guide",
                    href: "/guide",
                },
            ],
        },
        {
            title: "Work",
            description: "Explore our production-ready Shopify apps and 3D client store websites.",
            items: [
                {
                    title: "Shopify Apps",
                    href: "/shopify-apps",
                },
                {
                    title: "Shopify Websites",
                    href: "/shopify-website",
                },
            ],
        },
        {
            title: "About us",
            href: "/about",
            description: "",
        },
        {
            title: "Contact us",
            href: "/contact",
            description: "",
        },
    ];

    const [isOpen, setOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { token, user, logout } = useAuth();

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);
    const isDarkPage = location.pathname === '/about' || 
      location.pathname === '/connect' || 
      location.pathname === '/contact' || 
      location.pathname === '/privacy' || 
      location.pathname === '/terms' || 
      location.pathname.startsWith('/guide') || 
      location.pathname === '/faq' || 
      location.pathname === '/login' || 
      location.pathname === '/dashboard' ||
      location.pathname.startsWith('/shopify-website') ||
      location.pathname.startsWith('/shopify-app');

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80 && !isOpen) {
                // Scrolling down - hide header
                setVisible(false);
            } else {
                // Scrolling up - show header
                setVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isOpen]);

    return (
        <header className={`w-full z-40 fixed top-0 left-0 transition-all duration-300 ease-in-out ${
            isDarkPage 
              ? "bg-zinc-950/80 border-b border-zinc-850/80 text-white backdrop-blur-md" 
              : "bg-background border-b border-border text-foreground"
        } ${
            visible ? "translate-y-0" : "-translate-y-full"
        }`}>
            <div className="container relative mx-auto min-h-20 flex justify-between items-center px-4 lg:px-6">
                {/* Logo on Left */}
                <div className="flex items-center shrink-0">
                    <Link to="/" className="cursor-pointer flex items-center">
                        <img 
                            src={logo1} 
                            alt="App Logo" 
                            className="h-12 md:h-14 w-auto object-contain" 
                            style={{ filter: isDarkPage ? 'invert(0)' : 'invert(1)' }} 
                        />
                    </Link>
                </div>

                {/* Desktop Navigation in Center */}
                <div className="justify-center items-center lg:flex hidden flex-row flex-1 mx-2 xl:mx-6">
                    <NavigationMenu className="flex justify-center items-center max-w-full">
                        <NavigationMenuList className="flex justify-center gap-1 xl:gap-2 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.href ? (
                                        <>
                                            <NavigationMenuLink asChild>
                                                <Link to={item.href}>
                                                    <Button 
                                                        variant="ghost"
                                                        className={`font-headings text-sm px-2.5 xl:px-3 ${isDarkPage ? "text-zinc-200 hover:text-white hover:bg-zinc-900" : ""}`}
                                                    >
                                                        {item.title}
                                                    </Button>
                                                </Link>
                                            </NavigationMenuLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger 
                                                className={`font-headings font-medium text-sm px-2.5 xl:px-3 ${
                                                    isDarkPage 
                                                      ? "text-zinc-200 hover:text-white hover:bg-zinc-900 bg-transparent focus:bg-transparent data-[state=open]:bg-zinc-900" 
                                                      : ""
                                                }`}
                                            >
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className={`!w-[450px] p-4 rounded-md border shadow-md ${
                                                isDarkPage 
                                                  ? "bg-zinc-950 border-zinc-800 text-zinc-100" 
                                                  : "bg-popover text-popover-foreground border-border"
                                            }`}>
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-base font-headings font-semibold">{item.title}</p>
                                                            <p className={`text-sm ${isDarkPage ? "text-zinc-400" : "text-muted-foreground"}`}>
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        <Button size="sm" className="mt-10" asChild>
                                                            <a href="mailto:mitulzalavadiya10@gmail.com">
                                                                Email us today
                                                            </a>
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col text-sm h-full justify-start gap-1">
                                                        {item.items?.map((subItem) => (
                                                            subItem.href.startsWith("http") ? (
                                                                <NavigationMenuLink
                                                                    asChild
                                                                    key={subItem.title}
                                                                >
                                                                    <a
                                                                        href={subItem.href}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={`flex flex-row justify-between items-center py-2 px-4 rounded transition-colors ${
                                                                            isDarkPage 
                                                                              ? "hover:bg-zinc-800/60 text-zinc-300 hover:text-white" 
                                                                              : "hover:bg-muted text-foreground"
                                                                        }`}
                                                                    >
                                                                        <span>{subItem.title}</span>
                                                                        <MoveRight className={`w-4 h-4 ${isDarkPage ? "text-zinc-500" : "text-muted-foreground"}`} />
                                                                    </a>
                                                                </NavigationMenuLink>
                                                            ) : (
                                                                <NavigationMenuLink
                                                                    asChild
                                                                    key={subItem.title}
                                                                >
                                                                    <Link
                                                                        to={subItem.href}
                                                                        className={`flex flex-row justify-between items-center py-2 px-4 rounded transition-colors ${
                                                                            isDarkPage 
                                                                              ? "hover:bg-zinc-800/60 text-zinc-300 hover:text-white" 
                                                                              : "hover:bg-muted text-foreground"
                                                                        }`}
                                                                    >
                                                                        <span>{subItem.title}</span>
                                                                        <MoveRight className={`w-4 h-4 ${isDarkPage ? "text-zinc-500" : "text-muted-foreground"}`} />
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            </NavigationMenuContent>
                                        </>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Actions on Right */}
                <div className="flex justify-end items-center gap-3 sm:gap-4 shrink-0 z-20">
                    <a href="https://apps.shopify.com/partners/solvify-tech2" target="_blank" rel="noopener noreferrer" className="hidden xl:inline-block">
                        <img src={shopifyBadge} alt="Shopify Badge" className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-300" />
                    </a>
                    {token && user ? (
                        /* ── Logged-in: Profile Avatar + Dropdown ── */
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-2.5 cursor-pointer group focus:outline-none"
                                aria-label="User menu"
                            >
                                {/* Avatar */}
                                {user.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={user.name}
                                        referrerPolicy="no-referrer"
                                        className="w-9 h-9 rounded-full border-2 border-zinc-700 group-hover:border-zinc-400 transition-all duration-200 object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-zinc-700 group-hover:border-zinc-400 flex items-center justify-center transition-all duration-200 shrink-0">
                                        <span className="text-white text-sm font-bold">
                                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    </div>
                                )}
                                {/* Name (hidden on small screens) */}
                                <span className={`hidden md:block text-sm font-semibold max-w-[100px] truncate transition-colors duration-200 ${isDarkPage ? "text-zinc-200 group-hover:text-white" : "text-foreground group-hover:text-black"}`}>
                                    {user.name?.split(" ")[0]}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 hidden md:block transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""} ${isDarkPage ? "text-zinc-400" : "text-muted-foreground"}`} />
                            </button>

                            {/* Dropdown menu */}
                            {profileDropdownOpen && (
                                <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                                    {/* User info row */}
                                    <div className="px-4 py-3 border-b border-zinc-800">
                                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                                        <p className="text-zinc-500 text-xs truncate mt-0.5">{user.email}</p>
                                    </div>
                                    {/* Console link */}
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setProfileDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors duration-150"
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                                        Console
                                    </Link>
                                    {/* Sign out */}
                                    <button
                                        onClick={() => {
                                            logout();
                                            clearAnalyticsUserContext();
                                            setProfileDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-900 transition-colors duration-150 cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── Not logged in: Login button ── */
                        <Link to="/login">
                            <Button size="lg" className="cursor-pointer font-bold bg-[#0B0B0B] hover:bg-zinc-900 text-white border border-zinc-800 hover:border-zinc-700 rounded-lg px-5 text-sm transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                                Login
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    <div className="flex lg:hidden items-center">
                        <Button 
                            variant="ghost" 
                            onClick={() => setOpen(!isOpen)} 
                            size="icon"
                            className={isDarkPage ? "text-white hover:bg-zinc-900" : ""}
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {isOpen && (
                        <div className={`absolute top-20 border-t flex flex-col w-full right-0 shadow-2xl py-6 px-6 gap-6 z-50 transition-all ${
                            isDarkPage 
                              ? "bg-zinc-950 border-zinc-800 text-white" 
                              : "bg-background border-border text-foreground"
                        }`}>
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        {item.href ? (
                                            item.href.startsWith("http") ? (
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setOpen(false)}
                                                    className={`flex justify-between items-center py-1 font-semibold ${
                                                        isDarkPage ? "text-zinc-100 hover:text-white" : "text-foreground"
                                                    }`}
                                                >
                                                    <span className="text-lg font-medium">{item.title}</span>
                                                    <MoveRight className={`w-4 h-4 stroke-1 ${isDarkPage ? "text-zinc-500" : "text-muted-foreground"}`} />
                                                </a>
                                            ) : (
                                                <Link
                                                    to={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className={`flex justify-between items-center py-1 font-semibold ${
                                                        isDarkPage ? "text-zinc-100 hover:text-white" : "text-foreground"
                                                    }`}
                                                >
                                                    <span className="text-lg font-medium">{item.title}</span>
                                                    <MoveRight className={`w-4 h-4 stroke-1 ${isDarkPage ? "text-zinc-500" : "text-muted-foreground"}`} />
                                                </Link>
                                            )
                                        ) : (
                                            <p className={`text-lg font-semibold ${isDarkPage ? "text-zinc-300" : "text-foreground"}`}>{item.title}</p>
                                        )}
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                subItem.href.startsWith("http") ? (
                                                    <a
                                                        key={subItem.title}
                                                        href={subItem.href}
                                                        onClick={() => setOpen(false)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex justify-between items-center pl-4 py-1.5 transition-colors ${
                                                            isDarkPage 
                                                              ? "text-zinc-400 hover:text-white" 
                                                              : "text-muted-foreground hover:text-foreground"
                                                        }`}
                                                    >
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                        <MoveRight className="w-4 h-4 stroke-1 opacity-60" />
                                                    </a>
                                                ) : (
                                                    <Link
                                                        key={subItem.title}
                                                        to={subItem.href}
                                                        onClick={() => setOpen(false)}
                                                        className={`flex justify-between items-center pl-4 py-1.5 transition-colors ${
                                                            isDarkPage 
                                                              ? "text-zinc-400 hover:text-white" 
                                                              : "text-muted-foreground hover:text-foreground"
                                                        }`}
                                                    >
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                        <MoveRight className="w-4 h-4 stroke-1 opacity-60" />
                                                    </Link>
                                                )
                                            ))}
                                    </div>
                                </div>
                            ))}
                            <div className="border-t border-zinc-800 pt-4 mt-2">
                                 {token && user ? (
                                     <div className="flex flex-col gap-2">
                                         {/* Mobile profile info */}
                                         <div className="flex items-center gap-3 py-2">
                                             {user.picture ? (
                                                 <img
                                                     src={user.picture}
                                                     alt={user.name}
                                                     referrerPolicy="no-referrer"
                                                     className="w-10 h-10 rounded-full border-2 border-zinc-700 object-cover shrink-0"
                                                 />
                                             ) : (
                                                 <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center shrink-0">
                                                     <span className="text-white font-bold">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
                                                 </div>
                                             )}
                                             <div className="flex flex-col min-w-0">
                                                 <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                                                 <span className="text-xs text-zinc-500 truncate">{user.email}</span>
                                             </div>
                                         </div>
                                         <Link
                                             to="/dashboard"
                                             onClick={() => setOpen(false)}
                                             className="flex justify-between items-center py-2"
                                         >
                                             <span className="text-lg font-medium text-emerald-400">Console</span>
                                             <MoveRight className="w-4 h-4 stroke-1 text-emerald-400" />
                                         </Link>
                                         <button
                                             onClick={() => {
                                                 logout();
                                                 clearAnalyticsUserContext();
                                                 setOpen(false);
                                             }}
                                             className="w-full text-left py-2 text-red-400 font-medium text-lg cursor-pointer"
                                         >
                                             Sign Out
                                         </button>
                                     </div>
                                 ) : (
                                     <Link
                                         to="/login"
                                         onClick={() => setOpen(false)}
                                         className="flex justify-between items-center py-2"
                                     >
                                         <span className="text-lg font-medium text-white">Login</span>
                                         <MoveRight className="w-4 h-4 stroke-1 text-white" />
                                     </Link>
                                 )}
                             </div>
                        </div>
                    )}
            </div>
        </header>
    );
}

export { Header1 };
