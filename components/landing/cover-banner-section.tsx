import Image from "next/image";

export function CoverBannerSection() {
    return (
        <section className="relative w-full py-6 sm:py-10 overflow-hidden bg-gradient-to-b from-zinc-100/90 to-white">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-4xl p-2 sm:p-3.5 bg-gradient-to-tr from-white/90 via-white/60 to-white/90 border border-zinc-200/90 shadow-2xl backdrop-blur-md overflow-hidden group">
                    {/* Decorative Corner Google Color Dots */}
                    <div className="absolute top-4 left-4 z-10 w-3 h-3 rounded-full bg-[#4285F4] shadow-sm" />
                    <div className="absolute top-4 right-4 z-10 w-3 h-3 rounded-full bg-[#EA4335] shadow-sm" />
                    <div className="absolute bottom-4 left-4 z-10 w-3 h-3 rounded-full bg-[#FBBC05] shadow-sm" />
                    <div className="absolute bottom-4 right-4 z-10 w-3 h-3 rounded-full bg-[#34A853] shadow-sm" />

                    {/* Full Panoramic Cover Image */}
                    <div className="relative w-full aspect-[2964/1128] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-zinc-950 shadow-inner">
                        <Image
                            src="/cover.png"
                            alt="GDGoC PTIT Full Cover Banner"
                            width={2964}
                            height={1128}
                            priority
                            className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                        />
                    </div>

                    {/* Floating Badges */}
                    <div className="hidden sm:flex absolute top-6 sm:top-8 right-6 sm:right-8 z-10 px-4 py-2 rounded-full bg-white/95 border border-zinc-200/90 shadow-lg backdrop-blur-md items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse" />
                        <span>#GDGoCPTIT</span>
                    </div>

                    <div className="hidden sm:flex absolute bottom-6 sm:bottom-8 left-6 sm:left-8 z-10 px-4 py-2 rounded-full bg-white/95 border border-zinc-200/90 shadow-lg backdrop-blur-md items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] animate-pulse" />
                        <span>#Gen5Recruitment</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
