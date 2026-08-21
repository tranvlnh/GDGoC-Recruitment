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
                    alt="Về GDGoC PTIT Background"
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
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/35" />

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
                <div className="absolute top-12 right-10 sm:right-20 md:right-32 w-5 sm:w-7 aspect-[136/205] opacity-60 pointer-events-none animate-pulse">
                    <Image
                        src="/Star 1.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>
                <div className="absolute bottom-16 left-8 sm:left-16 md:left-28 w-4 sm:w-6 aspect-[136/205] opacity-50 pointer-events-none animate-pulse">
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
