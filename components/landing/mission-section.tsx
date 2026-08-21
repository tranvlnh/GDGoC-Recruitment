"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GoogleDots } from "./google-icons";

export interface PlanetPillar {
    id: string;
    name: string;
    title: string;
    tagline: string;
    description: string;
    color: string;
    colorKey: "blue" | "red" | "yellow" | "green";
    planetSvg: string;
    planetSize: string;
    positionClass: string;
    images: string[];
}

const PLANET_PILLARS: PlanetPillar[] = [
    {
        id: "learn",
        name: "Learn",
        title: "Learn",
        tagline: "Học hỏi & Thực chiến",
        description:
            "Ở GDG on Campus: PTIT, học tập là hành động. Thay vì chỉ lắng nghe, bạn sẽ được bắt tay vào làm, được thử nghiệm và sai sót trong một môi trường an toàn. Nắm vững công nghệ mới qua các dự án chuyên sâu, biến ý tưởng thành sản phẩm và học hỏi từ chính những thử thách thực tế là cách bạn sẽ tiến bộ tại đây.",
        color: "#4285F4",
        colorKey: "blue",
        planetSvg: "/planet4.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "top-1 left-4 sm:top-2 sm:left-6 md:top-3 md:left-8",
        images: ["/phase-3.png", "/phase-6.png"],
    },
    {
        id: "share",
        name: "Share",
        title: "Share",
        tagline: "Chia sẻ & Lan tỏa",
        description:
            "GDG on Campus: PTIT tin rằng giá trị của kiến thức nằm ở sự lan tỏa. Một văn hóa cởi mở được xây dựng, nơi mọi góc nhìn đều được tôn trọng và bất kỳ ai cũng có thể là người chia sẻ. Qua việc chia sẻ, bạn không chỉ giúp cộng đồng cùng phát triển mà còn củng cố kiến thức và xây dựng sự tự tin.",
        color: "#EA4335",
        colorKey: "red",
        planetSvg: "/planet6.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "top-1 right-4 sm:top-2 sm:right-6 md:top-3 md:right-8",
        images: ["/phase-4.png", "/phase-6.png"],
    },
    {
        id: "connect",
        name: "Connect",
        title: "Connect",
        tagline: "Kết nối & Mở rộng",
        description:
            "GDG on Campus: PTIT mở ra cánh cửa đến với một mạng lưới kết nối rộng lớn và giá trị. Đây không chỉ là nơi bạn tìm thấy những người bạn cùng chung đam mê, mà còn là cơ hội gặp gỡ các chuyên gia, diễn giả và tiếp cận cộng đồng Google Developer toàn cầu.",
        color: "#FBBC05",
        colorKey: "yellow",
        planetSvg: "/planet1.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "bottom-1 right-4 sm:bottom-2 sm:right-6 md:bottom-3 md:right-8",
        images: ["/phase-1.png", "/phase-5.png"],
    },
    {
        id: "grow",
        name: "Grow",
        title: "Grow",
        tagline: "Phát triển & Bứt phá",
        description:
            "Learn, Share, và Connect chính là ba mảnh ghép tạo nên sự trưởng thành toàn diện tại GDG on Campus: PTIT. GDG on Campus: PTIT sẽ là bệ phóng để biến tiềm năng của bạn thành những thành tựu thực sự, ghi dấu ấn trong hành trình sinh viên của mình.",
        color: "#34A853",
        colorKey: "green",
        planetSvg: "/planet5.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "bottom-1 left-4 sm:bottom-2 sm:left-6 md:bottom-3 md:left-8",
        images: ["/phase-2.png", "/phase-4.png"],
    },
];

