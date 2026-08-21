import Image from "next/image";

export function AboutSection() {
    return (
        <section
            id="about"
            className="relative py-20 sm:py-28 md:py-32 bg-[#00092B] overflow-hidden -scroll-mt-4"
        >
            {/* Seamless Cosmic Background matching Hero and Mission */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                {/* Base radial gradient */}
                <Image
                    src="/blank.svg"
                    alt="Về GDG on Campus: PTIT Background"
                    fill
                    unoptimized
                    className="object-cover object-center w-full h-full"
                    aria-hidden="true"
                />

                {/* Stardust Layers */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen">
                    <Image
                        src="/dust1.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                </div>
                <div className="absolute inset-0 opacity-30 mix-blend-screen scale-110">
                    <Image
                        src="/dust2.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                </div>

                {/* Unified continuous vignette matching Hero and Mission */}
                <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/15 to-black/35" />

                {/* Decorative Planet Accents (placed on margins behind content) */}
                {/* Top-Left Planet (Planet 6 - Magenta / Pink) - positioned closer to text */}
                <div className="absolute top-4 sm:top-8 md:top-12 -left-6 sm:left-4 md:left-10 lg:left-20 xl:left-28 w-36 sm:w-48 md:w-60 aspect-square opacity-65 sm:opacity-75 md:opacity-85 pointer-events-none drop-shadow-[0_0_30px_rgba(234,67,53,0.35)]">
                    <Image
                        src="/planet6.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* Bottom-Right Planet (Planet 4 - Cosmic Blue Ring Planet) */}
                <div className="absolute -bottom-10 sm:-bottom-14 md:-bottom-20 -right-8 sm:right-0 md:right-6 lg:right-14 w-48 sm:w-64 md:w-80 lg:w-96 aspect-square opacity-70 sm:opacity-80 md:opacity-85 pointer-events-none drop-shadow-[0_0_35px_rgba(66,133,244,0.3)]">
                    <Image
                        src="/planet4.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* Sparkling 4-Point Stars */}
                <div className="absolute top-12 right-10 sm:right-20 md:right-32 w-5 sm:w-7 aspect-136/205 opacity-60 pointer-events-none animate-pulse">
                    <Image
                        src="/Star 1.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>
                <div className="absolute bottom-16 left-8 sm:left-16 md:left-28 w-4 sm:w-6 aspect-136/205 opacity-50 pointer-events-none animate-pulse">
                    <Image
                        src="/Star 1.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* Ambient Soft Google Color Glows */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#4285F4]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#EA4335]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-white tracking-wider backdrop-blur-md shadow-xs">
                        <span>Giới thiệu về GDG on Campus</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                        Google Developer Groups <span className="text-[#4285F4] drop-shadow-[0_2px_12px_rgba(66,133,244,0.5)]">on Campus</span>
                    </h2>
                </div>

                {/* Structured 2-Card Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Card 1: Về Google Developer Groups - On Campus */}
                    <div className="group relative rounded-2xl bg-white/4 hover:bg-white/[0.07] border border-white/10 hover:border-[#4285F4]/50 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 shadow-xl flex flex-col justify-start space-y-3.5">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] shadow-[0_0_10px_#4285F4]" />
                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                Về Google Developer Groups - On Campus
                            </h3>
                        </div>
                        <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            Google Developer Groups - On Campus là chương trình được Google cấp quyền tổ chức và hỗ trợ, dành cho sinh viên đam mê CNTT và công nghệ Google. Năm 2026, đã kết nối hơn 2.100 trường đại học thuộc mạng lưới hơn 1.000+ cộng đồng Google Developer Groups bao phủ toàn cầu.
                        </p>
                    </div>

                    {/* Card 2: Về GDG on Campus: PTIT */}
                    <div className="group relative rounded-2xl bg-white/4 hover:bg-white/[0.07] border border-white/10 hover:border-[#EA4335]/50 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 shadow-xl flex flex-col justify-start space-y-3.5">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] shadow-[0_0_10px_#EA4335]" />
                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                Về GDG on Campus: PTIT
                            </h3>
                        </div>
                        <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            Tháng 9/2022, GDG on Campus: PTIT chính thức ra đời, là một chapter của GDGOC tại Học viện Công nghệ Bưu chính Viễn thông. Đây là môi trường lý tưởng để sinh viên tiếp cận tài nguyên Google, học hỏi và phát triển bản thân, cùng nhau tạo ra những giải pháp công nghệ mang lại giá trị tích cực cho cộng đồng.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
