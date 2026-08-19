import Image from "next/image";
import { GoogleDots, ArrowRightIcon } from "./google-icons";

type HeroSectionProps = {
    isOpen: boolean;
    openAt: Date;
    closeAt: Date;
};

export function HeroSection({ isOpen, openAt, closeAt }: HeroSectionProps) {
    const formattedOpenDate = openAt.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const formattedCloseDate = closeAt.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <section className="relative w-full min-h-[100dvh] isolate flex items-center justify-center m-0 p-0 overflow-hidden">
            {/* 1. Fullscreen Cover Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/cover.png?v=4"
                    alt="GDGoC PTIT Fullscreen Cover Banner"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-center w-full h-full pointer-events-none"
                />
                {/* Subtle dark vignette on mobile for optimal text legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/45 pointer-events-none" />
            </div>

            {/* 2. Hero Text Displayed Directly on Cover */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-32 sm:pb-36 text-center flex flex-col items-center justify-center space-y-3.5 sm:space-y-5">
                {/* Main Title Directly on Cover with Black Drop Shadow */}
                <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-snug sm:leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)] max-w-4xl tracking-tight">
                    Trở thành thành viên của{" "}
                    <span className="text-[#FBBC05] drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
                        GDGoC ngay!
                    </span>
                </h1>

                {/* Timeline & Recruitment Window Status Badge */}
                <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-sm text-[11px] sm:text-sm font-semibold text-zinc-800 max-w-full text-center leading-normal">
                    <GoogleDots className="shrink-0" />
                    <span>
                        {isOpen ? (
                            <span>
                                <strong className="text-emerald-700 font-bold">Đang mở đơn:</strong>{" "}
                                <span className="whitespace-nowrap">{formattedOpenDate}</span> –{" "}
                                <span className="whitespace-nowrap">{formattedCloseDate}</span>
                            </span>
                        ) : (
                            <span className="text-zinc-600">
                                Thời gian nhận đơn:{" "}
                                <span className="whitespace-nowrap">{formattedOpenDate}</span> –{" "}
                                <span className="whitespace-nowrap">{formattedCloseDate}</span>
                            </span>
                        )}
                    </span>
                </div>

                {/* CTA Register Button */}
                <div className="pt-2 sm:pt-3 w-full flex justify-center">
                    <a
                        href="#apply"
                        className="w-full max-w-[280px] xs:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 px-7 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    >
                        <span>Đăng ký ứng tuyển</span>
                        <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                </div>
            </div>

            {/* 3. Scroll Down Indicator */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <a
                    href="#about"
                    aria-label="Cuộn xuống để xem thông tin chi tiết về GDGoC PTIT"
                    className="group flex flex-col items-center gap-1 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/30 hover:bg-black/45 backdrop-blur-md border border-white/20 text-white/90 hover:text-white transition-all duration-300 transform hover:translate-y-0.5"
                >
                    <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white/90">
                        Khám phá
                    </span>
                    <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>
        </section>
    );
}


