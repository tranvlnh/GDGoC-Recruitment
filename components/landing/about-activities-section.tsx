import Image from "next/image";
import {
    CodeIcon,
    UsersIcon,
    SparklesIcon,
    RocketIcon,
    CheckCircleIcon,
    CalendarIcon,
    GoogleDots
} from "./google-icons";

/**
 * Kiểu dữ liệu cho từng cột mốc trong hành trình hoạt động thường niên.
 * Người dùng có thể dễ dàng thêm mốc mới hoặc đổi ảnh chỉ bằng cách chỉnh sửa mảng ANNUAL_JOURNEY bên dưới.
 */
export interface ActivityMilestone {
    id: string;
    period: string;
    title: string;
    subtitle: string;
    desc: string;
    image: string;
    imageAlt: string;
    photoBadge?: string;
    tags: string[];
    highlights: string[];
    color: "blue" | "red" | "yellow" | "green";
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
}


export const ANNUAL_JOURNEY: ActivityMilestone[] = [
    {
        id: "phase-1",
        period: "Tháng 10 – Tháng 11",
        title: "Onboarding & Internal Bootcamp",
        subtitle: "Hội nhập & Khởi động đam mê công nghệ",
        desc: "Chuỗi hoạt động chào đón thành viên mới Gen 5, trang bị kiến thức nền tảng về văn hóa Google Developer Groups, quy trình làm việc Agile/Scrum và kết nối mentor 1-on-1.",
        image: "/about.png",
        imageAlt: "GDGoC PTIT Onboarding & Teambuilding",
        photoBadge: "Khởi động Gen 5",
        tags: ["#Onboarding", "#Bootcamp", "#Mentorship_1on1", "#Git_Flow"],
        highlights: [
            "Lễ chào đón tân thành viên & Định hướng phát triển cá nhân",
            "Workshop đào tạo kỹ năng làm việc nhóm & Công cụ phối hợp",
            "Ghép cặp Mentor - Mentee đồng hành trong suốt nhiệm kỳ",
        ],
        color: "blue",
        badge: "Khởi động",
        icon: UsersIcon,
    },
    {
        id: "phase-2",
        period: "Tháng 12 – Tháng 02",
        title: "Tech Workshops & Deep Dives",
        subtitle: "Đào tạo chuyên môn & Tiếp cận công nghệ thực chiến",
        desc: "Các chuỗi workshop chuyên sâu về Web Development, Mobile (Flutter), Cloud Computing và AI/ML do chính các Tech Leads và Google Developer Experts (GDE) trực tiếp hướng dẫn.",
        image: "/internal _workshop.png",
        imageAlt: "GDGoC Tech Workshop & CodeLab",
        photoBadge: "Tech Workshop Thực chiến",
        tags: ["#Flutter", "#Cloud_Computing", "#AI_Gemini", "#CodeLab"],
        highlights: [
            "Chuỗi CodeLab thực hành trực tiếp cùng chuyên gia công nghệ",
            "Tiếp cận hệ sinh thái công nghệ mới nhất từ Google",
            "Chia sẻ kinh nghiệm phỏng vấn & Xây dựng CV công nghệ chuẩn",
        ],
        color: "red",
        badge: "Chuyên môn",
        icon: CodeIcon,
    },
    {
        id: "phase-3",
        period: "Tháng 03 – Tháng 05",
        title: "Hackathons & Google Solution Challenge",
        subtitle: "Tranh tài & Kiến tạo sản phẩm giải quyết bài toán xã hội",
        desc: "Sân chơi bùng nổ năng lượng sáng tạo nơi các nhóm sinh viên phát triển sản phẩm công nghệ hoàn chỉnh tham gia cuộc thi quốc tế Google Solution Challenge và các Hackathon uy tín.",
        image: "/hackathon.jpg",
        imageAlt: "GDGoC Hackathon & Solution Challenge",
        photoBadge: "Hackathon 48H",
        tags: ["#Solution_Challenge", "#Hackathon", "#UN_17_Goals", "#Product_MVP"],
        highlights: [
            "Thử thách lập trình liên tục 48 giờ kiến tạo MVP thực tế",
            "Được cố vấn trực tiếp từ các kỹ sư cấp cao & Ban giám khảo GDE",
            "Cơ hội nhận giải thưởng lớn, Google Swags và vinh danh quốc tế",
        ],
        color: "yellow",
        badge: "Thực chiến",
        icon: SparklesIcon,
    },
    {
        id: "phase-4",
        period: "Tháng 06 – Tháng 08",
        title: "Google I/O Extended & Summer Camp",
        subtitle: "Lan tỏa tri thức & Dã ngoại kết nối đại gia đình",
        desc: "Sự kiện công nghệ thường niên quy mô lớn cập nhật toàn bộ đột phá từ sự kiện toàn cầu Google I/O, kết hợp cùng chuyến đi Summer Teambuilding tràn đầy năng lượng tuổi trẻ.",
        image: "/cover.png",
        imageAlt: "Google I/O Extended & Summer Camp GDGoC PTIT",
        photoBadge: "Google I/O Extended",
        tags: ["#Google_IO_Extended", "#Tech_Talks", "#Summer_Camp", "#Networking"],
        highlights: [
            "Sự kiện quy tụ 500+ sinh viên và chuyên gia công nghệ miền Bắc",
            "Trải nghiệm Demo Booth công nghệ mới và nhận quà Google độc quyền",
            "Chuyến dã ngoại Summer Camp gắn kết toàn bộ thành viên câu lạc bộ",
        ],
        color: "green",
        badge: "Lan toả",
        icon: RocketIcon,
    },
];

