import Image from "next/image";
import {
    CodeIcon,
    UsersIcon,
    SparklesIcon,
    RocketIcon,
    TargetIcon,
    CalendarIcon,
} from "./google-icons";

export interface ActivityMilestone {
    id: string;
    period: string;
    title: string;
    desc: string;
    image: string;
    imageAlt: string;
    photoBadge?: string;
    color: "blue" | "red" | "yellow" | "green";
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const ANNUAL_JOURNEY: ActivityMilestone[] = [
    {
        id: "phase-1",
        period: "08/2025 – 09/2025",
        title: "Welcome Freshmen & Campus Booth",
        desc: "Chào đón tân sinh viên và kết nối các bạn với cộng đồng công nghệ tại PTIT.",
        image: "/phase-1.png",
        imageAlt: "Welcome Freshmen & Campus Booth - GDGoC PTIT",
        photoBadge: "Chào đón Tân Sinh Viên",
        color: "blue",
        badge: "Khởi động & Chào đón",
        icon: UsersIcon,
    },
    {
        id: "phase-2",
        period: "10/2025 – 11/2025",
        title: "First All-hands Meeting",
        desc: "Hội ngộ toàn thể thành viên, khởi động nhiệm kỳ và gắn kết đội ngũ.",
        image: "/phase-2.png",
        imageAlt: "First All-hands Meeting - GDGoC PTIT",
        photoBadge: "Hội Quân Toàn CLB",
        color: "red",
        badge: "Hội quân & Gắn kết",
        icon: UsersIcon,
    },
    {
        id: "phase-3",
        period: "11/2025",
        title: "Tech Workshops & Codelabs",
        desc: "Workshop thực hành về Firebase, Cloud và AI cùng các Tech Leads.",
        image: "/phase-3.png",
        imageAlt: "Internal Tech Workshops & Codelabs - GDGoC PTIT",
        photoBadge: "Tech Workshop Thực Chiến",
        color: "yellow",
        badge: "Workshop thực chiến",
        icon: CodeIcon,
    },
    {
        id: "phase-4",
        period: "09/11/2025",
        title: "Probation Demo Day",
        desc: "Các đội trình diễn sản phẩm và nhận phản hồi từ hội đồng chuyên môn.",
        image: "/phase-4.png",
        imageAlt: "Probation Demo Day - GDGoC PTIT",
        photoBadge: "Chung Kết Probation",
        color: "green",
        badge: "Chung kết Probation",
        icon: TargetIcon,
    },
    {
        id: "phase-5",
        period: "08/03/2026",
        title: "Internal Bonding – Women's Day",
        desc: "Hoạt động gắn kết nội bộ và tôn vinh các thành viên nữ của GDGoC.",
        image: "/phase-5.png",
        imageAlt: "Internal Bonding - Women's Day - GDGoC PTIT",
        photoBadge: "Tôn Vinh Phái Đẹp 08/03",
        color: "red",
        badge: "Gắn kết & Tôn vinh",
        icon: SparklesIcon,
    },
    {
        id: "phase-6",
        period: "03/2026",
        title: "GDGoC Hackathon Vietnam Finale",
        desc: "Chung kết hackathon quy mô toàn quốc với các giải pháp công nghệ sinh viên.",
        image: "/phase-6.png",
        imageAlt: "GDGoC Hackathon Vietnam 2026 Finale",
        photoBadge: "Chung Kết Toàn Quốc",
        color: "blue",
        badge: "Đấu trường toàn quốc",
        icon: RocketIcon,
    },
];

const COLOR_SCHEMES = {
    blue: {
        bgBadge: "bg-blue-50 text-blue-700 border-blue-200",
        pillBg: "bg-blue-500/10 text-blue-700 border-blue-200/60",
        iconBg: "bg-[#4285F4] text-white shadow-blue-500/25",
        borderAccent: "border-blue-500/30 hover:border-blue-500",
        glow: "hover:shadow-blue-500/15",
    },
    red: {
        bgBadge: "bg-red-50 text-red-700 border-red-200",
        pillBg: "bg-red-500/10 text-red-700 border-red-200/60",
        iconBg: "bg-[#EA4335] text-white shadow-red-500/25",
        borderAccent: "border-red-500/30 hover:border-red-500",
        glow: "hover:shadow-red-500/15",
    },
    yellow: {
        bgBadge: "bg-amber-50 text-amber-900 border-amber-200",
        pillBg: "bg-amber-500/10 text-amber-800 border-amber-200/60",
        iconBg: "bg-[#F29900] text-white shadow-amber-500/25",
        borderAccent: "border-amber-500/30 hover:border-amber-500",
        glow: "hover:shadow-amber-500/15",
    },
    green: {
        bgBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        pillBg: "bg-emerald-500/10 text-emerald-800 border-emerald-200/60",
        iconBg: "bg-[#34A853] text-white shadow-emerald-500/25",
        borderAccent: "border-emerald-500/30 hover:border-emerald-500",
        glow: "hover:shadow-emerald-500/15",
    },
};

export function ActivitiesSection() {
    return (
        <section id="activities" className="py-20 sm:py-28 bg-[#fdfdfd] relative scroll-mt-20 overflow-hidden">
            {/* Background Google Color Blobs */}
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-2/3 -right-48 w-96 h-96 bg-red-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight text-balance">
                        Google Developer Group on Campus : PTIT
                    </h2>
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
                                    className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}
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
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Activity Content Card */}
                                <div
                                    className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                                >
                                    <div className="p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-xs space-y-4 hover:border-zinc-300 transition-colors">
                                        {/* Period Header */}
                                        <div className="flex items-center gap-2">
                                            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border ${scheme.pillBg}`}>
                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                <span>{item.period}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight">
                                                {item.title}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
