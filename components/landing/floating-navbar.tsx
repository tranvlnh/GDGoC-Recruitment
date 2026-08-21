"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function FloatingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const navLinks = [
        { name: "Về chúng tôi", href: "#about", id: "about" },
        { name: "Sứ mệnh", href: "#mission", id: "mission" },
        { name: "Ban chuyên môn", href: "#departments", id: "departments" },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();

        if (!id || id === "#" || id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", window.location.pathname);
            return;
        }

        const targetId = id.replace("#", "");
        const elem = document.getElementById(targetId);
        if (!elem) return;

        const navbarOffset = 80;
        const rect = elem.getBoundingClientRect();
        const elemTop = rect.top + window.scrollY;
        const elemHeight = elem.offsetHeight;
        const viewportHeight = window.innerHeight;

        let targetScroll: number;

        if (targetId === "apply") {
            // Form điền thông tin tuyển dụng: Luôn cuộn đến đầu section có trừ offset navbar
            targetScroll = elemTop - navbarOffset;
        } else {
            // Các section nội dung (About, Mission, Departments):
            // Căn giữa section vào màn hình nếu chiều cao vừa vặn để xem đầy đủ nhất
            if (elemHeight < viewportHeight - navbarOffset) {
                targetScroll = elemTop - (viewportHeight - elemHeight) / 2;
            } else {
                // Nếu section dài hơn chiều cao màn hình, cuộn tới đầu section
                targetScroll = elemTop - navbarOffset;
            }
        }

        window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: "smooth",
        });

        window.history.pushState(null, "", `#${targetId}`);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // If at the very top (Hero section), no section should be highlighted
            const heroThreshold = Math.min(window.innerHeight * 0.35, 300);
            if (window.scrollY < heroThreshold) {
                setActiveSection("");
                return;
            }

            // Viewport center reference for section activation
            const viewportCenter = window.innerHeight / 2;
            const sectionIds = ["departments", "mission", "about"];
            let current = "";

            for (const id of sectionIds) {
                const elem = document.getElementById(id);
                if (elem) {
                    const rect = elem.getBoundingClientRect();
                    if (rect.top <= viewportCenter && rect.bottom >= viewportCenter * 0.4) {
                        current = id;
                        break;
                    }
                }
            }

            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    return (
        <>
            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 lg:px-10 pointer-events-none transition-all duration-300">
                <nav
                    aria-label="Main Navigation"
                    className={`pointer-events-auto transition-all duration-300 rounded-full border px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 max-w-[1840px] mx-auto relative overflow-hidden ${scrolled
                        ? "bg-[#00092B]/85 backdrop-blur-xl border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(66,133,244,0.12)]"
                        : "bg-[#00092B]/40 backdrop-blur-md border-white/10 shadow-none"
                        }`}
                >
                    {/* Logo: Small on Mobile (< md), Full on Desktop (>= md) */}
                    <a
                        href="#"
                        onClick={(e) => scrollToSection(e, "top")}
                        aria-label="GDGoC PTIT - Trang chủ"
                        className="min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#00092B] rounded-lg flex items-center shrink-0 group transition-transform duration-200 hover:scale-[1.02]"
                    >
                        <div className="flex md:hidden items-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                            <Image
                                src="/logo_small.svg"
                                alt="GDGoC PTIT"
                                width={1125}
                                height={622}
                                priority
                                className="h-6 sm:h-7 w-auto object-contain"
                            />
                        </div>
                        <div className="hidden md:flex items-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                            <Image
                                src="/logo.svg"
                                alt="Google Developer Groups on Campus - PTIT"
                                width={642}
                                height={55}
                                priority
                                className="h-7 lg:h-8 w-auto object-contain"
                            />
                        </div>
                    </a>

                    {/* Right Group: Desktop Nav Links with ScrollSpy */}
                    <div className="hidden md:flex items-center gap-3 lg:gap-5">
                        <div className="flex items-center gap-1 lg:gap-1.5 p-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-sm">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.id;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.id)}
                                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${isActive
                                            ? "text-white bg-[#4285F4]/25 border border-[#4285F4]/50 shadow-[0_0_12px_rgba(66,133,244,0.35)]"
                                            : "text-zinc-300 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Desktop CTA Button */}
                        <a
                            href="#apply"
                            onClick={(e) => scrollToSection(e, "apply")}
                            className="relative group inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#4285F4] to-[#1a73e8] hover:from-[#3b78e7] hover:to-[#1765cc] rounded-full shadow-[0_0_18px_rgba(66,133,244,0.4)] hover:shadow-[0_0_24px_rgba(66,133,244,0.6)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shrink-0 border border-blue-400/30"
                        >
                            <span>Đăng ký ngay</span>
                        </a>
                    </div>

                    {/* Mobile Right Group: Register Button & Hamburger Menu Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <a
                            href="#apply"
                            onClick={(e) => scrollToSection(e, "apply")}
                            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#4285F4] to-[#1a73e8] rounded-full shadow-[0_0_12px_rgba(66,133,244,0.35)] active:scale-95 transition-all shrink-0 border border-blue-400/30"
                        >
                            <span>Đăng ký</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="shrink-0 p-1.5 sm:p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                            aria-label="Mở danh mục điều hướng"
                            aria-expanded={mobileMenuOpen}
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="pointer-events-auto md:hidden mt-2.5 p-3.5 bg-[#00092B]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(66,133,244,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-1.5">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.id;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        onClick={(e) => {
                                            setMobileMenuOpen(false);
                                            scrollToSection(e, link.id);
                                        }}
                                        className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-between ${isActive
                                            ? "text-white bg-[#4285F4]/20 border border-[#4285F4]/40 shadow-[0_0_12px_rgba(66,133,244,0.25)]"
                                            : "text-zinc-300 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        <span>{link.name}</span>
                                        {isActive && <span className="w-2 h-2 rounded-full bg-[#4285F4] shadow-[0_0_8px_#4285F4]" />}
                                    </a>
                                );
                            })}
                            <div className="pt-2.5 mt-1 border-t border-white/10">
                                <a
                                    href="#apply"
                                    onClick={(e) => {
                                        setMobileMenuOpen(false);
                                        scrollToSection(e, "apply");
                                    }}
                                    className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#4285F4] to-[#1a73e8] hover:from-[#3b78e7] hover:to-[#1765cc] rounded-xl shadow-[0_0_18px_rgba(66,133,244,0.4)] transition-all"
                                >
                                    <span>Đăng ký thành viên</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