const THEME_STYLES = {
    blue: {
        glow: "shadow-[0_0_55px_rgba(66,133,244,0.4)] border-[#4285F4]/60",
        badge: "bg-[#4285F4] text-white shadow-md shadow-blue-500/25",
        dotActive: "bg-[#4285F4]",
        planetHalo: "drop-shadow-[0_0_30px_rgba(66,133,244,0.9)]",
        border: "border-[#4285F4]/40",
    },
    red: {
        glow: "shadow-[0_0_55px_rgba(234,67,53,0.4)] border-[#EA4335]/60",
        badge: "bg-[#EA4335] text-white shadow-md shadow-red-500/25",
        dotActive: "bg-[#EA4335]",
        planetHalo: "drop-shadow-[0_0_30px_rgba(234,67,53,0.9)]",
        border: "border-[#EA4335]/40",
    },
    yellow: {
        glow: "shadow-[0_0_55px_rgba(251,188,5,0.4)] border-[#FBBC05]/60",
        badge: "bg-[#FBBC05] text-zinc-900 font-extrabold shadow-md shadow-amber-500/25",
        dotActive: "bg-[#FBBC05]",
        planetHalo: "drop-shadow-[0_0_30px_rgba(251,188,5,0.9)]",
        border: "border-[#FBBC05]/40",
    },
    green: {
        glow: "shadow-[0_0_55px_rgba(52,168,83,0.4)] border-[#34A853]/60",
        badge: "bg-[#34A853] text-white shadow-md shadow-emerald-500/25",
        dotActive: "bg-[#34A853]",
        planetHalo: "drop-shadow-[0_0_30px_rgba(52,168,83,0.9)]",
        border: "border-[#34A853]/40",
    },
};