const COLOR_SCHEMES = {
    blue: {
        primary: "#4285F4",
        bgBadge: "bg-blue-50 text-blue-700 border-blue-200",
        pillBg: "bg-blue-500/10 text-blue-700 border-blue-200/60",
        iconBg: "bg-[#4285F4] text-white shadow-blue-500/25",
        borderAccent: "border-blue-500/30 hover:border-blue-500",
        glow: "hover:shadow-blue-500/15",
        gradientTag: "from-blue-600 to-indigo-600",
        checkColor: "text-[#4285F4]",
    },
    red: {
        primary: "#EA4335",
        bgBadge: "bg-red-50 text-red-700 border-red-200",
        pillBg: "bg-red-500/10 text-red-700 border-red-200/60",
        iconBg: "bg-[#EA4335] text-white shadow-red-500/25",
        borderAccent: "border-red-500/30 hover:border-red-500",
        glow: "hover:shadow-red-500/15",
        gradientTag: "from-red-600 to-rose-600",
        checkColor: "text-[#EA4335]",
    },
    yellow: {
        primary: "#FBBC05",
        bgBadge: "bg-amber-50 text-amber-900 border-amber-200",
        pillBg: "bg-amber-500/10 text-amber-800 border-amber-200/60",
        iconBg: "bg-[#F29900] text-white shadow-amber-500/25",
        borderAccent: "border-amber-500/30 hover:border-amber-500",
        glow: "hover:shadow-amber-500/15",
        gradientTag: "from-amber-500 to-orange-500",
        checkColor: "text-[#F29900]",
    },
    green: {
        primary: "#34A853",
        bgBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        pillBg: "bg-emerald-500/10 text-emerald-800 border-emerald-200/60",
        iconBg: "bg-[#34A853] text-white shadow-emerald-500/25",
        borderAccent: "border-emerald-500/30 hover:border-emerald-500",
        glow: "hover:shadow-emerald-500/15",
        gradientTag: "from-emerald-600 to-teal-600",
        checkColor: "text-[#34A853]",
    },
};

