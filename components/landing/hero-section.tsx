"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { GoogleDots, ArrowRightIcon } from "./google-icons";

type HeroSectionProps = {
    isOpen?: boolean;
    openAt: Date | string;
    closeAt: Date | string;
};

type CountdownState = {
    status: "upcoming" | "open" | "closed";
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

function calculateTimeLeft(openDate: Date, closeDate: Date): CountdownState {
    const now = new Date();
    if (now < openDate) {
        const diff = Math.max(0, openDate.getTime() - now.getTime());
        return {
            status: "upcoming",
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    } else if (now <= closeDate) {
        const diff = Math.max(0, closeDate.getTime() - now.getTime());
        return {
            status: "open",
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    } else {
        return {
            status: "closed",
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }
}

export function HeroSection({ openAt, closeAt }: HeroSectionProps) {
    const openDate = new Date(openAt);
    const closeDate = new Date(closeAt);

    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<CountdownState>(() =>
        calculateTimeLeft(openDate, closeDate),
    );

    useEffect(() => {
        setMounted(true);
        const update = () => {
            setTimeLeft(calculateTimeLeft(new Date(openAt), new Date(closeAt)));
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [openAt, closeAt]);

    return (
        <section className="relative w-full min-h-[100dvh] isolate flex items-center justify-center m-0 p-0 overflow-hidden bg-[#00092B]">
            {/* 1. Fullscreen Cover Image (Responsive Mobile & Desktop) */}
            <div className="absolute inset-0 z-0">
                {/* Mobile Cover Image */}
                <Image
                    src="/cover_mobile.svg"
                    alt="GDGoC PTIT Mobile Cover Banner"
                    fill
                    priority
                    unoptimized
                    className="block sm:hidden object-cover object-center w-full h-full pointer-events-none"
                />
                {/* Desktop Cover Image */}
                <Image
                    src="/cover.svg"
                    alt="GDGoC PTIT Fullscreen Cover Banner"
                    fill
                    priority
                    unoptimized
                    className="hidden sm:block object-cover object-center w-full h-full pointer-events-none"
                />
                {/* Unified continuous vignette matching About and Mission */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/35 pointer-events-none" />
            </div>

            {/* 2. Hero Text Displayed Directly on Cover */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-32 sm:pb-36 text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-snug sm:leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)] max-w-4xl tracking-tight text-balance">
                    <span className="text-[0.85em] font-semibold text-white/90">
                        Trở thành thành viên của{" "}
                    </span>
                    <span className="font-black tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] text-white">
                        GDG on Campus: PTIT
                    </span>
                </h1>

                {/* Minimalist Countdown Timer with Google Colors */}
                <div className="w-full flex flex-col items-center my-6 sm:my-10 md:my-12">
                    <div className="inline-flex flex-col items-center transition-all">
                        {/* Compact Status Indicator */}
                        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5 text-xs sm:text-sm font-bold text-white">
                            {timeLeft.status === "upcoming" ? (
                                <>
                                    <span className="text-blue-300">Sắp mở đơn sau</span>
                                </>
                            ) : timeLeft.status === "open" ? (
                                <>
                                    <GoogleDots className="shrink-0 scale-90" />
                                </>
                            ) : (
                                <span className="text-rose-400 uppercase tracking-wide">Đã hết hạn nhận đơn</span>
                            )}
                        </div>

                        {/* Digit Blocks in Balanced 4 Google Iconic Colors */}
                        {timeLeft.status !== "closed" ? (
                            <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                                {/* 1. Ngày - Balanced Google Blue */}
                                <div
                                    className="flex flex-col items-center justify-center backdrop-blur-md rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 min-w-[54px] sm:min-w-[70px] border transition-all"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(66, 133, 244, 0.22) 0%, rgba(10, 20, 40, 0.7) 100%)",
                                        borderColor: "rgba(92, 160, 252, 0.7)",
                                        boxShadow: "0 0 16px rgba(92, 160, 252, 0.4)",
                                    }}
                                >
                                    <span
                                        className="font-mono text-2xl sm:text-4xl font-black tracking-tight leading-none"
                                        style={{
                                            color: "#5CA0FC",
                                            textShadow: "0 0 14px rgba(92, 160, 252, 0.6)",
                                        }}
                                    >
                                        {mounted ? String(timeLeft.days).padStart(2, "0") : "--"}
                                    </span>
                                    <span
                                        className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1"
                                        style={{ color: "#5CA0FC" }}
                                    >
                                        Ngày
                                    </span>
                                </div>

                                <span className="text-white/60 font-black text-lg sm:text-2xl -mt-3.5">:</span>

                                {/* 2. Giờ - Balanced Google Red */}
                                <div
                                    className="flex flex-col items-center justify-center backdrop-blur-md rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 min-w-[54px] sm:min-w-[70px] border transition-all"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(234, 67, 53, 0.22) 0%, rgba(40, 15, 15, 0.7) 100%)",
                                        borderColor: "rgba(252, 103, 98, 0.7)",
                                        boxShadow: "0 0 16px rgba(252, 103, 98, 0.4)",
                                    }}
                                >
                                    <span
                                        className="font-mono text-2xl sm:text-4xl font-black tracking-tight leading-none"
                                        style={{
                                            color: "#FC6762",
                                            textShadow: "0 0 14px rgba(252, 103, 98, 0.6)",
                                        }}
                                    >
                                        {mounted ? String(timeLeft.hours).padStart(2, "0") : "--"}
                                    </span>
                                    <span
                                        className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1"
                                        style={{ color: "#FC6762" }}
                                    >
                                        Giờ
                                    </span>
                                </div>

                                <span className="text-white/60 font-black text-lg sm:text-2xl -mt-3.5">:</span>

                                {/* 3. Phút - Balanced Google Yellow */}
                                <div
                                    className="flex flex-col items-center justify-center backdrop-blur-md rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 min-w-[54px] sm:min-w-[70px] border transition-all"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(251, 188, 5, 0.22) 0%, rgba(40, 32, 10, 0.7) 100%)",
                                        borderColor: "rgba(249, 188, 21, 0.7)",
                                        boxShadow: "0 0 16px rgba(249, 188, 21, 0.4)",
                                    }}
                                >
                                    <span
                                        className="font-mono text-2xl sm:text-4xl font-black tracking-tight leading-none"
                                        style={{
                                            color: "#F9BC15",
                                            textShadow: "0 0 14px rgba(249, 188, 21, 0.6)",
                                        }}
                                    >
                                        {mounted ? String(timeLeft.minutes).padStart(2, "0") : "--"}
                                    </span>
                                    <span
                                        className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1"
                                        style={{ color: "#F9BC15" }}
                                    >
                                        Phút
                                    </span>
                                </div>

                                <span className="text-white/60 font-black text-lg sm:text-2xl -mt-3.5">:</span>

                                {/* 4. Giây - Balanced Google Green */}
                                <div
                                    className="flex flex-col items-center justify-center backdrop-blur-md rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 min-w-[54px] sm:min-w-[70px] border transition-all"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(52, 168, 83, 0.22) 0%, rgba(15, 35, 20, 0.7) 100%)",
                                        borderColor: "rgba(70, 211, 108, 0.7)",
                                        boxShadow: "0 0 16px rgba(70, 211, 108, 0.4)",
                                    }}
                                >
                                    <span
                                        className="font-mono text-2xl sm:text-4xl font-black tracking-tight leading-none"
                                        style={{
                                            color: "#46D36C",
                                            textShadow: "0 0 14px rgba(70, 211, 108, 0.6)",
                                        }}
                                    >
                                        {mounted ? String(timeLeft.seconds).padStart(2, "0") : "--"}
                                    </span>
                                    <span
                                        className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1"
                                        style={{ color: "#46D36C" }}
                                    >
                                        Giây
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="px-3 py-1 text-center text-xs sm:text-sm font-medium text-white/80">
                                Hẹn gặp lại bạn vào đợt tuyển tiếp theo!
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA Register Button */}
                <div className="pt-8 sm:pt-14 md:pt-16 w-full flex justify-center">
                    <a
                        href="#apply"
                        className="w-full max-w-[280px] xs:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 px-7 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    >
                        <span>Đăng ký ứng tuyển</span>
                        <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