export function MissionSection() {
    const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
    const [imageIndices, setImageIndices] = useState<number[]>([0, 0, 0, 0]);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    // Lightbox / Zoom Overlay State
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
    const [lightboxPillarIdx, setLightboxPillarIdx] = useState<number>(0);
    const [lightboxImgIdx, setLightboxImgIdx] = useState<number>(0);

    // Touch & Mouse Drag state for switching center photos without buttons
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const mouseStartX = useRef<number | null>(null);
    const mouseStartY = useRef<number | null>(null);
    const isMouseDown = useRef<boolean>(false);

    const activePillar = PLANET_PILLARS[activePillarIndex];
    const currentHeroImgIdx = imageIndices[activePillarIndex] || 0;

    const changePhoto = (pillarIdx: number, direction: "next" | "prev") => {
        setImageIndices((prev) => {
            const next = [...prev];
            const total = PLANET_PILLARS[pillarIdx].images.length;
            if (direction === "next") {
                next[pillarIdx] = (next[pillarIdx] + 1) % total;
            } else {
                next[pillarIdx] = (next[pillarIdx] - 1 + total) % total;
            }
            return next;
        });
    };

    const openZoom = () => {
        setLightboxPillarIdx(activePillarIndex);
        setLightboxImgIdx(imageIndices[activePillarIndex] || 0);
        setIsLightboxOpen(true);
    };

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsLightboxOpen(false);
            }
        };
        if (isLightboxOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isLightboxOpen]);

    // Auto-cycle missions (Learn -> Share -> Connect -> Grow) every 4.5 seconds
    useEffect(() => {
        if (isHovered || isLightboxOpen) return;

        const interval = setInterval(() => {
            setActivePillarIndex((prev) => (prev + 1) % PLANET_PILLARS.length);
            setImageIndices((prev) =>
                prev.map((currentIdx, pIdx) => {
                    const total = PLANET_PILLARS[pIdx].images.length;
                    return (currentIdx + 1) % total;
                })
            );
        }, 4500);

        return () => clearInterval(interval);
    }, [isHovered, isLightboxOpen]);

    // Touch gesture handlers for mobile swipe vs tap-to-zoom
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (pillarIdx: number, e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;

        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                changePhoto(pillarIdx, "next");
            } else {
                changePhoto(pillarIdx, "prev");
            }
        } else if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15) {
            openZoom();
        }
        touchStartX.current = null;
        touchStartY.current = null;
    };

    // Mouse drag handlers for desktop swipe vs click-to-zoom
    const handleMouseDown = (e: React.MouseEvent) => {
        mouseStartX.current = e.clientX;
        mouseStartY.current = e.clientY;
        isMouseDown.current = true;
    };

    const handleMouseUp = (pillarIdx: number, e: React.MouseEvent) => {
        if (!isMouseDown.current || mouseStartX.current === null || mouseStartY.current === null) return;
        const deltaX = e.clientX - mouseStartX.current;
        const deltaY = e.clientY - mouseStartY.current;

        if (Math.abs(deltaX) > 35) {
            if (deltaX < 0) {
                changePhoto(pillarIdx, "next");
            } else {
                changePhoto(pillarIdx, "prev");
            }
        } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            openZoom();
        }
        mouseStartX.current = null;
        mouseStartY.current = null;
        isMouseDown.current = false;
    };

    const activeLightboxPillar = PLANET_PILLARS[lightboxPillarIdx];
    const activeLightboxTheme = THEME_STYLES[activeLightboxPillar.colorKey];
    const totalLightboxImgs = activeLightboxPillar.images.length;

    const nextLightboxImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLightboxImgIdx((prev) => (prev + 1) % totalLightboxImgs);
    };

    const prevLightboxImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLightboxImgIdx((prev) => (prev - 1 + totalLightboxImgs) % totalLightboxImgs);
    };

    return (
        <section
            id="mission"
            className="py-16 sm:py-24 bg-[#00092B] text-white relative scroll-mt-20 overflow-hidden select-none"
        >
            {/* 1. Pure Background Cover Mission Image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <Image
                    src="/cover_mission.svg"
                    alt="GDGoC Mission Cosmic Background"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-center w-full h-full"
                />
                {/* Unified continuous vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/35 pointer-events-none" />
            </div>

            {/* Ambient Google Color Glows */}
            <div className="absolute top-1/3 -left-48 w-96 h-96 bg-[#4285F4]/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute top-1/3 -right-48 w-96 h-96 bg-[#EA4335]/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-[#34A853]/10 rounded-full blur-3xl pointer-events-none z-0" />

            {/* Compatibility anchor for old links */}
            <div id="activities" className="absolute -top-20 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-6 sm:space-y-8">
                {/* Section Header: Compact & Focused */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-xs">
                        <span>Sứ Mệnh • 4 Trụ Cột Phát Triển</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                        We <span className="text-[#4285F4] drop-shadow-[0_2px_12px_rgba(66,133,244,0.5)]">Learn</span>,{" "}
                        <span className="text-[#EA4335] drop-shadow-[0_2px_12px_rgba(234,67,53,0.5)]">Share</span>,{" "}
                        <span className="text-[#FBBC05] drop-shadow-[0_2px_12px_rgba(251,188,5,0.5)]">Connect</span> &{" "}
                        <span className="text-[#34A853] drop-shadow-[0_2px_12px_rgba(52,168,83,0.5)]">Grow</span>!
                    </h2>

                    <p className="text-xs sm:text-sm text-zinc-300 font-normal">
                        Khám phá 4 giá trị cốt lõi định hình hành trình học tập, sẻ chia và bứt phá của bạn tại GDG on Campus: PTIT!
                    </p>
                </div>

                {/* Solar Planetary Orbital Arena */}
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative w-full max-w-[560px] sm:max-w-[620px] md:max-w-[680px] aspect-square mx-auto flex items-center justify-center group"
                >
                    {/* A. CENTER HUB: Circular Photo Portal with Rotating Light Beam along border */}
                    <div className="relative z-20 flex items-center justify-center">
                        {/* Ambient Glow Aura Behind Circle */}
                        <div
                            className="absolute -inset-3 rounded-full blur-2xl opacity-40 pointer-events-none transition-colors duration-1000"
                            style={{ backgroundColor: activePillar.color }}
                        />

                        {/* Revolving Conic Light Beam Border Container */}
                        <div className="relative p-[3px] sm:p-[4px] rounded-full overflow-hidden flex items-center justify-center shadow-2xl">
                            {/* The light beam sweeping sequentially along the circumference */}
                            <div
                                className="absolute -inset-[100%] animate-border-beam pointer-events-none transition-all duration-1000"
                                style={{
                                    background: `conic-gradient(from 0deg, transparent 0%, transparent 25%, ${activePillar.color} 55%, #ffffff 70%, ${activePillar.color} 85%, transparent 100%)`,
                                }}
                            />

                            {/* Inner Circular Photo Portal */}
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={(e) => handleTouchEnd(activePillarIndex, e)}
                                onMouseDown={handleMouseDown}
                                onMouseUp={(e) => handleMouseUp(activePillarIndex, e)}
                                onMouseLeave={() => {
                                    isMouseDown.current = false;
                                }}
                                onClick={openZoom}
                                tabIndex={0}
                                role="button"
                                aria-label={`Xem chi tiết sứ mệnh ${activePillar.title} - ${activePillar.tagline}`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        openZoom();
                                    }
                                }}
                                className="group/portal relative w-[236px] sm:w-[286px] md:w-[336px] aspect-square rounded-full overflow-hidden bg-zinc-950 cursor-pointer"
                                title="Nhấp để xem chi tiết sứ mệnh"
                            >
                                {/* Auto-cycling Photos with Smooth Crossfade */}
                                {activePillar.images.map((imgSrc, imgIdx) => (
                                    <Image
                                        key={imgSrc}
                                        src={imgSrc}
                                        alt={activePillar.name}
                                        fill
                                        sizes="(max-width: 768px) 300px, 400px"
                                        draggable={false}
                                        className={`object-cover object-center transition-opacity duration-1000 ease-in-out pointer-events-none ${imgIdx === currentHeroImgIdx ? "opacity-95" : "opacity-0"
                                            }`}
                                    />
                                ))}

                                {/* Circular Radial & Linear Dark Gradient Scrim */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 pointer-events-none" />

                                {/* Top Curved Accent Arc */}
                                <div
                                    className="absolute top-0 inset-x-0 h-1.5 z-10 pointer-events-none transition-colors duration-1000 ease-in-out"
                                    style={{ backgroundColor: activePillar.color }}
                                />

                                {/* Hover / Click Prompt Badge */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/portal:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                                    <div className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-xl flex items-center gap-1.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-3.5 h-3.5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <span>Xem chi tiết</span>
                                    </div>
                                </div>

                                {/* Center Circular Overlay Content */}
                                <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end items-center text-center z-10 pointer-events-none">
                                    {/* Bottom Title & Tagline */}
                                    <div className="space-y-0.5 pb-2 sm:pb-3">
                                        <h3
                                            className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] transition-colors duration-1000 ease-in-out"
                                            style={{ color: activePillar.color }}
                                        >
                                            {activePillar.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm font-bold text-white drop-shadow-md">
                                            {activePillar.tagline}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* B. REVOLVING ORBIT CONTAINER: Continuous Flying Planet Animation */}
                    <div className="absolute inset-0 z-30 pointer-events-none animate-orbit group-hover:[animation-play-state:paused]">
                        {PLANET_PILLARS.map((pillar, idx) => {
                            const isSelected = activePillarIndex === idx;
                            const pTheme = THEME_STYLES[pillar.colorKey];

                            return (
                                <div
                                    key={pillar.id}
                                    onClick={() => setActivePillarIndex(idx)}
                                    onMouseEnter={() => setActivePillarIndex(idx)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Khám phá hành tinh sứ mệnh ${pillar.title} - ${pillar.tagline}`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            setActivePillarIndex(idx);
                                        }
                                    }}
                                    className={`absolute ${pillar.positionClass} pointer-events-auto cursor-pointer flex flex-col items-center animate-counter-orbit group-hover:[animation-play-state:paused] transition-transform duration-300`}
                                >
                                    {/* Pure Planet Graphic Container with Independent Breathing Animation */}
                                    <div
                                        style={{ animationDelay: `${idx * 0.85}s` }}
                                        className={`relative ${pillar.planetSize} rounded-full transition-transform duration-300 ease-out flex items-center justify-center animate-planet-breathe will-change-transform ${isSelected
                                            ? `scale-115 sm:scale-125 ${pTheme.planetHalo}`
                                            : "scale-95 sm:scale-100 opacity-85 hover:opacity-100 hover:scale-115"
                                            }`}
                                    >
                                        <Image
                                            src={pillar.planetSvg}
                                            alt={`Planet ${pillar.name}`}
                                            fill
                                            sizes="140px"
                                            draggable={false}
                                            className="object-contain drop-shadow-2xl"
                                        />
                                    </div>

                                    {/* Floating Planet Name Label */}
                                    <div
                                        className={`-mt-0.5 sm:-mt-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-300 backdrop-blur-md border ${isSelected
                                            ? `${pTheme.badge} border-white/40 scale-105 shadow-md`
                                            : "bg-black/75 text-zinc-200 border-white/10 hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        <span>{pillar.name}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* LIGHTBOX / DETAIL MODAL POPUP */}
            {isLightboxOpen && (
                <div
                    onClick={() => setIsLightboxOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-xl animate-modal-backdrop overflow-y-auto"
                >
                    {/* Modal Content Box */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`relative w-full max-w-5xl my-auto rounded-2xl sm:rounded-3xl border bg-zinc-950/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-modal-zoom overflow-hidden flex flex-col max-h-[92vh] ${activeLightboxTheme.glow}`}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${activeLightboxTheme.badge}`}
                                >
                                    <span>{activeLightboxPillar.title}</span>
                                </div>
                                <span className="hidden sm:inline text-xs font-medium text-zinc-400">
                                    {activeLightboxPillar.tagline}
                                </span>
                            </div>

                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                                title="Đóng (Esc)"
                                aria-label="Đóng popup"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body: Image on left, Rich Content Box on right */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(92vh-64px)] items-stretch">
                            {/* Left Column: Interactive Image Slider */}
                            <div className="lg:col-span-7 flex flex-col justify-center">
                                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-xl group/img flex-1 min-h-[240px] sm:min-h-[320px]">
                                    <Image
                                        src={activeLightboxPillar.images[lightboxImgIdx]}
                                        alt={`${activeLightboxPillar.title} activity`}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 600px"
                                        className="object-cover object-center transition-opacity duration-300"
                                        priority
                                    />

                                    {/* Bottom gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                                    {/* Image Counter Badge */}
                                    {totalLightboxImgs > 1 && (
                                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[11px] font-bold text-white/90 border border-white/15 pointer-events-none">
                                            {lightboxImgIdx + 1} / {totalLightboxImgs}
                                        </div>
                                    )}

                                    {/* Lightbox Photo Slider Dots */}
                                    {totalLightboxImgs > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 z-10">
                                            {activeLightboxPillar.images.map((_, dIdx) => (
                                                <button
                                                    key={dIdx}
                                                    onClick={() => setLightboxImgIdx(dIdx)}
                                                    className={`h-2 rounded-full transition-all cursor-pointer ${dIdx === lightboxImgIdx
                                                        ? `w-5 ${activeLightboxTheme.dotActive}`
                                                        : "w-2 bg-white/40 hover:bg-white/70"
                                                        }`}
                                                    aria-label={`Chuyển đến ảnh ${dIdx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Navigation Arrows */}
                                    {totalLightboxImgs > 1 && (
                                        <>
                                            <button
                                                onClick={prevLightboxImg}
                                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 hover:border-white/40 transition-all cursor-pointer backdrop-blur-md z-10"
                                                title="Ảnh trước"
                                                aria-label="Ảnh trước"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={nextLightboxImg}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 hover:border-white/40 transition-all cursor-pointer backdrop-blur-md z-10"
                                                title="Ảnh tiếp theo"
                                                aria-label="Ảnh tiếp theo"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: The Requested Text Card ("Khung Text") */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                                {/* The Mission Text Frame */}
                                <div
                                    className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border backdrop-blur-md transition-all duration-300 relative overflow-hidden flex-1 flex flex-col justify-center ${activeLightboxTheme.border}`}
                                >
                                    {/* Colored Left Accent Bar */}
                                    <div
                                        className="absolute top-0 left-0 bottom-0 w-1.5 transition-colors duration-500"
                                        style={{ backgroundColor: activeLightboxPillar.color }}
                                    />

                                    <div className="pl-2 space-y-3">
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
                                                Sứ Mệnh GDG on Campus: PTIT
                                            </div>
                                            <h3
                                                className="text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-500 drop-shadow-sm"
                                                style={{ color: activeLightboxPillar.color }}
                                            >
                                                {activeLightboxPillar.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm font-semibold text-zinc-300">
                                                {activeLightboxPillar.tagline}
                                            </p>
                                        </div>

                                        {/* Description text content */}
                                        <div className="pt-3 border-t border-white/10">
                                            <p className="text-sm sm:text-[15px] leading-relaxed text-zinc-200 text-justify sm:text-left font-normal">
                                                {activeLightboxPillar.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pillar Quick Selector Tabs */}
                                <div className="space-y-2 pt-1">
                                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
                                        Khám phá các sứ mệnh:
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {PLANET_PILLARS.map((p, pIdx) => {
                                            const isCurrent = lightboxPillarIdx === pIdx;
                                            const pStyle = THEME_STYLES[p.colorKey];
                                            return (
                                                <button
                                                    key={p.id}
                                                    onClick={() => {
                                                        setLightboxPillarIdx(pIdx);
                                                        setActivePillarIndex(pIdx);
                                                        setLightboxImgIdx(0);
                                                    }}
                                                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${isCurrent
                                                        ? `${pStyle.badge} border-white/30 scale-[1.02] shadow-md`
                                                        : "bg-white/[0.04] text-zinc-400 border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20"
                                                        }`}
                                                >
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{
                                                            backgroundColor: isCurrent ? "currentColor" : p.color,
                                                        }}
                                                    />
                                                    <span>{p.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
