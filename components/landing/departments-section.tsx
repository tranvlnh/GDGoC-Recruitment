"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import type { Department } from "@/types/config";
import { departments as defaultDepartments } from "@/lib/config";
import { getDepartmentTheme } from "@/lib/departments";
import { ArrowRightIcon, GoogleDots, SparklesIcon } from "./google-icons";

/**
 * ==============================================================================
 * BẢNG ÁNH XẠ HÀNH TINH & TÊN NGẮN GỌN (DEPARTMENT PLANETS & LABELS)
 * ==============================================================================
 */
export const DEPARTMENT_PLANETS: Record<string, string> = {
    tech: "/planet4.svg",    // Hành tinh Xanh Kỹ Thuật (Blue)
    design: "/planet6.svg",  // Hành tinh Đỏ Thiết Kế (Red)
    pr: "/planet1.svg",      // Hành tinh Vàng Truyền Thông (Amber/Yellow)
    "hr-lg": "/planet5.svg", // Hành tinh Xanh Lá Nhân Sự & Hậu Cần (Green)
};

export function getDepartmentPlanet(deptId?: string): string {
    if (!deptId) return "/planet4.svg";
    return DEPARTMENT_PLANETS[deptId] || "/planet4.svg";
}

export function getDepartmentShortLabel(deptId?: string, isCenter = false): string {
    switch (deptId) {
        case "tech":
            return isCenter ? "Ban Kỹ Thuật" : "Kỹ Thuật";
        case "design":
            return isCenter ? "Ban Thiết Kế" : "Thiết Kế";
        case "pr":
            return isCenter ? "Truyền Thông" : "Truyền Thông";
        case "hr-lg":
            return isCenter ? "Nhân Sự & Hậu Cần" : "Nhân Sự";
        default:
            return isCenter ? "Ban Chuyên Môn" : "Chuyên Môn";
    }
}

/**
 * ==============================================================================
 * BẢNG THAM SỐ CĂN CHỈNH TAY CHO TỪNG NHÂN VẬT (MASCOT TRANSFORM CONFIG)
 * ==============================================================================
 * Bạn có thể tự do điều chỉnh vị trí, kích thước và độ xoay riêng biệt cho
 * Desktop và Mobile:
 * 
 * 🖥️ DESKTOP:
 * - offsetX: Dịch ngang trên Desktop (px, số dương sang phải, số âm sang trái)
 * - offsetY: Dịch dọc trên Desktop (px, số dương xuống dưới, số âm lên trên)
 * - scale:   Tỉ lệ phóng to/thu nhỏ Desktop (1.0 = 100%, 1.1 = 110%)
 * - rotate:  Góc xoay Desktop (độ/deg, ví dụ: 0, 15, -8)
 * 
 * 📱 MOBILE (Tùy chọn - Nếu không điền, hệ thống sẽ tự động scale tỉ lệ vừa vặn):
 * - mobileOffsetX: Dịch ngang riêng trên Mobile (px)
 * - mobileOffsetY: Dịch dọc riêng trên Mobile (px)
 * - mobileScale:   Tỉ lệ riêng trên Mobile (ví dụ: 0.9, 1.0)
 * - mobileRotate:  Góc xoay riêng trên Mobile (độ)
 */
export interface MascotTransform {
    // Desktop
    offsetX: number;
    offsetY: number;
    scale: number;
    rotate: number;

    // Mobile (Optional overrides)
    mobileOffsetX?: number;
    mobileOffsetY?: number;
    mobileScale?: number;
    mobileRotate?: number;
}

export const MASCOT_CUSTOM_CONFIG: Record<string, MascotTransform> = {
    // 1. Ban Kỹ Thuật (Tech)
    tech: {
        offsetX: -25,
        offsetY: -25,
        scale: 0.85,
        rotate: 0,
        mobileOffsetX: -15,
        mobileOffsetY: -10,
        mobileScale: 0.85,
        mobileRotate: 0,
    },
    // 2. Ban Thiết Kế (Design)
    design: {
        offsetX: -40,
        offsetY: 10,
        scale: 1.0,
        rotate: 15,
        mobileOffsetX: -25,
        mobileOffsetY: 15,
        mobileScale: 1.0,
        mobileRotate: 12,
    },
    // 3. Ban Truyền Thông (PR)
    pr: {
        offsetX: -15,
        offsetY: -10,
        scale: 1.0,
        rotate: 10,
        mobileOffsetX: -10,
        mobileOffsetY: -5,
        mobileScale: 1.0,
        mobileRotate: 8,
    },
    // 4. Ban Nhân Sự & Hậu Cần (HR & Logistics)
    "hr-lg": {
        offsetX: 70,
        offsetY: 10,
        scale: 1.2,
        rotate: -8,
        mobileOffsetX: 50,
        mobileOffsetY: 15,
        mobileScale: 1.1,
        mobileRotate: -6,
    },
};

