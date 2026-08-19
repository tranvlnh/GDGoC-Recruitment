"use client";

import Image from "next/image";
import {
    CodeIcon,
    PaletteIcon,
    MegaphoneIcon,
    UsersIcon,
    ArrowRightIcon,
    GoogleDots
} from "./google-icons";

export interface DepartmentInfo {
    id: string;
    name: string;
    englishName: string;
    tag: string;
    desc: string;
    themeColor: string;
    svgImage: string;
    svgAlt: string;
    icon: React.ComponentType<{ className?: string }>;
    accentBorder: string;
    accentBadge: string;
    accentText: string;
    hoverShadow: string;
    buttonClass: string;
    roles: string[];
    skills: string[];
}

export const DEPARTMENTS: DepartmentInfo[] = [
    {
        id: "tech",
        name: "Ban Chuyên Môn",
        englishName: "Technical",
        tag: "Technical",
        desc: "Nghiên cứu công nghệ mới, phát triển dự án thực tế và xây dựng sản phẩm dự thi Google Solution Challenge.",
        themeColor: "#4285F4",
        svgImage: "/tech.svg",
        svgAlt: "Ban Chuyên Môn Mascot",
        icon: CodeIcon,
        accentBorder: "border-blue-200/80 hover:border-blue-500",
        accentBadge: "bg-blue-50 text-[#1a73e8] border-blue-200",
        accentText: "text-[#1a73e8]",
        hoverShadow: "hover:shadow-lg hover:shadow-blue-500/10",
        buttonClass: "bg-blue-50 text-[#1a73e8] hover:bg-[#4285F4] hover:text-white border border-blue-200/80",
        roles: [
            "Phát triển Web, Mobile App & ứng dụng AI/ML",
            "Tổ chức Tech Workshops, CodeLabs & Hackathons",
            "Tiếp cận Google Cloud & Gemini credits thực chiến",
        ],
        skills: ["Next.js / React", "Flutter", "Python / AI", "Google Cloud"],
    },
    {
        id: "design",
        name: "Ban Thiết Kế",
        englishName: "Design",
        tag: "Design",
        desc: "Sáng tạo giao diện trải nghiệm người dùng (UI/UX) và định hình bộ nhận diện thị giác đậm chất Google.",
        themeColor: "#EA4335",
        svgImage: "/design.svg",
        svgAlt: "Ban Thiết Kế Mascot",
        icon: PaletteIcon,
        accentBorder: "border-red-200/80 hover:border-red-500",
        accentBadge: "bg-red-50 text-[#d93025] border-red-200",
        accentText: "text-[#d93025]",
        hoverShadow: "hover:shadow-lg hover:shadow-red-500/10",
        buttonClass: "bg-red-50 text-[#d93025] hover:bg-[#EA4335] hover:text-white border border-red-200/80",
        roles: [
            "Thiết kế UI/UX & Design System cho sản phẩm số",
            "Sáng tạo Key Visual, poster, banner truyền thông",
            "Xây dựng Portfolio chuẩn Product Design",
        ],
        skills: ["Figma", "UI/UX Design", "Photoshop", "Illustrator"],
    },
    {
        id: "pr",
        name: "Ban Truyền Thông",
        englishName: "Public Relations",
        tag: "Media & Branding",
        desc: "Quản trị các kênh truyền thông số, sáng tạo nội dung viral và kết nối quan hệ đối tác, nhà tài trợ.",
        themeColor: "#F29900",
        svgImage: "/pr.svg",
        svgAlt: "Ban Truyền Thông Mascot",
        icon: MegaphoneIcon,
        accentBorder: "border-amber-200/80 hover:border-amber-500",
        accentBadge: "bg-amber-50 text-[#b06000] border-amber-200",
        accentText: "text-[#b06000]",
        hoverShadow: "hover:shadow-lg hover:shadow-amber-500/10",
        buttonClass: "bg-amber-50 text-[#b06000] hover:bg-[#F29900] hover:text-white border border-amber-200/80",
        roles: [
            "Sáng tạo nội dung trên Fanpage, TikTok & LinkedIn",
            "Lên chiến dịch truyền thông đa kênh cho sự kiện",
            "Kết nối diễn giả công nghệ & nhà tài trợ",
        ],
        skills: ["Content Writing", "Social Media", "Video Editing", "Outreach"],
    },
    {
        id: "hr-lg",
        name: "Ban Nhân Sự & Hậu Cần",
        englishName: "HR & Logistics",
        tag: "People & Operations",
        desc: "Quản trị nguồn nhân lực, duy trì văn hóa gắn kết nội bộ và điều phối vận hành hậu cần cho mọi sự kiện.",
        themeColor: "#34A853",
        svgImage: "/hr.svg",
        svgAlt: "Ban Nhân Sự & Hậu Cần Mascot",
        icon: UsersIcon,
        accentBorder: "border-emerald-200/80 hover:border-emerald-500",
        accentBadge: "bg-emerald-50 text-[#188038] border-emerald-200",
        accentText: "text-[#188038]",
        hoverShadow: "hover:shadow-lg hover:shadow-emerald-500/10",
        buttonClass: "bg-emerald-50 text-[#188038] hover:bg-[#34A853] hover:text-white border border-emerald-200/80",
        roles: [
            "Quản lý nhân sự & duy trì gắn kết thành viên",
            "Lập kế hoạch & điều phối hậu cần sự kiện",
            "Tổ chức Teambuilding, Camp & văn hóa nội bộ",
        ],
        skills: ["Event Logistics", "Team Management", "Notion / Sheets", "Operations"],
    },
];

export function DepartmentsSection() {
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
                        <span>Cơ cấu tổ chức • 4 Ban Chuyên Môn</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        4 Mảnh ghép tạo nên GDGoC PTIT
                    </h2>

                    <p className="text-sm sm:text-base text-zinc-600 font-normal">
                        Mỗi ban chuyên môn giữ vai trò cốt lõi trong sự phát triển của câu lạc bộ. Hãy chọn ban phù hợp nhất với đam mê của bạn!
                    </p>
                </div>

                {/* 4 Departments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
                    {DEPARTMENTS.map((dept) => {
                        const IconComponent = dept.icon;

                        return (
                            <div
                                key={dept.id}
                                className={`group rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-zinc-50/70 border ${dept.accentBorder} transition-all duration-300 hover:bg-white hover:-translate-y-1 ${dept.hoverShadow} flex flex-col justify-between`}
                            >
                                <div className="space-y-4">
                                    {/* Card Header: Mascot + Dept Info */}
                                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-200/70">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs"
                                                style={{ backgroundColor: dept.themeColor }}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
                                                    {dept.name}
                                                </h3>
                                                <span className={`inline-block px-2 py-0.5 mt-0.5 rounded-md text-[11px] font-bold border ${dept.accentBadge}`}>
                                                    {dept.tag}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Mascot SVG Thumbnail */}
                                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                                            <Image
                                                src={dept.svgImage}
                                                alt={dept.svgAlt}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                        {dept.desc}
                                    </p>

                                    {/* Roles */}
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                                            Nhiệm vụ chính:
                                        </p>
                                        <ul className="space-y-1 text-xs sm:text-sm text-zinc-600">
                                            {dept.roles.map((role, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                                        style={{ backgroundColor: dept.themeColor }}
                                                    />
                                                    <span>{role}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Skills */}
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
                                </div>

                                {/* Footer CTA */}
                                <div className="pt-4 mt-5 border-t border-zinc-200/60">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectDepartment(dept.id)}
                                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${dept.buttonClass}`}
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
