import React from "react";
import {
    GoogleDots,
    CodeIcon,
    GlobeIcon,
    RocketIcon,
    UsersIcon,
} from "./google-icons";

export function MissionGoalsSection() {
    const pillars = [
        {
            num: "01",
            title: "Nâng cao năng lực\nthực chiến",
            english: "Tech Excellence",
            desc: "Trang bị kỹ năng lập trình thực tế qua hệ sinh thái Google (AI, Cloud, Flutter, Web) và Google Solution Challenge.",
            color: "#4285F4",
            border: "border-blue-200/80 hover:border-[#4285F4]",
            badge: "bg-blue-50 text-[#1a73e8] border-blue-200",
            icon: CodeIcon,
            points: [
                "Dự án thực tế (Project-based)",
                "Tiếp cận Google Cloud & Gemini",
            ],
        },
        {
            num: "02",
            title: "Cầu nối chuyên gia\n& Doanh nghiệp",
            english: "Industry Network",
            desc: "Mở rộng cơ hội giao lưu, thực tập và việc làm qua mạng lưới Google Developer Groups (GDG) và đối tác công nghệ.",
            color: "#EA4335",
            border: "border-red-200/80 hover:border-[#EA4335]",
            badge: "bg-red-50 text-[#d93025] border-red-200",
            icon: GlobeIcon,
            points: [
                "Tech Talk cùng chuyên gia GDG",
                "Cố vấn định hướng nghề nghiệp",
            ],
        },
        {
            num: "03",
            title: "Kiến tạo giải pháp\ntác động xã hội",
            english: "Social Impact",
            desc: "Khuyến khích sinh viên sáng tạo các sản phẩm công nghệ hữu ích giải quyết bài toán thực tế vì cộng đồng (Tech for Good).",
            color: "#FBBC05",
            border: "border-amber-200/80 hover:border-[#FBBC05]",
            badge: "bg-amber-50 text-[#b06000] border-amber-200",
            icon: RocketIcon,
            points: [
                "Giải pháp vì cộng đồng (SDGs)",
                "Ươm mầm ý tưởng khởi nghiệp",
            ],
        },
        {
            num: "04",
            title: "Xây dựng văn hóa\nđa dạng & hòa nhập",
            english: "Inclusive Community",
            desc: "Xây dựng môi trường bình đẳng, cởi mở và gắn kết, nơi mọi ý tưởng sáng tạo đều được tôn trọng và phát triển.",
            color: "#34A853",
            border: "border-emerald-200/80 hover:border-[#34A853]",
            badge: "bg-emerald-50 text-[#188038] border-emerald-200",
            icon: UsersIcon,
            points: [
                "Văn hóa hòa đồng cởi mở",
                "Trao đổi và sẻ chia kiến thức",
            ],
        },
    ];

    return (
        <section id="mission" className="py-16 sm:py-20 bg-white relative scroll-mt-20 border-y border-zinc-200/70">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">

                {/* 1. Header & Central Mission Statement */}
                <div className="max-w-3xl mx-auto text-center space-y-3.5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-xs font-bold text-zinc-700 uppercase tracking-wider">
                        <GoogleDots className="shrink-0" />
                        <span>Sứ mệnh cốt lõi • Our Mission</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                        &ldquo;Thu hẹp khoảng cách giữa lý thuyết giảng đường và công nghệ thực tiễn thế giới.&rdquo;
                    </h2>

                    <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto font-normal">
                        GDGoC PTIT là bệ phóng giúp sinh viên làm chủ công nghệ mới, cọ xát với các chuẩn mực toàn cầu của Google và sẵn sàng bứt phá trong sự nghiệp.
                    </p>
                </div>

                {/* 2. 4 Google-Themed Strategic Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
                    {pillars.map((pillar) => {
                        const IconComponent = pillar.icon;
                        return (
                            <div
                                key={pillar.num}
                                className={`rounded-2xl p-5 sm:p-6 bg-zinc-50/70 border ${pillar.border} transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between`}
                            >
                                <div className="space-y-4">
                                    {/* Card Top: Icon & Number Badge */}
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs"
                                            style={{ backgroundColor: pillar.color }}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold border ${pillar.badge}`}>
                                            {pillar.num}
                                        </span>
                                    </div>

                                    {/* Title & Subtitle: Unified Height for Perfect Horizontal Alignment */}
                                    <div className="min-h-[58px] flex flex-col justify-start">
                                        <h3 className="text-base font-bold text-zinc-900 leading-snug whitespace-pre-line">
                                            {pillar.title}
                                        </h3>
                                        <span className="text-[11px] font-semibold text-zinc-500 block mt-1">
                                            {pillar.english}
                                        </span>
                                    </div>

                                    {/* Description: Unified Min-Height for Consistent Baseline */}
                                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed min-h-[76px] sm:min-h-[84px]">
                                        {pillar.desc}
                                    </p>
                                </div>

                                {/* Key Bullet Points: Aligned Bottom Strip */}
                                <div className="pt-4 mt-4 border-t border-zinc-200/70 space-y-2">
                                    {pillar.points.map((pt, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-zinc-600">
                                            <span
                                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                                style={{ backgroundColor: pillar.color }}
                                            />
                                            <span className="leading-tight font-medium truncate sm:whitespace-normal">
                                                {pt}
                                            </span>
                                        </div>
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
