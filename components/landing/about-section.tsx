import Image from "next/image";

export function AboutSection() {
    return (
        <section id="about" className="relative pt-28 sm:pt-32 pb-20 sm:pb-24 overflow-hidden -scroll-mt-4">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/about.png"
                    alt="Về GDGoC PTIT"
                    fill
                    className="object-cover object-center"
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center space-y-6">
                    {/* Motto Title */}
                    <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1">
                        <span className="text-[#4285F4] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">Learn</span>
                        <span className="text-white/50 font-light">·</span>
                        <span className="text-[#EA4335] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">Share</span>
                        <span className="text-white/50 font-light">·</span>
                        <span className="text-[#FBBC05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">Connect</span>
                        <span className="text-white/50 font-light">·</span>
                        <span className="text-[#34A853] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">Grow</span>
                    </h2>

                    {/* Google Color Accent Divider */}
                    <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] shadow-md" />

                    {/* Structured Text Content */}
                    <div className="space-y-4 pt-2 max-w-3xl mx-auto">
                        <p className="text-base sm:text-lg md:text-xl text-white font-normal leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_12px_rgba(0,0,0,0.95)]">
                            <strong className="text-white font-bold">
                                GDG on Campus: PTIT
                            </strong>{" "}
                            là chapter chính thức thuộc mạng lưới{" "}
                            <span className="text-white font-semibold">Google Developer Groups (GDG)</span> toàn cầu, thành lập năm <span className="text-white font-semibold">2022</span> tại{" "}
                            <span className="text-white font-semibold">Học viện Công nghệ Bưu chính Viễn thông</span>.
                        </p>

                        <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed font-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_12px_rgba(0,0,0,0.95)]">
                            Với sứ mệnh truyền cảm hứng thay đổi tích cực cho cộng đồng thông qua các giải pháp công nghệ sáng tạo, <strong className="text-white font-semibold">GDG on Campus: PTIT</strong> tạo môi trường học tập cởi mở, nơi sinh viên cùng nhau khám phá công nghệ <span className="text-white font-semibold">Google</span>, xây dựng <span className="text-white font-semibold">sản phẩm thực chiến</span> và phát triển toàn diện qua các workshop, hackathon và dự án thực tế mang lại giá trị cho cộng đồng.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
