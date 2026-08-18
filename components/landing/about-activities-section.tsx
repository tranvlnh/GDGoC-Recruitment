import Image from "next/image";
import { CodeIcon, UsersIcon, SparklesIcon, RocketIcon } from "./google-icons";

export function AboutActivitiesSection() {
    const activities = [
        {
            title: "Tech Workshops & Hackathons",
            subtitle: "Trải nghiệm công nghệ thực chiến",
            desc: "Tham gia các buổi workshop chuyên sâu về Web Development, Mobile (Flutter), Cloud Computing, AI/ML và các cuộc thi lập trình thử thách tư duy công nghệ.",
            color: "blue",
            badge: "Technical",
            borderColor: "border-blue-200/80",
            hoverBorder: "hover:border-blue-500",
            hoverGlow: "hover:shadow-blue-500/10",
            badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
            iconBg: "bg-[#4285F4] text-white",
            icon: CodeIcon,
            asset: "/planet4.svg",
        },
        {
            title: "Community & Google Talks",
            subtitle: "Kết nối Google Developer Experts",
            desc: "Gặp gỡ, giao lưu và học hỏi trực tiếp từ các chuyên gia công nghệ, Google Developer Experts (GDE) và cựu thành viên thành công tại các tập đoàn lớn.",
            color: "red",
            badge: "Networking",
            borderColor: "border-red-200/80",
            hoverBorder: "hover:border-red-500",
            hoverGlow: "hover:shadow-red-500/10",
            badgeBg: "bg-red-50 text-red-700 border-red-200",
            iconBg: "bg-[#EA4335] text-white",
            icon: UsersIcon,
            asset: "/planet6.svg",
        },
        {
            title: "Internal Training & Mentorship",
            subtitle: "Đào tạo chuyên môn & kỹ năng mềm",
            desc: "Chương trình đào tạo nội bộ từ cơ bản đến nâng cao, cố vấn 1-1 giúp thành viên bứt phá năng lực lập trình, thiết kế UI/UX, quản lý dự án và giao tiếp.",
            color: "yellow",
            badge: "Growth",
            borderColor: "border-amber-200/80",
            hoverBorder: "hover:border-amber-500",
            hoverGlow: "hover:shadow-amber-500/10",
            badgeBg: "bg-amber-50 text-amber-900 border-amber-200",
            iconBg: "bg-[#F29900] text-white",
            icon: SparklesIcon,
            asset: "/planet1.svg",
        },
        {
            title: "Events & Teambuilding",
            subtitle: "Văn hóa gắn kết & Năng động",
            desc: "Không chỉ học tập và nghiên cứu công nghệ, GDGoC PTIT là một đại gia đình với các hoạt động dã ngoại, sinh nhật, teambuilding tràn đầy năng lượng tuổi trẻ.",
            color: "green",
            badge: "Culture",
            borderColor: "border-emerald-200/80",
            hoverBorder: "hover:border-emerald-500",
            hoverGlow: "hover:shadow-emerald-500/10",
            badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
            iconBg: "bg-[#34A853] text-white",
            icon: RocketIcon,
            asset: "/planet5.svg",
        },
    ];

    return (
        <section id="about" className="py-20 sm:py-24 bg-white relative scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
                {/* About Club Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#4285F4] uppercase tracking-wider">
                        Về chúng tôi • About GDGoC PTIT
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        Cộng đồng lập trình viên sinh viên <br className="hidden sm:inline" />
                        tiên phong tại PTIT
                    </h2>
                    <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
                        <strong>Google Developer Groups on Campus - PTIT (GDGoC PTIT)</strong> là câu lạc bộ công nghệ sinh viên được bảo trợ bởi Google Developers, mang sứ mệnh tạo ra môi trường học tập, giao lưu và phát triển toàn diện cho sinh viên đam mê công nghệ tại Học viện.
                    </p>
                </div>

                {/* Activities Grid */}
                <div id="activities" className="space-y-8 pt-4 scroll-mt-24">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-zinc-100 pb-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#4285F4]">
                                Hoạt động nổi bật
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
                                Trải nghiệm thực tế tại GDGoC
                            </h3>
                        </div>
                        <p className="text-sm text-zinc-500 max-w-sm">
                            Khám phá những hoạt động và sự kiện thường niên giúp bạn phát triển bản thân và bứt phá sự nghiệp.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {activities.map((activity, idx) => {
                            const IconComponent = activity.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`group rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-zinc-50/60 border ${activity.borderColor} ${activity.hoverBorder} transition-all duration-300 hover:shadow-xl ${activity.hoverGlow} hover:bg-white hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className={`w-12 h-12 rounded-2xl ${activity.iconBg} flex items-center justify-center shadow-md shadow-zinc-900/10`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activity.badgeBg}`}>
                                                {activity.badge}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <h4 className="text-xl font-bold text-zinc-900 group-hover:text-[#4285F4] transition-colors">
                                                {activity.title}
                                            </h4>
                                            <p className="text-sm font-semibold text-zinc-500">
                                                {activity.subtitle}
                                            </p>
                                        </div>

                                        <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                                            {activity.desc}
                                        </p>
                                    </div>

                                    {/* Visual preview asset */}
                                    <div className="pt-6 mt-6 border-t border-zinc-200/50 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-zinc-400">GDGoC PTIT Experience</span>
                                        <div className="relative w-16 h-16 opacity-75 group-hover:opacity-100 transition-opacity">
                                            <Image
                                                src={activity.asset}
                                                alt={activity.title}
                                                width={64}
                                                height={64}
                                                className="w-auto h-auto max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

