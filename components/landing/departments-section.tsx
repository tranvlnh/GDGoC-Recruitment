"use client";

import Image from "next/image";
import type { Department } from "@/types/config";
import { departments as defaultDepartments } from "@/lib/config";
import { getDepartmentTheme, getDepartmentIcon } from "@/lib/departments";
import { ArrowRightIcon, GoogleDots } from "./google-icons";

interface DepartmentsSectionProps {
    departments?: Department[];
}

export function DepartmentsSection({
    departments = defaultDepartments,
}: DepartmentsSectionProps) {
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

    return (
        <section id="departments" className="py-20 sm:py-28 bg-[#00092B] relative scroll-mt-20 overflow-hidden">
            {/* Seamless Cosmic Background matching all sections */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <Image
                    src="/blank.svg"
                    alt="Departments Background"
                    fill
                    unoptimized
                    className="object-cover object-center w-full h-full"
                    aria-hidden="true"
                />
                {/* Stardust Layer */}
                <div className="absolute inset-0 opacity-30 mix-blend-screen">
                    <Image
                        src="/dust2.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                </div>
                {/* Continuous vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/35" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md">
                        <GoogleDots />
                        <span>Cơ cấu tổ chức • {departments.length} Ban Chuyên Môn</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                        {departments.length} Mảnh ghép tạo nên GDGoC PTIT
                    </h2>

                    <p className="text-sm sm:text-base text-zinc-300 font-normal">
                        Mỗi ban chuyên môn giữ vai trò cốt lõi trong sự phát triển của câu lạc bộ. Hãy chọn ban phù hợp nhất với đam mê của bạn!
                    </p>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 items-stretch">
                    {departments.map((dept) => {
                        const IconComponent = getDepartmentIcon(dept.icon);
                        const theme = getDepartmentTheme(dept);

                        return (
                            <div
                                key={dept.id}
                                className={`group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white border ${theme.accentBorder} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${theme.hoverShadow} flex flex-col justify-between overflow-hidden shadow-xs`}
                            >
                                {/* Top-right ambient glow */}
                                <div
                                    className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-15 pointer-events-none transition-opacity duration-300 group-hover:opacity-25"
                                    style={{ backgroundColor: dept.themeColor || theme.themeColor }}
                                />

                                <div className="space-y-4 sm:space-y-5 flex-1 flex flex-col">
                                    {/* Card Header: Mascot + Dept Info */}
                                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-zinc-100 sm:min-h-[72px]">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs"
                                                style={{ backgroundColor: dept.themeColor || theme.themeColor }}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
                                                    {dept.name}
                                                </h3>
                                                {dept.tag && (
                                                    <span className={`inline-block px-2 py-0.5 mt-0.5 rounded-md text-[11px] font-bold border ${theme.accentBadge}`}>
                                                        {dept.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mascot SVG Thumbnail */}
                                        {dept.svgImage && (
                                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                                                <Image
                                                    src={dept.svgImage}
                                                    alt={dept.svgAlt || `${dept.name} Mascot`}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-110 group-hover:rotate-2 transition-all duration-300"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {dept.desc && (
                                        <div className="sm:min-h-[44px] flex items-center">
                                            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                                {dept.desc}
                                            </p>
                                        </div>
                                    )}

                                    {/* Roles */}
                                    {dept.roles && dept.roles.length > 0 && (
                                        <div className="space-y-2 flex-1 flex flex-col justify-start">
                                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                                                Nhiệm vụ chính:
                                            </p>
                                            <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-600">
                                                {dept.roles.map((role, i) => (
                                                    <li key={i} className="flex items-start gap-2.5">
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                                            style={{ backgroundColor: dept.themeColor || theme.themeColor }}
                                                        />
                                                        <span className="leading-snug">{role}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {dept.skills && dept.skills.length > 0 && (
                                        <div className="space-y-2 pt-1">
                                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                                                Kỹ năng & Công cụ:
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 items-center sm:min-h-[56px] content-start">
                                                {dept.skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs font-medium text-zinc-700 shadow-2xs group-hover:bg-white transition-colors"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer CTA */}
                                <div className="pt-4 mt-5 border-t border-zinc-100">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectDepartment(dept.id)}
                                        className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs ${theme.buttonClass}`}
                                    >
                                        <span>Ứng tuyển {dept.name}</span>
                                        <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
