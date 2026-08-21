import React from "react";
import {
    GoogleDots,
    CodeIcon,
    MegaphoneIcon,
    UsersIcon,
    RocketIcon,
} from "./google-icons";

export function MissionGoalsSection() {
    const pillars = [
        {
            num: "01",
            name: "Learn",
            tagline: "Học hỏi & Thực chiến",
            desc: "Làm chủ AI, Cloud, Web & Mobile qua hệ sinh thái Google và các dự án thực tế.",
            color: "#4285F4",
            topBorder: "border-t-[#4285F4]",
            iconBg: "bg-blue-50 text-[#1a73e8]",
            icon: CodeIcon,
            tags: ["Gemini & Cloud", "Solution Challenge"],
        },
        {
            num: "02",
            name: "Share",
            tagline: "Chia sẻ & Lan tỏa",
            desc: "Lan tỏa tri thức qua Tech Talk, Workshop và các giải pháp công nghệ vì cộng đồng.",
            color: "#EA4335",
            topBorder: "border-t-[#EA4335]",
            iconBg: "bg-red-50 text-[#d93025]",
            icon: MegaphoneIcon,
            tags: ["Tech Talk & Workshop", "Tech for Good"],
        },
        {
            num: "03",
            name: "Connect",
            tagline: "Kết nối & Mở rộng",
            desc: "Giao lưu mạng lưới GDG toàn cầu, kết nối chuyên gia GDE và cơ hội thực tập.",
            color: "#FBBC05",
            topBorder: "border-t-[#FBBC05]",
            iconBg: "bg-amber-50 text-[#b06000]",
            icon: UsersIcon,
            tags: ["GDG Network", "Mentorship"],
        },
        {
            num: "04",
            name: "Grow",
            tagline: "Bứt phá & Phát triển",
            desc: "Rèn luyện tư duy lãnh đạo, kỹ năng mềm và sẵn sàng hội nhập môi trường toàn cầu.",
            color: "#34A853",
            topBorder: "border-t-[#34A853]",
            iconBg: "bg-emerald-50 text-[#188038]",
            icon: RocketIcon,
            tags: ["Leadership", "Global Mindset"],
        },
    ];

    return (
        <section id="mission" className="py-12 sm:py-16 bg-white relative scroll-mt-20 border-y border-zinc-200/70">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">

                {/* 1. Header & Central Mission Statement */}
                <div className="max-w-3xl mx-auto text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
                        <GoogleDots className="shrink-0" />
                        <span>Sứ mệnh cốt lõi</span>
                        <GoogleDots className="shrink-0" />
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                        &ldquo;Thu hẹp khoảng cách giữa giảng đường và công nghệ thực tiễn thế giới.&rdquo;
                    </h2>
                </div>

                {/* 2. 4 Google-Themed Strategic Pillars Grid: Learn, Share, Connect, Grow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                    {pillars.map((pillar) => {
                        const IconComponent = pillar.icon;
                        return (
                            <div
                                key={pillar.num}
                                className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white border border-zinc-200/90 ${pillar.topBorder} border-t-4 transition-all duration-200 hover:shadow-md hover:border-zinc-300 flex flex-col justify-between`}
                            >
                                <div>
                                    {/* Card Top: Icon & Number Badge */}
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${pillar.iconBg}`}
                                        >
                                            <IconComponent className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-zinc-400">
                                            {pillar.num}
                                        </span>
                                    </div>

                                    {/* Title & Tagline */}
                                    <div className="mt-3">
                                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                                            {pillar.name}
                                        </h3>
                                        <p className="text-xs font-semibold text-zinc-500 mt-0.5">
                                            {pillar.tagline}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                                        {pillar.desc}
                                    </p>
                                </div>

                                {/* Compact Highlight Badges */}
                                <div className="pt-3 mt-3.5 border-t border-zinc-100 flex flex-wrap gap-1.5">
                                    {pillar.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-50 text-zinc-700 border border-zinc-200/70"
                                        >
                                            <span
                                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                                style={{ backgroundColor: pillar.color }}
                                            />
                                            <span>{tag}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
