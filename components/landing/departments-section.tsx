"use client";

import { CodeIcon, PaletteIcon, MegaphoneIcon, UsersIcon, ArrowRightIcon } from "./google-icons";

export function DepartmentsSection() {
    const departments = [
        {
            id: "tech",
            name: "Ban Chuyên Môn (Technical)",
            colorName: "Google Blue",
            tag: "Engineering & AI",
            colorClass: "border-blue-200/80 hover:border-blue-500 hover:shadow-blue-500/10",
            bgHeader: "bg-[#4285F4]",
            badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
            icon: CodeIcon,
            desc: "Trọng tâm nghiên cứu, phát triển các giải pháp công nghệ, tổ chức các cuộc thi lập trình (Hackathons) và các workshop chuyên sâu.",
            roles: [
                "Phát triển Web, Mobile, AI/ML, Cloud Solutions",
                "Tổ chức Tech Workshops & Code Labs",
                "Hỗ trợ kỹ thuật cho các dự án nội bộ và cuộc thi",
            ],
            skills: ["JavaScript/TypeScript", "Python/AI", "Flutter/React", "Google Cloud"],
        },
        {
            id: "design",
            name: "Ban Thiết Kế (Design)",
            colorName: "Google Red",
            tag: "UI/UX & Visual Art",
            colorClass: "border-red-200/80 hover:border-red-500 hover:shadow-red-500/10",
            bgHeader: "bg-[#EA4335]",
            badgeBg: "bg-red-50 text-red-700 border-red-200",
            icon: PaletteIcon,
            desc: "Sáng tạo giao diện trải nghiệm người dùng (UI/UX), thiết kế bộ nhận diện thương hiệu, ấn phẩm truyền thông sự kiện và visual storytelling.",
            roles: [
                "Thiết kế UI/UX cho các sản phẩm công nghệ",
                "Sáng tạo Key Visual, poster, banner truyền thông",
                "Xây dựng phong cách thị giác đậm chất Google",
            ],
            skills: ["Figma", "Photoshop", "Illustrator", "UI/UX Design"],
        },
        {
            id: "pr",
            name: "Ban Truyền Thông (PR)",
            colorName: "Google Yellow",
            tag: "Media & Branding",
            colorClass: "border-amber-200/80 hover:border-amber-500 hover:shadow-amber-500/10",
            bgHeader: "bg-[#F29900]",
            badgeBg: "bg-amber-50 text-amber-900 border-amber-200",
            icon: MegaphoneIcon,
            desc: "Quản trị các kênh truyền thông số, sáng tạo nội dung hấp dẫn, lan tỏa tinh thần công nghệ và phát triển quan hệ đối ngoại, tài trợ.",
            roles: [
                "Sáng tạo nội dung trên Fanpage, LinkedIn, TikTok",
                "Xây dựng chiến dịch truyền thông đa kênh",
                "Kết nối đối tác, nhà tài trợ và diễn giả công nghệ",
            ],
            skills: ["Content Writing", "Social Media", "Video Editing", "Public Relations"],
        },
        {
            id: "hr-lg",
            name: "Ban Nhân Sự & Hậu Cần (HR-LG)",
            colorName: "Google Green",
            tag: "People & Operations",
            colorClass: "border-emerald-200/80 hover:border-emerald-500 hover:shadow-emerald-500/10",
            bgHeader: "bg-[#34A853]",
            badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
            icon: UsersIcon,
            desc: "Trái tim kết nối của CLB, quản trị nguồn nhân lực, duy trì văn hóa nội bộ, tổ chức các hoạt động teambuilding và điều phối hậu cần sự kiện.",
            roles: [
                "Quản lý nhân sự, đánh giá và gắn kết thành viên",
                "Lập kế hoạch và điều phối hậu cần sự kiện",
                "Tổ chức teambuilding, sinh nhật và hoạt động văn hóa",
            ],
            skills: ["Event Planning", "Team Management", "Problem Solving", "Logistics"],
        },
    ];

    const handleSelectDepartment = (deptId: string) => {
        // Dispatch custom event to select department in RecruitmentForm
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
        <section id="departments" className="py-20 sm:py-24 bg-white relative scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-800 uppercase tracking-wider">
                        Cơ cấu tổ chức • Departments
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        4 Mảnh ghép tạo nên GDGoC PTIT
                    </h2>
                    <p className="text-base text-zinc-600 font-normal">
                        Mỗi ban chuyên môn đều giữ vai trò cốt lõi trong sự phát triển của câu lạc bộ. Hãy chọn ban phù hợp nhất với đam mê và định hướng của bạn!
                    </p>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {departments.map((dept) => {
                        const IconComponent = dept.icon;
                        return (
                            <div
                                key={dept.id}
                                className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-zinc-50/60 border ${dept.colorClass} transition-all duration-300 hover:shadow-xl hover:bg-white hover:-translate-y-1 flex flex-col justify-between`}
                            >
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-12 h-12 rounded-2xl ${dept.bgHeader} text-white flex items-center justify-center shadow-md shadow-zinc-900/10`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-zinc-900 leading-tight">
                                                    {dept.name}
                                                </h3>
                                                <span className="text-xs text-zinc-500 font-medium">
                                                    {dept.tag}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                                        {dept.desc}
                                    </p>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                                            Nhiệm vụ chính:
                                        </p>
                                        <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-600">
                                            {dept.roles.map((role, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-zinc-400 font-bold">•</span>
                                                    <span>{role}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                                            Kỹ năng & Công cụ:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {dept.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 shadow-2xs"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-zinc-200/60">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectDepartment(dept.id)}
                                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-900 hover:text-[#4285F4] transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
                                    >
                                        <span>Ứng tuyển ban {dept.name.split("(")[0]}</span>
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

