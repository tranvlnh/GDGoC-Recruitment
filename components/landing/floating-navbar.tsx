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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // If at the very top (Hero section), no section should be highlighted
            const aboutElem = document.getElementById("about");
            const threshold = Math.min(window.innerHeight * 0.35, 300);

            if (aboutElem) {
                const aboutRect = aboutElem.getBoundingClientRect();
                if (aboutRect.top > threshold) {
                    setActiveSection("");
                    return;
                }
            }

            // Check sections from bottom to top so the lowest currently visible section wins
            const sectionIds = ["departments", "mission", "about"];
            let current = "";

            for (const id of sectionIds) {
                const elem = document.getElementById(id);
                if (elem) {
                    const rect = elem.getBoundingClientRect();
                    if (rect.top <= threshold) {
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
                    className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs transition-opacity md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 lg:px-10 pointer-events-none">
                <nav
                    aria-label="Main Navigation"
                    className={`pointer-events-auto transition-all duration-300 rounded-full border px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 max-w-[1840px] mx-auto ${scrolled
                        ? "bg-white/90 backdrop-blur-lg border-zinc-200/90 shadow-lg shadow-zinc-900/5"
                        : "bg-white/5 backdrop-blur-sm border-white/10 shadow-none"
                        }`}
                >
                    {/* Logo: Small on Mobile (< md), Full on Desktop (>= md) */}
                    <a
                        href="#"
                        aria-label="GDGoC PTIT - Trang chủ"
                        className="min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg flex items-center shrink-0"
                    >
                        <div className="flex md:hidden items-center">
                            <Image
                                src="/logo_small.svg"
                                alt="GDGoC PTIT"
                                width={1125}
                                height={622}
                                priority
                                className="h-6 sm:h-7 w-auto object-contain"
                            />
                        </div>
                        <div className="hidden md:flex items-center">
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
                        <div className="flex items-center gap-1 lg:gap-1.5">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.id;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${isActive
                                            ? "text-[#4285F4] bg-blue-50/80 shadow-2xs font-bold"
                                            : scrolled
                                                ? "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70"
                                                : "text-white/90 hover:text-white hover:bg-white/10"
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
                            className="inline-flex items-center justify-center px-4.5 py-2 text-sm font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-full shadow-sm hover:shadow-md hover:shadow-blue-500/25 transition-all active:scale-95 shrink-0"
                        >
                            <span>Đăng ký ngay</span>
                        </a>
                    </div>

                    {/* Mobile Right Group: Register Button & Hamburger Menu Button */}
                    <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
                        <a
                            href="#apply"
                            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-full shadow-xs hover:shadow-sm active:scale-95 transition-all shrink-0"
                        >
                            <span>Đăng ký</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`shrink-0 p-1.5 sm:p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${scrolled
                                ? "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                                : "text-white hover:bg-white/10"
                                }`}
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
                    <div className="pointer-events-auto md:hidden mt-2 p-4 bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.id;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-between ${isActive
                                            ? "text-[#4285F4] bg-blue-50/80 font-bold"
                                            : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
                                            }`}
                                    >
                                        <span>{link.name}</span>
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />}
                                    </a>
                                );
                            })}
                            <div className="pt-2 mt-1 border-t border-zinc-100">
                                <a
                                    href="#apply"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-xl shadow-sm transition-all"
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
