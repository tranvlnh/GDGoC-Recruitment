"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface PlanetPillar {
    id: string;
    num: string;
    name: string;
    tagline: string;
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
        num: "01",
        name: "Learn",
        tagline: "Học hỏi & Thực chiến",
        color: "#4285F4",
        colorKey: "blue",
        planetSvg: "/planet4.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "top-1 left-4 sm:top-2 sm:left-6 md:top-3 md:left-8",
        images: ["/phase-3.png", "/phase-6.png"],
    },
    {
        id: "share",
        num: "02",
        name: "Share",
        tagline: "Chia sẻ & Lan tỏa",
        color: "#EA4335",
        colorKey: "red",
        planetSvg: "/planet6.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "top-1 right-4 sm:top-2 sm:right-6 md:top-3 md:right-8",
        images: ["/phase-4.png", "/phase-6.png"],
    },
    {
        id: "connect",
        num: "03",
        name: "Connect",
        tagline: "Kết nối & Mở rộng",
        color: "#FBBC05",
        colorKey: "yellow",
        planetSvg: "/planet1.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "bottom-1 right-4 sm:bottom-2 sm:right-6 md:bottom-3 md:right-8",
        images: ["/phase-1.png", "/phase-5.png"],
    },
    {
        id: "grow",
        num: "04",
        name: "Grow",
        tagline: "Phát triển & Bứt phá",
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
        glow: "shadow-[0_0_55px_rgba(66,133,244,0.55)] border-[#4285F4]",
        badge: "bg-[#4285F4] text-white shadow-md shadow-blue-500/25",
        dotActive: "bg-[#4285F4]",
        planetHalo: "drop-shadow-[0_0_30px_rgba(66,133,244,0.9)]",
    },
    red: {
        glow: "shadow-[0_0_55px_rgba(234,67,53,0.55)] border-[#EA4335]",
        badge: "bg-[#EA4335] text-white shadow-md shadow-red-500/25",
        dotActive: "bg-[#EA4335]",
        planetHalo: "drop-shadow-[0_0_30px_rgba(234,67,53,0.9)]",
    },
    yellow: {
        glow: "shadow-[0_0_55px_rgba(251,188,5,0.55)] border-[#FBBC05]",
        badge: "bg-[#FBBC05] text-zinc-900 font-extrabold shadow-md shadow-amber-500/25",
        dotActive: "bg-[#FBBC05]",
        planetHalo: "drop-shadow-[0_0_30px_rgba(251,188,5,0.9)]",
    },
    green: {
        glow: "shadow-[0_0_55px_rgba(52,168,83,0.55)] border-[#34A853]",
        badge: "bg-[#34A853] text-white shadow-md shadow-emerald-500/25",
        dotActive: "bg-[#34A853]",
        planetHalo: "drop-shadow-[0_0_30px_rgba(52,168,83,0.9)]",
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8 sm:space-y-12">
                {/* Section Header Title */}
                <div className="text-center space-y-3 max-w-3xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center gap-1 sm:gap-2">
                        <span className="block">
                            We <span className="text-[#4285F4] drop-shadow-[0_2px_12px_rgba(66,133,244,0.5)]">Learn</span>,{" "}
                            <span className="text-[#EA4335] drop-shadow-[0_2px_12px_rgba(234,67,53,0.5)]">Share</span>,
                        </span>
                        <span className="block">
                            <span className="text-[#FBBC05] drop-shadow-[0_2px_12px_rgba(251,188,5,0.5)]">Connect</span> and{" "}
                            <span className="text-[#34A853] drop-shadow-[0_2px_12px_rgba(52,168,83,0.5)]">Grow</span>!
                        </span>
                    </h2>
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
                                className="relative w-[236px] sm:w-[286px] md:w-[336px] aspect-square rounded-full overflow-hidden bg-zinc-950 cursor-pointer"
                                title="Nhấp để phóng to ảnh"
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
                                        className={`object-cover object-center transition-opacity duration-1000 ease-in-out pointer-events-none ${
                                            imgIdx === currentHeroImgIdx ? "opacity-95" : "opacity-0"
                                        }`}
                                    />
                                ))}

                                {/* Circular Radial & Linear Dark Gradient Scrim */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/40 pointer-events-none" />

                                {/* Top Curved Accent Arc */}
                                <div
                                    className="absolute top-0 inset-x-0 h-1.5 z-10 pointer-events-none transition-colors duration-1000 ease-in-out"
                                    style={{ backgroundColor: activePillar.color }}
                                />

                                {/* Center Circular Overlay Content */}
                                <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end items-center text-center z-10 pointer-events-none">
                                    {/* Bottom Title & Tagline */}
                                    <div className="space-y-0.5 pb-2 sm:pb-3">
                                        <h3
                                            className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] transition-colors duration-1000 ease-in-out"
                                            style={{ color: activePillar.color }}
                                        >
                                            {activePillar.name}
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
                                    aria-label={`Khám phá hành tinh sứ mệnh ${pillar.name} - ${pillar.tagline}`}
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
                                        className={`relative ${pillar.planetSize} rounded-full transition-transform duration-300 ease-out flex items-center justify-center animate-planet-breathe will-change-transform ${
                                            isSelected
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
                                        className={`-mt-0.5 sm:-mt-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-300 backdrop-blur-md border ${
                                            isSelected
                                                ? `${pTheme.badge} border-white/40 scale-105 shadow-md`
                                                : "bg-black/75 text-zinc-200 border-white/10 hover:border-white/30 hover:text-white"
                                        }`}
                                    >
                                        <span>{pillar.num} • {pillar.name}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* LIGHTBOX / ZOOM OVERLAY POPUP */}
            {isLightboxOpen && (
                <div
                    onClick={() => setIsLightboxOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl animate-modal-backdrop"
                >
                    {/* Modal Content Box */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`relative w-full max-w-4xl max-h-[85vh] aspect-[16/10] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden border-2 bg-zinc-950 shadow-2xl transition-all animate-modal-zoom ${activeLightboxTheme.glow}`}
                    >
                        {/* High-Resolution Zoomed Photo */}
                        <Image
                            src={activeLightboxPillar.images[lightboxImgIdx]}
                            alt={`${activeLightboxPillar.name} activity`}
                            fill
                            sizes="(max-width: 1280px) 100vw, 1200px"
                            className="object-cover object-center transition-opacity duration-300"
                            priority
                        />

                        {/* Top Gradient Overlay for Close Button & Badge */}
                        <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
                            <div
                                className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${activeLightboxTheme.badge}`}
                            >
                                <span>{activeLightboxPillar.num} • {activeLightboxPillar.name}</span>
                            </div>

                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 hover:border-white/40 transition-all cursor-pointer backdrop-blur-md pointer-events-auto"
                                title="Đóng (Esc)"
                                aria-label="Đóng popup"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Bottom Gradient Overlay with Tagline and Dots */}
                        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex items-end justify-between bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none">
                            <div className="space-y-0.5">
                                <h4
                                    className="text-xl sm:text-2xl font-black"
                                    style={{ color: activeLightboxPillar.color }}
                                >
                                    {activeLightboxPillar.name}
                                </h4>
                                <p className="text-xs sm:text-sm font-semibold text-white/90">
                                    {activeLightboxPillar.tagline}
                                </p>
                            </div>

                            {/* Lightbox Photo Slider Dots */}
                            {totalLightboxImgs > 1 && (
                                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 pointer-events-auto">
                                    {activeLightboxPillar.images.map((_, dIdx) => (
                                        <button
                                            key={dIdx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLightboxImgIdx(dIdx);
                                            }}
                                            className={`h-2 rounded-full transition-all cursor-pointer ${
                                                dIdx === lightboxImgIdx
                                                    ? `w-5 ${activeLightboxTheme.dotActive}`
                                                    : "w-2 bg-white/40 hover:bg-white/70"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Navigation Arrows for Multiple Photos */}
                        {totalLightboxImgs > 1 && (
                            <>
                                <button
                                    onClick={prevLightboxImg}
                                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 hover:border-white/40 transition-all cursor-pointer backdrop-blur-md z-10"
                                    title="Ảnh trước"
                                    aria-label="Ảnh trước"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 sm:w-6 sm:h-6"
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
                                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 hover:border-white/40 transition-all cursor-pointer backdrop-blur-md z-10"
                                    title="Ảnh tiếp theo"
                                    aria-label="Ảnh tiếp theo"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 sm:w-6 sm:h-6"
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
            )}
        </section>
    );
}
