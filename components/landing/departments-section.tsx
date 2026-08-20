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
        <section id="departments" className="py-16 sm:py-24 bg-white relative scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 uppercase tracking-wider">
                        <GoogleDots />
                        <span>Cơ cấu tổ chức • {departments.length} Ban Chuyên Môn</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        {departments.length} Mảnh ghép tạo nên GDGoC PTIT
                    </h2>

                    <p className="text-sm sm:text-base text-zinc-600 font-normal">
                        Mỗi ban chuyên môn giữ vai trò cốt lõi trong sự phát triển của câu lạc bộ. Hãy chọn ban phù hợp nhất với đam mê của bạn!
                    </p>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
                    {departments.map((dept) => {
                        const IconComponent = getDepartmentIcon(dept.icon);
                        const theme = getDepartmentTheme(dept);

                        return (
                            <div
                                key={dept.id}
                                className={`group rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-zinc-50/70 border ${theme.accentBorder} transition-all duration-300 hover:bg-white hover:-translate-y-1 ${theme.hoverShadow} flex flex-col justify-between`}
                            >
                                <div className="space-y-4">
                                    {/* Card Header: Mascot + Dept Info */}
                                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-200/70">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs"
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
                                                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {dept.desc && (
                                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                            {dept.desc}
                                        </p>
                                    )}

                                    {/* Roles */}
                                    {dept.roles && dept.roles.length > 0 && (
                                        <div className="space-y-1.5">
                                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                                                Nhiệm vụ chính:
                                            </p>
                                            <ul className="space-y-1 text-xs sm:text-sm text-zinc-600">
                                                {dept.roles.map((role, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                                            style={{ backgroundColor: dept.themeColor || theme.themeColor }}
                                                        />
                                                        <span>{role}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {dept.skills && dept.skills.length > 0 && (
                                        <div className="space-y-1.5 pt-1">
                                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                                                Kỹ năng & Công cụ:
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {dept.skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-xs font-medium text-zinc-700 shadow-2xs"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer CTA */}
                                <div className="pt-4 mt-5 border-t border-zinc-200/60">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectDepartment(dept.id)}
                                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${theme.buttonClass}`}
                                    >
                                        <span>Ứng tuyển {dept.name}</span>
                                        <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
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
