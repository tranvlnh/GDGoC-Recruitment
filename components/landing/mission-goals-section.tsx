import { TargetIcon, CheckCircleIcon, ShieldCheckIcon } from "./google-icons";

export function MissionGoalsSection() {
    const goals = [
        {
            num: "01",
            title: "Nâng cao năng lực thực chiến",
            desc: "Trang bị cho sinh viên kiến thức thực tế về các công nghệ hiện đại như AI, Cloud, Mobile, Web thông qua các dự án thực tế và đào tạo chuyên sâu.",
            color: "border-l-[#4285F4]",
            badgeColor: "bg-blue-50 text-[#4285F4] border-blue-200",
            bgHover: "hover:bg-blue-50/40",
        },
        {
            num: "02",
            title: "Cầu nối chuyên gia & Doanh nghiệp",
            desc: "Mở rộng cơ hội giao lưu, thực tập và việc làm thông qua mạng lưới Google Developer Experts (GDE) và các đối tác công nghệ hàng đầu.",
            color: "border-l-[#EA4335]",
            badgeColor: "bg-red-50 text-[#EA4335] border-red-200",
            bgHover: "hover:bg-red-50/40",
        },
        {
            num: "03",
            title: "Xây dựng các giải pháp tác động xã hội",
            desc: "Khuyến khích sinh viên sáng tạo các sản phẩm công nghệ hữu ích giải quyết các bài toán thực tiễn trong cuộc sống (Google Solution Challenge).",
            color: "border-l-[#FBBC05]",
            badgeColor: "bg-amber-50 text-[#B06000] border-amber-200",
            bgHover: "hover:bg-amber-50/40",
        },
        {
            num: "04",
            title: "Kiến tạo văn hóa sinh viên năng động",
            desc: "Xây dựng môi trường gắn kết, bình đẳng, đa dạng và cởi mở, nơi mọi ý tưởng sáng tạo đều được lắng nghe và nuôi dưỡng.",
            color: "border-l-[#34A853]",
            badgeColor: "bg-emerald-50 text-[#34A853] border-emerald-200",
            bgHover: "hover:bg-emerald-50/40",
        },
    ];

    return (
        <section id="mission" className="py-20 sm:py-24 bg-zinc-50/80 relative border-y border-zinc-200/70 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
                {/* Mission Showcase Banner */}
                <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white shadow-2xl relative overflow-hidden">
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/15 blur-3xl rounded-full pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-blue-300 uppercase tracking-wider">
                                <TargetIcon className="w-3.5 h-3.5 text-[#4285F4]" />
                                <span>Sứ mệnh cốt lõi • Our Mission</span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                                &quot;Thu hẹp khoảng cách giữa lý thuyết giảng đường và công nghệ thực tiễn thế giới.&quot;
                            </h2>
                            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
                                Sứ mệnh của GDGoC PTIT là tạo dựng một bệ phóng vững chắc cho sinh viên công nghệ, nơi mỗi cá nhân đều được trao quyền tự do sáng tạo, học tập từ những thất bại, cọ xát với các chuẩn mực công nghệ toàn cầu và đóng góp giá trị tích cực cho cộng đồng.
                            </p>
                        </div>

                        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-3.5">
                            <div className="flex items-center gap-2 text-[#34A853] font-bold text-sm">
                                <ShieldCheckIcon className="w-5 h-5" />
                                <span>Cam kết giá trị</span>
                            </div>
                            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-200">
                                <li className="flex items-center gap-2.5">
                                    <CheckCircleIcon className="w-4 h-4 text-[#4285F4] shrink-0" />
                                    <span>Học tập qua dự án thực tế (Project-based)</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircleIcon className="w-4 h-4 text-[#EA4335] shrink-0" />
                                    <span>Tôn trọng sự đa dạng & Tinh thần đổi mới</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircleIcon className="w-4 h-4 text-[#FBBC05] shrink-0" />
                                    <span>Kết nối tài nguyên chính thức từ Google</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircleIcon className="w-4 h-4 text-[#34A853] shrink-0" />
                                    <span>Phát triển toàn diện kiến thức & kỹ năng</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Strategic Goals Grid */}
                <div className="space-y-8">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#EA4335]">
                            Chiến lược & Định hướng
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                            Mục tiêu nhiệm kỳ Gen 5
                        </h3>
                        <p className="text-sm text-zinc-600">
                            4 mục tiêu trọng tâm dẫn đường cho các hoạt động và dự án của GDGoC PTIT trong năm học mới.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goals.map((goal, idx) => (
                            <div
                                key={idx}
                                className={`rounded-2xl p-5 sm:p-7 bg-white border border-zinc-200/80 border-l-4 ${goal.color} shadow-xs transition-all duration-300 hover:shadow-md ${goal.bgHover} space-y-3`}
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base sm:text-lg font-bold text-zinc-900">
                                        {goal.title}
                                    </h4>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border ${goal.badgeColor}`}>
                                        Mục tiêu {goal.num}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    {goal.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