interface DepartmentsSectionProps {
    departments?: Department[];
}

export function DepartmentsSection({
    departments = defaultDepartments,
}: DepartmentsSectionProps) {
    const [selectedDeptId, setSelectedDeptId] = useState<string>(
        departments[0]?.id || "tech"
    );

    // Touch Swipe Gesture Refs for Under-Podium Carousel
    const touchStartX = useRef<number | null>(null);

    const activeIndex = Math.max(
        0,
        departments.findIndex((d) => d.id === selectedDeptId)
    );
    const activeDept = departments[activeIndex] || departments[0];
    const theme = getDepartmentTheme(activeDept);

    // Lấy cấu hình căn chỉnh tay cho nhân vật đang chọn
    const mascotTransform = MASCOT_CUSTOM_CONFIG[activeDept.id] || {
        offsetX: 0,
        offsetY: 0,
        scale: 1.0,
        rotate: 0,
    };

    const handleSelectDepartment = (deptId: string) => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("gdgoc-select-department", { detail: deptId })
            );
            const applyElem = document.getElementById("apply");
            if (applyElem) {
                applyElem.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    // Chuyển qua lại khép kín (Circular Closed-Loop)
    const handlePrevDept = () => {
        const prevIdx = (activeIndex - 1 + departments.length) % departments.length;
        setSelectedDeptId(departments[prevIdx].id);
    };

    const handleNextDept = () => {
        const nextIdx = (activeIndex + 1) % departments.length;
        setSelectedDeptId(departments[nextIdx].id);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (diff > 35) {
            handlePrevDept();
        } else if (diff < -35) {
            handleNextDept();
        }
        touchStartX.current = null;
    };

    return (
        <section
            id="departments"
            className="py-12 sm:py-16 md:py-20 bg-[#00092B] relative scroll-mt-20 overflow-hidden select-none"
        >
            {/* Seamless Cosmic Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <Image
                    src="/blank.svg"
                    alt="Departments Background"
                    fill
                    unoptimized
                    className="object-cover object-center w-full h-full"
                    aria-hidden="true"
                />
                {/* Multi-layered Stardust Layer 1 */}
                <div className="absolute inset-0 opacity-25 mix-blend-screen animate-pulse-glow">
                    <Image
                        src="/dust1.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                </div>
                {/* Multi-layered Stardust Layer 2 */}
                <div className="absolute inset-0 opacity-35 mix-blend-screen">
                    <Image
                        src="/dust2.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                </div>

                {/* Decorative Sparkling 4-Point Cosmic Stars */}
                <div className="absolute top-8 left-4 sm:left-12 md:left-20 w-4 sm:w-6 aspect-[136/205] opacity-70 pointer-events-none animate-pulse drop-shadow-[0_0_12px_rgba(226,221,250,0.85)]">
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute top-12 right-6 sm:right-16 md:right-28 w-5 sm:w-7 aspect-[136/205] opacity-60 pointer-events-none animate-pulse delay-700 drop-shadow-[0_0_15px_rgba(226,221,250,0.85)]">
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute bottom-24 left-6 sm:left-14 md:left-24 w-3.5 sm:w-5 aspect-[136/205] opacity-55 pointer-events-none animate-pulse delay-1000 drop-shadow-[0_0_10px_rgba(226,221,250,0.7)]">
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute bottom-10 right-8 sm:right-20 md:right-36 w-4 sm:w-5.5 aspect-[136/205] opacity-50 pointer-events-none animate-pulse delay-300 drop-shadow-[0_0_10px_rgba(226,221,250,0.7)]">
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute top-1/3 left-1/2 -translate-x-32 w-3 sm:w-4.5 aspect-[136/205] opacity-70 pointer-events-none animate-float drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>

                {/* Continuous vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/40" />
            </div>

            {/* Dynamic Ambient Background Glow reflecting active department color */}
            <div
                className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full blur-[100px] opacity-25 transition-colors duration-700 pointer-events-none z-0"
                style={{ backgroundColor: activeDept.themeColor || theme.themeColor }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[300px] h-[300px] rounded-full blur-[90px] opacity-20 transition-colors duration-700 pointer-events-none z-0"
                style={{ backgroundColor: activeDept.themeColor || theme.themeColor }}
            />

            <div className="relative z-10 max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
                {/* Section Header: Compact & Focused */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-xs">
                        <span>Cơ cấu tổ chức • {departments.length} Ban Chuyên Môn</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                        Chọn Ban Chuyên Môn Phù Hợp Với Bạn
                    </h2>

                    <p className="text-xs sm:text-sm text-zinc-300 font-normal">
                        Khám phá nhân vật đại diện cùng sứ mệnh của từng ban. Hãy chọn vị trí để cùng GDGoC PTIT tỏa sáng!
                    </p>
                </div>

                {/* Main Interactive Stage: Character Podium (Left) + Ultra-Glass Info HUD (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* 1. CHARACTER STAGE WITH BASE.SVG & CLOSED-LOOP FOCUS CAROUSEL (Lg: 5 cols) */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center">
                        <div className="relative flex flex-col items-center justify-center w-full min-h-[280px] sm:min-h-[330px] md:min-h-[360px]">
                            {/* Ambient Aura directly behind mascot */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl opacity-40 transition-colors duration-700 pointer-events-none z-0"
                                style={{
                                    backgroundColor:
                                        activeDept.themeColor || theme.themeColor,
                                }}
                            />

                            {/* Floating Mascot Character with Custom Responsive Transform adjustments */}
                            <div className="relative z-20 flex items-center justify-center w-full max-w-[200px] sm:max-w-[240px] md:max-w-[270px] aspect-square animate-float">
                                {/* Starlight Accent on Mascot */}
                                <div className="absolute -top-3 -left-2 sm:-left-4 w-3 sm:w-4 aspect-[136/205] opacity-80 animate-pulse pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
                                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                                </div>
                                <div className="absolute top-1 -right-2 sm:-right-4 w-2.5 sm:w-3.5 aspect-[136/205] opacity-70 animate-float pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                                </div>

                                {activeDept.svgImage ? (
                                    <div
                                        key={activeDept.id}
                                        className="w-full h-full relative transition-transform duration-300 ease-out select-none pointer-events-none [transform:translate3d(var(--m-x),var(--m-y),0)_scale(var(--m-scale))_rotate(var(--m-rot))] sm:[transform:translate3d(var(--d-x),var(--d-y),0)_scale(var(--d-scale))_rotate(var(--d-rot))]"
                                        style={{
                                            "--d-x": `${mascotTransform.offsetX}px`,
                                            "--d-y": `${mascotTransform.offsetY}px`,
                                            "--d-scale": `${mascotTransform.scale}`,
                                            "--d-rot": `${mascotTransform.rotate}deg`,
                                            "--m-x": `${mascotTransform.mobileOffsetX ?? Math.round(mascotTransform.offsetX * 0.65)}px`,
                                            "--m-y": `${mascotTransform.mobileOffsetY ?? Math.round(mascotTransform.offsetY * 0.65)}px`,
                                            "--m-scale": `${mascotTransform.mobileScale ?? mascotTransform.scale}`,
                                            "--m-rot": `${mascotTransform.mobileRotate ?? mascotTransform.rotate}deg`,
                                            transformOrigin: "bottom center",
                                        } as React.CSSProperties}
                                    >
                                        <Image
                                            src={activeDept.svgImage}
                                            alt={
                                                activeDept.svgAlt ||
                                                `${activeDept.name} Mascot`
                                            }
                                            fill
                                            priority
                                            unoptimized
                                            className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.75)]"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-black bg-white/10 backdrop-blur-md">
                                        {activeDept.name[0]}
                                    </div>
                                )}
                            </div>

                            {/* Character Podium: Base.svg Platform */}
                            <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] -mt-12 sm:-mt-16 md:-mt-18 z-10 select-none pointer-events-none">
                                <Image
                                    src="/base.svg"
                                    alt="Character Stand Platform"
                                    width={1605}
                                    height={506}
                                    priority
                                    unoptimized
                                    className="w-full h-auto object-contain filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.85)]"
                                />

                                {/* Concentrated light glow reflection atop the podium base */}
                                <div
                                    className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-8 rounded-full blur-xl opacity-70 transition-colors duration-700 pointer-events-none"
                                    style={{
                                        backgroundColor:
                                            activeDept.themeColor || theme.themeColor,
                                    }}
                                />
                            </div>
                        </div>

                        {/* 2. CLOSED-LOOP AUTO-CENTERING CAROUSEL SLIDER (Khép kín, di chuyển focus về giữa) */}
                        <div className="w-full max-w-[400px] sm:max-w-[440px] mt-2 flex flex-col items-center gap-2 z-20">
                            <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2">
                                {/* Prev Arrow Button */}
                                <button
                                    type="button"
                                    onClick={handlePrevDept}
                                    className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer backdrop-blur-md shadow-xs active:scale-95 z-30"
                                    title="Ban trước"
                                    aria-label="Ban trước"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Closed-Loop Rotating Carousel Track with Side Fade Masks */}
                                <div
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                    className="relative flex-1 h-12 overflow-hidden flex items-center justify-center [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]"
                                >
                                    {departments.map((dept, idx) => {
                                        const isSelected = dept.id === activeDept.id;
                                        const deptTheme = getDepartmentTheme(dept);
                                        const deptPlanet = getDepartmentPlanet(dept.id);

                                        // Tính khoảng cách vòng khép kín từ activeIndex
                                        const total = departments.length;
                                        let dist = (idx - activeIndex) % total;
                                        if (dist < 0) dist += total;
                                        if (dist > total / 2) dist -= total;

                                        // Hiển thị tên đầy đủ khi ở giữa (center), tên ngắn gọn xúc tích khi ở 2 cánh để không bị đè chữ
                                        const label = getDepartmentShortLabel(dept.id, dist === 0);

                                        // Vị trí offset X, Scale, Opacity, Z-Index dựa trên khoảng cách
                                        let translateX = 0;
                                        let scale = 0.8;
                                        let opacity = 0;
                                        let zIndex = 5;
                                        let pointerEvents: "auto" | "none" = "none";

                                        if (dist === 0) {
                                            // Item đang FOCUS -> NẰM CHÍNH GIỮA
                                            translateX = 0;
                                            scale = 1;
                                            opacity = 1;
                                            zIndex = 30;
                                            pointerEvents = "auto";
                                        } else if (dist === 1) {
                                            // Item bên PHẢI (Khoảng cách đủ rộng, không đè lên giữa)
                                            translateX = 126;
                                            scale = 0.82;
                                            opacity = 0.55;
                                            zIndex = 20;
                                            pointerEvents = "auto";
                                        } else if (dist === -1) {
                                            // Item bên TRÁI (Khoảng cách đủ rộng, không đè lên giữa)
                                            translateX = -126;
                                            scale = 0.82;
                                            opacity = 0.55;
                                            zIndex = 20;
                                            pointerEvents = "auto";
                                        } else {
                                            // Item đối diện (vòng phía sau)
                                            translateX = dist > 0 ? 190 : -190;
                                            scale = 0.6;
                                            opacity = 0;
                                            zIndex = 5;
                                            pointerEvents = "none";
                                        }

                                        return (
                                            <button
                                                key={dept.id}
                                                type="button"
                                                onClick={() => setSelectedDeptId(dept.id)}
                                                className={`absolute top-1/2 left-1/2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer backdrop-blur-md border transition-all duration-500 ease-out select-none ${isSelected
                                                    ? "bg-white/15 shadow-md border-white/40 max-w-[180px]"
                                                    : "bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/[0.08] hover:opacity-90 max-w-[110px]"
                                                    }`}
                                                style={{
                                                    transform: `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`,
                                                    opacity,
                                                    zIndex,
                                                    pointerEvents,
                                                    borderColor: isSelected
                                                        ? dept.themeColor ||
                                                        deptTheme.themeColor
                                                        : undefined,
                                                    boxShadow: isSelected
                                                        ? `0 0 16px -2px ${dept.themeColor ||
                                                        deptTheme.themeColor
                                                        }66`
                                                        : undefined,
                                                }}
                                            >
                                                {/* Planet Mini Graphic */}
                                                <div
                                                    className={`relative w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-transform ${isSelected
                                                        ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                                        : "opacity-80"
                                                        }`}
                                                >
                                                    <Image
                                                        src={deptPlanet}
                                                        alt={`Planet ${dept.name}`}
                                                        width={20}
                                                        height={20}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <span
                                                    className={`text-[11px] sm:text-xs font-bold truncate transition-colors ${isSelected
                                                        ? "text-white"
                                                        : "text-zinc-300"
                                                        }`}
                                                >
                                                    {label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next Arrow Button */}
                                <button
                                    type="button"
                                    onClick={handleNextDept}
                                    className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer backdrop-blur-md shadow-xs active:scale-95 z-30"
                                    title="Ban tiếp theo"
                                    aria-label="Ban tiếp theo"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Mini Dots Indicator */}
                            <div className="flex items-center justify-center gap-1.5">
                                {departments.map((d, i) => (
                                    <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => setSelectedDeptId(d.id)}
                                        className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex
                                            ? "w-5"
                                            : "w-1.5 bg-white/25 hover:bg-white/50"
                                            }`}
                                        style={{
                                            backgroundColor:
                                                i === activeIndex
                                                    ? d.themeColor || theme.themeColor
                                                    : undefined,
                                        }}
                                        aria-label={`Chọn ban ${d.name}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. ULTRA-GLASS DEPARTMENT INFO HUD PANEL (Lg: 7 cols) */}
                    <div className="lg:col-span-7">
                        <div
                            key={activeDept.id}
                            className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 bg-white/[0.035] backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4 sm:space-y-5 overflow-hidden transition-all duration-300 animate-modal-zoom"
                            style={{
                                borderColor: `${activeDept.themeColor || theme.themeColor}40`,
                            }}
                        >
                            {/* Top-Right Decorative Glow */}
                            <div
                                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
                                style={{
                                    backgroundColor:
                                        activeDept.themeColor || theme.themeColor,
                                }}
                            />

                            {/* Header: Badge + Department Titles + Planet Graphic */}
                            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border backdrop-blur-md bg-white/5 border-white/20 text-zinc-300">
                                        <SparklesIcon className="w-3 h-3 text-amber-400" />
                                        <span>{activeDept.tag || "Mảnh ghép chiến lược"}</span>
                                    </div>

                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                                        {activeDept.name}
                                    </h3>

                                    {activeDept.englishName && (
                                        <p
                                            className="text-xs sm:text-sm font-semibold tracking-wide"
                                            style={{
                                                color:
                                                    activeDept.themeColor || theme.themeColor,
                                            }}
                                        >
                                            {activeDept.englishName} Department
                                        </p>
                                    )}
                                </div>

                                {/* Planet Emblem Representation */}
                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                                    <div
                                        className="absolute inset-0 rounded-full blur-md opacity-50 transition-colors duration-700 pointer-events-none"
                                        style={{
                                            backgroundColor:
                                                activeDept.themeColor || theme.themeColor,
                                        }}
                                    />
                                    <Image
                                        key={activeDept.id}
                                        src={getDepartmentPlanet(activeDept.id)}
                                        alt={`Planet ${activeDept.name}`}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-contain drop-shadow-xl animate-planet-breathe relative z-10"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            {activeDept.desc && (
                                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal">
                                    {activeDept.desc}
                                </p>
                            )}

                            {/* Key Roles (Nhiệm vụ chính) */}
                            {activeDept.roles && activeDept.roles.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    activeDept.themeColor || theme.themeColor,
                                            }}
                                        />
                                        <span>Nhiệm vụ chính</span>
                                    </h4>

                                    <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-200">
                                        {activeDept.roles.map((role, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            activeDept.themeColor ||
                                                            theme.themeColor,
                                                    }}
                                                />
                                                <span className="leading-snug">{role}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Skills & Arsenal (Kỹ năng & Công cụ) */}
                            {activeDept.skills && activeDept.skills.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    activeDept.themeColor || theme.themeColor,
                                            }}
                                        />
                                        <span>Kỹ năng & Công cụ</span>
                                    </h4>

                                    <div className="flex flex-wrap gap-1.5 items-center">
                                        {activeDept.skills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-[11px] sm:text-xs font-medium text-zinc-200 backdrop-blur-md hover:border-white/35 hover:bg-white/10 transition-all shadow-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer CTA: Apply directly to this department */}
                            <div className="pt-1 sm:pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleSelectDepartment(activeDept.id)}
                                    className="w-full py-3 sm:py-3.5 px-5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] cursor-pointer shadow-lg group"
                                    style={{
                                        backgroundColor:
                                            activeDept.themeColor || theme.themeColor,
                                        boxShadow: `0 6px 20px -3px ${activeDept.themeColor || theme.themeColor
                                            }66`,
                                    }}
                                >
                                    <span>Ứng tuyển {activeDept.name}</span>
                                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
