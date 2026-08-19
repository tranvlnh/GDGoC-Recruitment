import Image from "next/image";
import {
    CodeIcon,
    UsersIcon,
    SparklesIcon,
    RocketIcon,
    TargetIcon,
    CheckCircleIcon,
    CalendarIcon,
    GoogleDots
} from "./google-icons";

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
        period: "08/2025 – 09/2025",
        title: "Welcome Freshmen & Campus Booth",
        subtitle: "Đồng hành & Khởi đầu đam mê công nghệ",
        desc: "Chuỗi hoạt động tiếp sức tân sinh viên khóa mới, mở ra cánh cửa kết nối đầu tiên với thế giới lập trình và văn hóa đổi mới sáng tạo chuẩn Google.",
        image: "/phase-1.png",
        imageAlt: "Welcome Freshmen & Campus Booth - GDGoC PTIT",
        photoBadge: "Chào đón Tân Sinh Viên",
        tags: ["#Welcome_Freshmen", "#Campus_Booth", "#Onboarding", "#GDGoC_PTIT"],
        highlights: [
            "Tư vấn, hướng dẫn thủ tục nhập học trực tiếp tại quầy thông tin.",
            "Trải nghiệm minigame công nghệ & nhận quà độc quyền từ Google.",
            "Định hướng lộ trình học tập và cơ hội gia nhập đại gia đình GDGoC.",
        ],
        color: "blue",
        badge: "Khởi động & Chào đón",
        icon: UsersIcon,
    },
    {
        id: "phase-2",
        period: "10/2025 – 11/2025",
        title: "First All-hands Meeting",
        subtitle: "Hội quân toàn CLB & Khởi động nhiệm kỳ",
        desc: "Cột mốc hội ngộ đầu tiên của toàn bộ thành viên, nơi thổi bùng ngọn lửa nhiệt huyết, xây dựng văn hóa gắn kết và sẵn sàng cho các dự án lớn.",
        image: "/phase-2.png",
        imageAlt: "First All-hands Meeting - GDGoC PTIT",
        photoBadge: "Hội Quân Toàn CLB",
        tags: ["#All_Hands", "#Team_Bonding", "#Culture", "#Kickoff"],
        highlights: [
            "Gặp gỡ, kết nối các ban chuyên môn và chào đón tân thành viên.",
            "Công bố chiến lược, lộ trình hoạt động trọng tâm trong nhiệm kỳ.",
            "Xây dựng tinh thần đồng đội cởi mở và tư duy sáng tạo không giới hạn.",
        ],
        color: "red",
        badge: "Hội quân & Gắn kết",
        icon: UsersIcon,
    },
    {
        id: "phase-3",
        period: "11/2025",
        title: "Tech Workshops & Codelabs",
        subtitle: "Đào tạo chuyên môn & Công nghệ thực chiến",
        desc: "Chuỗi workshop kỹ thuật chuyên sâu về Firebase, Cloud và AI do Tech Leads trực tiếp hướng dẫn, chuẩn bị bệ phóng vững chắc cho kỳ Probation.",
        image: "/phase-3.png",
        imageAlt: "Internal Tech Workshops & Codelabs - GDGoC PTIT",
        photoBadge: "Tech Workshop Thực Chiến",
        tags: ["#Tech_Workshop", "#Firebase", "#Google_Cloud", "#Codelabs"],
        highlights: [
            "Thực hành trực tiếp trên hệ sinh thái Google.",
            "Trang bị tư duy phát triển sản phẩm chuẩn quy trình công nghệ.",
            "Cố vấn one-on-one giải quyết bài toán kỹ thuật thực tế.",
        ],
        color: "yellow",
        badge: "Workshop thực chiến",
        icon: CodeIcon,
    },
    {
        id: "phase-4",
        period: "09/11/2025",
        title: "Probation Demo Day",
        subtitle: "Tranh tài dự án & Tốt nghiệp thử thách",
        desc: "Sân khấu bùng nổ khép lại giai đoạn thử thách, nơi các đội thi tự tin demo sản phẩm công nghệ hoàn chỉnh trước Hội đồng Ban giám khảo.",
        image: "/phase-4.png",
        imageAlt: "Probation Demo Day - GDGoC PTIT",
        photoBadge: "Chung Kết Probation",
        tags: ["#Demo_Day", "#Project_Pitch", "#MVP", "#Graduation"],
        highlights: [
            "Thuyết trình và vận hành trực tiếp MVP sản phẩm công nghệ.",
            "Nhận đánh giá và phản biện chuyên sâu từ các chuyên gia đầu ngành.",
            "Vinh danh dự án xuất sắc và trao chứng nhận thành viên chính thức.",
        ],
        color: "green",
        badge: "Chung kết Probation",
        icon: TargetIcon,
    },
    {
        id: "phase-5",
        period: "08/03/2026",
        title: "Internal Bonding – Women's Day",
        subtitle: "Gắn kết đại gia đình & Tôn vinh phái đẹp",
        desc: "Chuyến dã ngoại ấm áp tôn vinh những bóng hồng GDGoC, lan tỏa thông điệp bình đẳng giới và thắt chặt tình cảm đồng đội trong đại gia đình.",
        image: "/phase-5.png",
        imageAlt: "Internal Bonding - Women's Day - GDGoC PTIT",
        photoBadge: "Tôn Vinh Phái Đẹp 08/03",
        tags: ["#Womens_Day", "#Internal_Bonding", "#Women_In_Tech", "#GDGoC_Family"],
        highlights: [
            "Teambuilding bùng nổ năng lượng, gia tăng sự thấu hiểu nội bộ.",
            "Gửi gắm những món quà bất ngờ và lời chúc ý nghĩa đến các bạn nữ.",
            "Nuôi dưỡng văn hóa CLB thân thiện, đoàn kết và sẻ chia.",
        ],
        color: "red",
        badge: "Gắn kết & Tôn vinh",
        icon: SparklesIcon,
    },
    {
        id: "phase-6",
        period: "03/2026",
        title: "GDGoC Hackathon Vietnam Finale",
        subtitle: "Đấu trường lập trình sinh viên toàn quốc",
        desc: "Đêm chung kết cuộc thi Hackathon quy mô toàn quốc do GDGoC PTIT đồng tổ chức – bệ phóng đưa các giải pháp công nghệ sinh viên vươn tầm thực tế.",
        image: "/phase-6.png",
        imageAlt: "GDGoC Hackathon Vietnam 2026 Finale",
        photoBadge: "Chung Kết Toàn Quốc",
        tags: ["#Hackathon_2026", "#Grand_Finale", "#Tech_Talent", "#Google_Solutions"],
        highlights: [
            "Tranh tài đỉnh cao giữa các đội thi xuất sắc nhất trên toàn quốc.",
            "Giao lưu và mở rộng mạng lưới với các GDG Chapters trường bạn.",
            "Khẳng định năng lực tổ chức sự kiện công nghệ quy mô chuyên nghiệp.",
        ],
        color: "blue",
        badge: "Đấu trường toàn quốc",
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
                            Cộng đồng <span className="text-[#FBBC05]">lập trình viên sinh viên</span> <br className="hidden sm:inline" />
                            tiên phong tại <span className="text-[#60a5fa]">PTIT</span>
                        </h2>
                        <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                            <strong className="text-white font-bold bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] bg-clip-text text-transparent">GDGoC PTIT</strong> là{" "}
                            <span className="text-white font-semibold">bệ phóng công nghệ hàng đầu</span> tại{" "}
                            <span className="text-white font-semibold">Học viện Công nghệ Bưu chính Viễn thông</span> – nơi sinh viên cùng học tập, kiến tạo các{" "}
                            <span className="text-[#FBBC05] font-semibold">sản phẩm thực chiến</span> và kết nối trực tiếp với hệ sinh thái{" "}
                            <span className="text-[#60a5fa] font-semibold">Google Developers</span>.
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
                            <span>Hành trình 1 năm • 1 Year Journey</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
                            1 Năm Bứt Phá Cùng GDGoC PTIT
                        </h2>
                        <p className="text-base text-zinc-600 font-normal leading-relaxed">
                            Những dấu ấn nổi bật, workshop công nghệ thực chiến và khoảnh khắc đáng nhớ kiến tạo nên bản sắc GDGoC PTIT.
                        </p>
                    </div>

                    {/* Timeline Container */}
                    <div className="relative space-y-12 sm:space-y-20">
                        {/* Central Connecting Line (Desktop) */}
                        <div
                            className="hidden lg:block absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-1 bg-gradient-to-b from-[#4285F4] via-[#EA4335] via-[#FBBC05] via-[#34A853] via-[#EA4335] to-[#4285F4] opacity-35 rounded-full pointer-events-none"
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
