"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GoogleDots } from "./google-icons";

import { PlanetPillar, DEFAULT_PLANET_PILLARS } from "@/types/missions";

export type { PlanetPillar };

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

interface MissionSectionProps {
    pillars?: PlanetPillar[];
}

export function MissionSection({ pillars = DEFAULT_PLANET_PILLARS }: MissionSectionProps) {
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

    const activePillar = pillars[activePillarIndex] || pillars[0] || DEFAULT_PLANET_PILLARS[0];
    const currentHeroImgIdx = imageIndices[activePillarIndex] || 0;

    const changePhoto = (pillarIdx: number, direction: "next" | "prev") => {
        setImageIndices((prev) => {
            const next = [...prev];
            const total = pillars[pillarIdx]?.images?.length || 1;
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

    // Close lightbox on Escape key & navigate with Arrow keys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsLightboxOpen(false);
            } else if (e.key === "ArrowRight") {
                const total = pillars[lightboxPillarIdx]?.images?.length || 0;
                if (total > 1) {
                    setLightboxImgIdx((prev) => (prev + 1) % total);
                }
            } else if (e.key === "ArrowLeft") {
                const total = pillars[lightboxPillarIdx]?.images?.length || 0;
                if (total > 1) {
                    setLightboxImgIdx((prev) => (prev - 1 + total) % total);
                }
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
    }, [isLightboxOpen, lightboxPillarIdx, pillars]);

    // Auto-cycle missions (Learn -> Share -> Connect -> Grow) every 4.5 seconds
    useEffect(() => {
        if (isHovered || isLightboxOpen) return;

        const interval = setInterval(() => {
            setActivePillarIndex((prev) => (prev + 1) % pillars.length);
            setImageIndices((prev) =>
                prev.map((currentIdx, pIdx) => {
                    const total = pillars[pIdx]?.images?.length || 1;
                    return (currentIdx + 1) % total;
                })
            );
        }, 4500);

        return () => clearInterval(interval);
    }, [isHovered, isLightboxOpen, pillars]);

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

    const activeLightboxPillar = pillars[lightboxPillarIdx] || pillars[0] || DEFAULT_PLANET_PILLARS[0];
    const totalLightboxImgs = activeLightboxPillar.images.length;

    const nextLightboxImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (totalLightboxImgs > 0) {
            setLightboxImgIdx((prev) => (prev + 1) % totalLightboxImgs);
        }
    };

    const prevLightboxImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (totalLightboxImgs > 0) {
            setLightboxImgIdx((prev) => (prev - 1 + totalLightboxImgs) % totalLightboxImgs);
        }
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
                                {activePillar.images.length > 0 ? (
                                    activePillar.images.map((imgSrc, imgIdx) => (
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
                                    ))
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                                        <Image
                                            src={activePillar.planetSvg}
                                            alt={activePillar.name}
                                            width={140}
                                            height={140}
                                            className="opacity-50 drop-shadow-xl"
                                        />
                                    </div>
                                )}

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
                        {pillars.map((pillar, idx) => {
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

            {/* MINIMALIST THEMATIC MISSION LIGHTBOX POPUP (MATCHING RECRUITMENT FORM GLASS BLUR) */}
            {isLightboxOpen && (
                <div
                    onClick={() => setIsLightboxOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md animate-modal-backdrop overflow-y-auto"
                >
                    {/* Modal Content Dialog: Frosted Ultra-Glass matching Recruitment Form */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl my-auto rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.05] text-white shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-300 animate-modal-zoom overflow-hidden flex flex-col max-h-[92vh]"
                    >
                        {/* Ambient Color Glow in Top-Right Corner */}
                        <div
                            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
                            style={{ backgroundColor: activeLightboxPillar.color }}
                        />

                        {/* Top Accent Color Bar */}
                        <div
                            className="absolute top-0 inset-x-0 h-1 transition-colors duration-500 z-30"
                            style={{ backgroundColor: activeLightboxPillar.color }}
                        />

                        {/* Modal Header: Sleek Segmented Switcher + Minimalist Close Button */}
                        <div className="relative z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-3.5 border-b border-white/10 bg-white/[0.02]">
                            {/* Segmented Switcher for 4 Pillars */}
                            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                                {pillars.map((p, pIdx) => {
                                    const isCurrent = lightboxPillarIdx === pIdx;
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                setLightboxPillarIdx(pIdx);
                                                setActivePillarIndex(pIdx);
                                                setLightboxImgIdx(0);
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                                                isCurrent
                                                    ? "bg-white/15 text-white border-white/30 shadow-xs font-bold"
                                                    : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-zinc-200"
                                            }`}
                                        >
                                            <span
                                                className="w-1.5 h-1.5 rounded-full transition-transform"
                                                style={{
                                                    backgroundColor: p.color,
                                                    transform: isCurrent ? "scale(1.25)" : "scale(1)",
                                                }}
                                            />
                                            <span>{p.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Minimalist Close Button */}
                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center border border-white/15 hover:border-white/30 transition-all cursor-pointer shrink-0 backdrop-blur-md"
                                title="Đóng (Esc)"
                                aria-label="Đóng popup"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body: Minimalist 2-Column Layout */}
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-5 sm:p-7 md:p-8 overflow-y-auto max-h-[calc(92vh-58px)] items-center">
                            {/* Left Column: Image Showcase with Smooth Minimalist Slider */}
                            <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-center">
                                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-white/15 bg-white/[0.02] backdrop-blur-sm shadow-xl group/img select-none">
                                    {activeLightboxPillar.images.length > 0 ? (
                                        activeLightboxPillar.images.map((imgSrc, idx) => (
                                            <Image
                                                key={imgSrc}
                                                src={imgSrc}
                                                alt={`${activeLightboxPillar.title} activity ${idx + 1}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 550px"
                                                className={`object-cover object-center transition-opacity duration-500 ease-in-out ${
                                                    idx === lightboxImgIdx ? "opacity-100" : "opacity-0 pointer-events-none"
                                                }`}
                                                priority={idx === 0}
                                            />
                                        ))
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 gap-3">
                                            <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                                                <Image
                                                    src={activeLightboxPillar.planetSvg}
                                                    alt={activeLightboxPillar.name}
                                                    fill
                                                    className="object-contain opacity-75 drop-shadow-xl animate-planet-breathe"
                                                />
                                            </div>
                                            <span className="text-xs text-zinc-400 font-medium">Hành tinh {activeLightboxPillar.name}</span>
                                        </div>
                                    )}

                                    {/* Subtle Gradient Scrim at bottom for indicators */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                    {/* Minimalist Image Counter Badge */}
                                    {totalLightboxImgs > 1 && (
                                        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-medium text-white/90 border border-white/15">
                                            {lightboxImgIdx + 1} / {totalLightboxImgs}
                                        </div>
                                    )}

                                    {/* Minimalist Slider Dots */}
                                    {totalLightboxImgs > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 z-10">
                                            {activeLightboxPillar.images.map((_, dIdx) => (
                                                <button
                                                    key={dIdx}
                                                    onClick={() => setLightboxImgIdx(dIdx)}
                                                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                                        dIdx === lightboxImgIdx
                                                            ? "w-4 bg-white"
                                                            : "w-1.5 bg-white/40 hover:bg-white/70"
                                                    }`}
                                                    aria-label={`Chuyển đến ảnh ${dIdx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Minimalist Navigation Arrows */}
                                    {totalLightboxImgs > 1 && (
                                        <>
                                            <button
                                                onClick={prevLightboxImg}
                                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8.5 h-8.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 hover:border-white/30 transition-all cursor-pointer backdrop-blur-md z-10 shadow-md"
                                                title="Ảnh trước"
                                                aria-label="Ảnh trước"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={nextLightboxImg}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8.5 h-8.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 hover:border-white/30 transition-all cursor-pointer backdrop-blur-md z-10 shadow-md"
                                                title="Ảnh tiếp theo"
                                                aria-label="Ảnh tiếp theo"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Clean Minimalist Content */}
                            <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-center space-y-4">
                                <div className="space-y-1.5">
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                                        <span style={{ color: activeLightboxPillar.color }}>
                                            {activeLightboxPillar.title}
                                        </span>
                                    </h3>

                                    <p className="text-xs sm:text-sm font-semibold text-zinc-300">
                                        {activeLightboxPillar.tagline}
                                    </p>
                                </div>

                                <div className="text-sm sm:text-[15px] leading-relaxed text-zinc-200 font-normal space-y-3">
                                    <p className="text-justify sm:text-left">
                                        {activeLightboxPillar.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