export function AboutActivitiesSection() {
    return (
        <>
            {/* 1. About GDGoC Section with Background Image */}
            <section id="about" className="relative pt-28 sm:pt-32 pb-20 sm:pb-24 overflow-hidden -scroll-mt-4">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/about.png"
                        alt="Về GDGoC PTIT"
                        fill
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold text-white uppercase tracking-wider">
                            Về chúng tôi • About GDGoC PTIT
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                            Cộng đồng lập trình viên sinh viên <br className="hidden sm:inline" />
                            tiên phong tại PTIT
                        </h2>
                        <p className="text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                            <strong className="text-white">Google Developer Groups on Campus - PTIT (GDGoC PTIT)</strong> là cộng đồng công nghệ tại Học viện Công nghệ Bưu chính Viễn thông, hướng đến việc xây dựng một môi trường năng động dành cho những người yêu thích công nghệ.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Activities Timeline Section (Annual Journey) */}
            <section id="activities" className="py-20 sm:py-28 bg-[#fdfdfd] relative scroll-mt-20 overflow-hidden">
                {/* Background Google Color Blobs */}
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-2/3 -right-48 w-96 h-96 bg-red-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20 relative z-10">
                    {/* Section Header */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#4285F4] uppercase tracking-wider shadow-2xs">
                            <GoogleDots className="w-auto h-auto scale-90" />
                            <span>Hoạt động nổi bật • 1 Year Journey</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
                            Nhìn lại 1 năm hoạt động của GDGoC PTIT
                        </h2>
                        <p className="text-base text-zinc-600 font-normal leading-relaxed">
                            Cùng điểm lại các sự kiện, workshop công nghệ thực chiến và những khoảnh khắc đáng nhớ của câu lạc bộ trong năm học vừa qua.
                        </p>
                    </div>

                    {/* Timeline Container */}
                    <div className="relative space-y-12 sm:space-y-20">
                        {/* Central Connecting Line (Desktop) */}
                        <div
                            className="hidden lg:block absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-1 bg-gradient-to-b from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] opacity-35 rounded-full pointer-events-none"
                            aria-hidden="true"
                        />

                        {ANNUAL_JOURNEY.map((item, idx) => {
                            const scheme = COLOR_SCHEMES[item.color];
                            const IconComponent = item.icon;
                            const isEven = idx % 2 === 0;

                            return (
                                <div
                                    key={item.id}
                                    className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center"
                                >
                                    {/* Center Timeline Icon Node (Desktop) */}
                                    <div
                                        className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border-4 border-zinc-100 shadow-md items-center justify-center group-hover:scale-110 transition-transform"
                                        aria-hidden="true"
                                    >
                                        <div className={`w-7 h-7 rounded-full ${scheme.iconBg} flex items-center justify-center text-white shadow-xs`}>
                                            <IconComponent className="w-3.5 h-3.5" />
                                        </div>
                                    </div>

                                    {/* 1. Visual Photo Card */}
                                    <div
                                        className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"
                                            }`}
                                    >
                                        <div
                                            className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 border ${scheme.borderAccent} shadow-md ${scheme.glow} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                                        >
                                            {/* Photo Container */}
                                            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.imageAlt}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                                {/* Gradient Scrim for Legibility */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                                                {/* Top Badges */}
                                                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                                                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-xs">
                                                        {item.photoBadge || "GDGoC Experience"}
                                                    </span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${scheme.bgBadge} backdrop-blur-md shadow-xs`}>
                                                        {item.badge}
                                                    </span>
                                                </div>

                                                {/* Bottom Floating Tag Pills */}
                                                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.tags.map((tag, tIdx) => (
                                                            <span
                                                                key={tIdx}
                                                                className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white transition-colors"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Content & Highlights Card */}
                                    <div
                                        className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"
                                            }`}
                                    >
                                        <div className="p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-xs space-y-4 hover:border-zinc-300 transition-colors">
                                            {/* Period Header */}
                                            <div className="flex items-center gap-2">
                                                <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border ${scheme.pillBg}`}>
                                                    <CalendarIcon className="w-3.5 h-3.5" />
                                                    <span>{item.period}</span>
                                                </div>
                                            </div>

                                            {/* Title & Subtitle */}
                                            <div className="space-y-1">
                                                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm font-semibold text-zinc-500">
                                                    {item.subtitle}
                                                </p>
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                                                {item.desc}
                                            </p>

                                            {/* Key Highlights Checklist */}
                                            <div className="pt-3 border-t border-zinc-100 space-y-2">
                                                <p className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                                                    Điểm nổi bật:
                                                </p>
                                                <ul className="space-y-2 text-xs sm:text-sm text-zinc-700">
                                                    {item.highlights.map((highlight, hIdx) => (
                                                        <li key={hIdx} className="flex items-start gap-2.5">
                                                            <CheckCircleIcon className={`w-4 h-4 shrink-0 mt-0.5 ${scheme.checkColor}`} />
                                                            <span>{highlight}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
