"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    GoogleDots,
    CodeIcon,
    PaletteIcon,
    MegaphoneIcon,
    UsersIcon,
    ArrowRightIcon,
    MapPinIcon,
    MailIcon,
    FacebookIcon,
} from "@/components/landing/google-icons";


function ShareIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
    );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );
}

export function JobDescriptionView() {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#00092B] text-zinc-100 selection:bg-blue-500 selection:text-white">
            {/* Cosmic Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <Image
                    src="/blank.svg"
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-center w-full h-full opacity-60"
                    aria-hidden="true"
                />
                <div className="absolute inset-0 opacity-30 mix-blend-screen animate-pulse-glow">
                    <Image src="/dust1.svg" alt="" fill unoptimized className="object-cover object-center" aria-hidden="true" />
                </div>
                <div className="absolute inset-0 opacity-25 mix-blend-screen">
                    <Image src="/dust2.svg" alt="" fill unoptimized className="object-cover object-center" aria-hidden="true" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>

            {/* Glowing Decorative Planets in Background */}
            <div className="fixed top-24 -left-12 w-48 sm:w-64 aspect-square opacity-30 pointer-events-none drop-shadow-[0_0_35px_rgba(66,133,244,0.3)] z-0">
                <Image src="/planet4.svg" alt="" fill unoptimized className="object-contain animate-breathe" aria-hidden="true" />
            </div>
            <div className="fixed bottom-32 -right-16 w-56 sm:w-80 aspect-square opacity-25 pointer-events-none drop-shadow-[0_0_35px_rgba(234,67,53,0.3)] z-0">
                <Image src="/planet6.svg" alt="" fill unoptimized className="object-contain animate-planet-breathe" aria-hidden="true" />
            </div>

            {/* Sticky Floating Subpage Header */}
            <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 lg:px-10 pointer-events-none transition-all duration-300">
                <nav
                    aria-label="Job Description Navigation"
                    className="pointer-events-auto transition-all duration-300 rounded-full border px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 max-w-[1400px] mx-auto bg-[#00092B]/85 backdrop-blur-xl border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(66,133,244,0.15)]"
                >
                    {/* Brand Logo & Back to Home */}
                    <Link
                        href="/"
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg flex items-center gap-2 group shrink-0"
                        title="Về trang chủ GDG on Campus: PTIT"
                    >
                        <div className="flex items-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                            <Image
                                src="/logo_small.svg"
                                alt="GDG on Campus: PTIT"
                                width={1125}
                                height={622}
                                priority
                                className="h-6 sm:h-7 w-auto object-contain md:hidden"
                            />
                            <Image
                                src="/logo.svg"
                                alt="Google Developer Groups on Campus: PTIT"
                                width={642}
                                height={55}
                                priority
                                className="hidden md:block h-7 lg:h-8 w-auto object-contain"
                            />
                        </div>
                    </Link>

                    {/* Action Group */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/"
                            className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all"
                        >
                            Trang chủ
                        </Link>
                        <a
                            href="/#apply"
                            className="relative group inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#4285F4] to-[#1a73e8] hover:from-[#3b78e7] hover:to-[#1765cc] rounded-full shadow-[0_0_16px_rgba(66,133,244,0.4)] hover:shadow-[0_0_24px_rgba(66,133,244,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30 shrink-0"
                        >
                            <span>Đăng ký ngay</span>
                            <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 sm:space-y-12">
                {/* Header Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <GoogleDots />
                        <span className="text-xs sm:text-sm font-bold tracking-wider text-zinc-300">
                            GDG on Campus: PTIT • Job Description
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-200 bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
                        >
                            <ShareIcon className="w-3.5 h-3.5 text-amber-400" />
                            <span>{copied ? "Đã chép link!" : "Chia sẻ"}</span>
                        </button>
                    </div>
                </div>

                {/* 1. TỔNG QUAN */}
                <section id="tong-quan" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                        <span>TỔNG QUAN</span>
                    </h1>

                    <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                        <p>
                            <strong className="text-white">GDG on Campus: PTIT</strong> là tên gọi viết tắt của “<strong className="text-white">Google Developer Groups on Campus: PTIT</strong>” – câu lạc bộ được Google cấp quyền tổ chức và hỗ trợ, dành cho sinh viên có niềm yêu thích CNTT nói chung và công nghệ Google nói riêng. GDG on Campus chính thức hoạt động tại Việt Nam vào năm 2019 với 8 CLB tại Hà Nội, Đà Nẵng và TPHCM. 49 sự kiện đã được tổ chức với hơn 2000 người tham gia. Đến năm 2023, GDG on Campus đã có 26 CLB tại Hà Nội, Đà Nẵng, TPHCM và Cần Thơ.
                        </p>
                        <p>
                            Tháng 9 năm 2022, <strong className="text-white">GDG on Campus: PTIT</strong> chính thức gia nhập mạng lưới GDG on Campus toàn cầu. Tuy là một CLB sinh sau đẻ muộn tại PTIT, <strong className="text-white">GDG on Campus: PTIT</strong> tự hào về những hoạt động đã có tính đến thời điểm hiện tại, về sứ mệnh tạo ra một cộng đồng dành cho những người đam mê Công nghệ, nơi có thể học tập, chia sẻ, cống hiến.
                        </p>
                        <div>
                            <p className="font-semibold text-white mb-2">
                                <strong className="text-white">GDG on Campus: PTIT</strong> hoạt động chủ yếu 2 mảng bao gồm:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-zinc-200 ml-2">
                                <li>Technical Department</li>
                                <li>Non - Technical Department</li>
                            </ul>
                        </div>
                        <p className="pt-1">
                            Bạn có thể tìm hiểu thêm về <strong className="text-white">GDG on Campus: PTIT</strong> tại:{" "}
                            <a
                                href="https://gdscptit.dev/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
                            >
                                https://gdscptit.dev/
                            </a>
                        </p>
                    </div>
                </section>

                {/* 2. TUYỂN THÀNH VIÊN GEN 5 */}
                <section id="tuyen-thanh-vien-gen-5" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
                        <span>TUYỂN THÀNH VIÊN GEN 5</span>
                    </h1>

                    <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                        <p>
                            Với mong muốn tìm ra những nhân tố tích cực để cùng nhau xây dựng một cộng đồng các thế hệ sinh viên gắn kết, năng động và bền vững cùng nhau học hỏi và phát triển, GDG on Campus: PTIT xin thông báo tuyển thành viên thế hệ thứ 5, nhiệm kỳ 2026-2027
                        </p>

                        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                            <div className="flex items-center gap-2">
                                <strong className="text-white">Link đơn đăng ký:</strong>
                                <a
                                    href="/#apply"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                                >
                                    <span>Đăng ký tại đây</span>
                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                </a>
                            </div>
                            <p>
                                <strong className="text-white">Hạn đăng ký:</strong> 23:59, ngày 01/09/2026
                            </p>
                            <div>
                                <strong className="text-white block mb-1">Vị trí:</strong>
                                <ul className="space-y-0.5 ml-2 text-zinc-200">
                                    <li>• Technical</li>
                                    <li>• Nhân sự - Hậu cần</li>
                                    <li>• Truyền thông</li>
                                    <li>• Design</li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                            <p className="font-bold text-white">📌 📌 Mọi thông tin chi tiết liên liên hệ:</p>
                            <ul className="space-y-1.5 text-zinc-200">
                                <li className="flex items-center gap-2">
                                    <MailIcon className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>- Email: </span>
                                    <a href="mailto:contact@gdscptit.dev" className="text-blue-400 hover:underline">contact@gdscptit.dev</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FacebookIcon className="w-4 h-4 text-[#1877F2] shrink-0" />
                                    <span>- Facebook: </span>
                                    <a href="https://www.facebook.com/gdsc.ptit" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">fb.com/gdsc.ptit</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                                    <span>- Instagram: </span>
                                    <a href="https://www.instagram.com/gdsc.ptit" target="_blank" rel="noreferrer" className="text-pink-400 hover:underline">@gdsc.ptit</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <PhoneIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>- Mobile: </span>
                                    <a href="tel:0985302101" className="text-emerald-400 hover:underline">0985302101 (Mr. Minh)</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. YÊU CẦU CÔNG VIỆC CHUNG */}
                <section id="yeu-cau-cong-viec-chung" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
                        <span>YÊU CẦU CÔNG VIỆC CHUNG</span>
                    </h1>

                    <ul className="list-disc list-inside space-y-2.5 text-sm sm:text-base text-zinc-300 leading-relaxed">
                        <li>Là sinh viên trên địa bàn Hà Nội, có niềm đam mê Công nghệ và yêu thích GDG on Campus: PTIT</li>
                        <li>Cam kết làm việc một cách nghiêm túc, có trách nhiệm với CLB ít nhất đến trước khi bắt đầu năm học 2026 – 2027</li>
                        <li>Có trách nhiệm trong công việc, thời gian làm việc trung bình: 8 - 10 giờ/tuần (hoặc hơn) bao gồm họp ban, họp nhóm, hoàn thành công việc, khoảng thời gian chạy sự kiện có thể làm việc nhiều hơn</li>
                        <li>Tự chịu trách nhiệm bất cứ việc làm của bản thân theo từng mức độ hình phạt: tài chính, làm việc,... rời khỏi CLB</li>
                        <li>Cụ thể nội quy CLB sẽ được phổ biến khi là thành viên chính thức.</li>
                    </ul>
                </section>

                {/* 4. QUYỀN LỢI CHUNG */}
                <section id="quyen-loi-chung" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
                        <span>QUYỀN LỢI CHUNG</span>
                    </h1>

                    <ul className="list-disc list-inside space-y-2.5 text-sm sm:text-base text-zinc-300 leading-relaxed">
                        <li>Được truy cập vào nguồn tài nguyên Google Developer</li>
                        <li>Nhận các quà tặng từ Google/Google Developer dựa trên khả năng hoàn thành công việc.</li>
                        <li>Mở rộng mối quan hệ, có cơ hội được kết nối trong cộng đồng Google Developer và các chuyên gia trong lĩnh vực công nghệ</li>
                        <li>Nâng cao kỹ năng chuyên sâu và tầm nhìn thông qua các hoạt động thực tiễn, các buổi hội thảo, trao đổi, thảo luận</li>
                        <li>Tiếp cận các cơ hội học tập, làm việc, các cuộc thi, sự kiện Công nghệ liên quan.</li>
                        <li>Được làm việc cả online và offline, giờ giấc linh hoạt</li>
                        <li>Được giao lưu, làm việc trong môi trường chuyên nghiệp, năng động, hòa đồng.</li>
                        <li>Được training kiến thức của các ban</li>
                        <li>Nâng cao kỹ năng mềm: teamwork, thuyết trình, xử lý công việc,v.v...</li>
                        <li>Nhận certificate cuối nhiệm kỳ khi hoàn thành trên 80% công việc.</li>
                    </ul>

                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-sm sm:text-base text-zinc-200">
                        <p>
                            <strong className="text-white">Đặc biệt:</strong> Cơ hội với tới vị trí trong core team/ <strong className="text-white">GDG on Campus: PTIT</strong> Lead nếu thể hiện xuất sắc trong công việc và có tinh thần lãnh đạo.
                        </p>
                    </div>
                </section>

                {/* 5. TECHNICAL DEPARTMENT */}
                <section id="technical-department" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-[#4285F4]/30 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#4285F4]/20 border border-[#4285F4]/40 flex items-center justify-center text-[#4285F4] shrink-0">
                            <CodeIcon className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            TECHNICAL DEPARTMENT
                        </h1>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#4285F4] uppercase tracking-wider">
                            MÔ TẢ CÔNG VIỆC
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                            Hoạt động đào tạo và lập trình sản phẩm là một trong những hoạt động cốt lõi, chủ yếu nhất của CLB. GDG on Campus: PTIT đang tìm kiếm những người bạn đồng hành có niềm đam mê về lĩnh vực này. Bạn sẽ là người tham gia xây dựng các sản phẩm, dự án về công nghệ của CLB, hỗ trợ team PR về những content liên quan đến công nghệ, đồng thời hỗ trợ các team khác các vấn đề về công nghệ để có thể giải quyết công việc năng suất, hiệu quả hơn.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#4285F4] uppercase tracking-wider">
                            NỘI DUNG CÔNG VIỆC
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <li>Tham gia đào tạo/được đào tạo các công nghệ liên quan: training nội bộ CLB/khoá học, cuộc thi Google tổ chức,…</li>
                            <li>Xây dựng các sản phẩm công nghệ cùng các thành viên trong CLB</li>
                            <li>Tham gia và hỗ trợ các sự kiện công nghệ do CLB tổ chức</li>
                            <li>Chia sẻ kiến thức về công nghệ, dùng khả năng/sản phẩm công nghệ của mình để hỗ trợ các team khác làm việc tốt hơn.</li>
                        </ul>
                    </div>

                    <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-[#4285F4]/40">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            PHÁT TRIỂN DỰ ÁN
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <li>Cơ hội cọ xát thực chiến: Tham gia vào các dự án nhỏ có tính sáng tạo, từ đó học cách biến ý tưởng thành sản phẩm thực tế.</li>
                            <li>Rèn kỹ năng teamwork: Không chỉ biết code, mà còn học cách phối hợp, phân chia task, quản lý deadline.</li>
                            <li>Học hỏi quy trình làm sản phẩm: Được trải nghiệm quy trình từ phân tích yêu cầu, thiết kế, phát triển, test đến deploy, gần giống công việc thực tế của lập trình viên.</li>
                            <li>Tham gia cuộc thi công nghệ: Có cơ hội đem sản phẩm đi thi đấu ở các hackathon, contest,....</li>
                            <li>Mentor hỗ trợ: Được hướng dẫn bởi các anh chị trong CLB, tránh cảnh bơi trong bug vô tận mà không ai cứu.</li>
                        </ul>
                    </div>

                    <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-[#4285F4]/40">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            HỖ TRỢ HỌC THUẬT
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <li>Trải nghiệm hệ thống làm bài online: nền tảng online judge riêng của CLB để luyện code, làm quiz, nộp bài tập.</li>
                            <li>Tự động chấm điểm: Nộp code xong biết ngay đúng sai, không phải chờ “thầy chấm” hay mất công chạy tay.</li>
                            <li>Lưu trữ lịch sử học tập: Theo dõi tiến trình luyện tập của bản thân, thấy rõ mình đang mạnh ở đâu, yếu ở đâu.</li>
                            <li>Kho đề phong phú: Có sẵn các bài tập từ cơ bản đến nâng cao, bám sát môn học trên trường, dễ ôn thi cuối kỳ.</li>
                            <li>Môi trường thực hành chuyên nghiệp: Giống như mấy judge online (Kiểu LeetCode, Codeforces mini phiên bản PTIT), vừa học vừa quen với format thi thực tế.</li>
                            <li>Cộng đồng cùng học: Làm bài trên chung một nền tảng, có leaderboard, có trao đổi thảo luận, kích thích cạnh tranh healthy.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#4285F4] uppercase tracking-wider">
                            YÊU CẦU CÔNG VIỆC
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <li>Có kiến thức cơ bản về lập trình, đặc biệt các công nghệ của Google là 1 lợi thế.</li>
                            <li>Ham học hỏi, thường xuyên update công nghệ mới</li>
                            <li>Có tính kiên trì, sẵn sàng học hỏi và tiếp thu kiến thức mới</li>
                            <li>Biết lắng nghe, đóng góp khi đang xây dựng dự án</li>
                            <li>Tư duy mở và sẵn sàng tiếp nhận cũng như đóng góp với mọi người trong team</li>
                            <li>Thích ứng với văn hoá chung của GDG on Campus: PTIT và đảm bảo thời gian làm việc trong nhiệm kỳ năm học 2026-2027).</li>
                        </ul>
                    </div>
                </section>

                {/* 6. NON-TECHNICAL DEPARTMENT – PR */}
                <section id="pr-department" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-[#FBBC05]/30 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FBBC05]/20 border border-[#FBBC05]/40 flex items-center justify-center text-[#FBBC05] shrink-0">
                            <MegaphoneIcon className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            NON-TECHNICAL DEPARTMENT – PR
                        </h1>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#FBBC05] uppercase tracking-wider">
                            MÔ TẢ CÔNG VIỆC
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                            PR là vị trí tận dụng khả năng sáng tạo vào việc sản xuất nội dung trên các phương tiện truyền thông để thu hút khán giả. Phối hợp với các thành viên và phòng ban khác để lên nội dung và kế hoạch truyền thông. Quản lý, kiểm duyệt và điều chỉnh nội dung trên các kênh truyền thông của GDG on Campus: PTIT.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#FBBC05] uppercase tracking-wider">
                            NỘI DUNG CÔNG VIỆC
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <li>Tham gia lập kế hoạch và triển khai nội dung trên các phương tiện truyền thông</li>
                            <li>Nghiên cứu, nắm bắt xu hướng và sáng tạo nội dung cho các kênh và các sự kiện</li>
                            <li>Quản lý các kênh truyền thông (Fanpage,Linkedin,...): tương tác, phản hồi tin nhắn, bình luận,…</li>
                            <li>Phối hợp với designer và các phòng ban khác để xây dựng hình ảnh phù hợp với đối tượng mục tiêu</li>
                            <li>Phân tích số liệu nội dung trên các nền tảng để hiểu các vấn đề và triển khai các giải pháp.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#FBBC05] uppercase tracking-wider">
                            YÊU CẦU CÔNG VIỆC
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <li>Khả năng sáng tạo, xây dựng nội dung</li>
                            <li>Có khả năng viết, phong cách viết trẻ trung, hiện đại, phù hợp đối tượng mục tiêu</li>
                            <li>Chủ động tìm tòi, sáng tạo các nội dung mới, cập nhật các xu hướng</li>
                            <li>Khả năng giao tiếp và làm việc nhóm, quản lý thời gian và trách nhiệm với công việc</li>
                            <li>Biết sử dụng các công cụ của Google (Google Docs, Google Sheets, Google Slides,... ) là một lợi thế</li>
                            <li>Có đam mê Công nghệ, thích ứng với văn hoá chung của GDG on Campus: PTIT và đảm bảo thời gian làm việc trong nhiệm kỳ năm học (2026-2027).</li>
                        </ul>
                    </div>
                </section>

                {/* 7. NON-TECHNICAL DEPARTMENT – DESIGN */}
                <section id="design-department" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-[#EA4335]/30 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EA4335]/20 border border-[#EA4335]/40 flex items-center justify-center text-[#EA4335] shrink-0">
                            <PaletteIcon className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            NON-TECHNICAL DEPARTMENT – DESIGN
                        </h1>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#EA4335] uppercase tracking-wider">
                            MÔ TẢ CÔNG VIỆC
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                            Designer là vị trí tạo ra sản phẩm thiết kế dựa trên branding Google. Vị trí này sẽ là người định hình lên những giá trị hình ảnh trên mạng xã hội, ấn phẩm trong sự kiện từ những ý tưởng được tạo ra bởi GDG on Campus: PTIT .
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#EA4335] uppercase tracking-wider">
                            NỘI DUNG CÔNG VIỆC
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <li>Tạo ra các ấn phẩm thiết kế cho các nền tảng truyền thông của GDG on Campus:PTIT và thực hiện các ấn phẩm quảng bá khác (in ấn offline, slide…)</li>
                            <li>Sử dụng những màu sắc và bố cục hài hòa cho mỗi sản phẩm, đề xuất ý tưởng thiết kế phù hợp với hình ảnh của GDG on Campus:PTIT.</li>
                            <li>Cộng tác với các thành viên và phòng ban khác để thực hiện và hoàn thành kế hoạch.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#EA4335] uppercase tracking-wider">
                            YÊU CẦU CÔNG VIỆC
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <li>Khả năng thiết kế ấn phẩm truyền thông và tư duy sáng tạo (bố cục, màu sắc,...)</li>
                            <li>Ham học hỏi, kiên trì và sẵn sàng đổi mới, lắng nghe tiếp thu ý kiến</li>
                            <li>Biết sử dụng các công cụ của Google (Google Docs, Google Sheets, Google Slides,... )</li>
                            <li>Hiểu biết cơ bản các công cụ, phần mềm thiết kế (Ps, Ai,...) là một lợi thế</li>
                            <li>Khả năng giao tiếp và làm việc nhóm, quản lý thời gian, trách nhiệm với công việc</li>
                            <li>Có đam mê và thích ứng với văn hóa chung của GDG on Campus:PTIT, đảm bảo thời gian làm việc trong nhiệm kỳ năm học (2026-2027).</li>
                        </ul>
                    </div>
                </section>

                {/* 8. NON-TECHNICAL DEPARTMENT | NHÂN SỰ-HẬU CẦN */}
                <section id="hr-department" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-[#34A853]/30 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#34A853]/20 border border-[#34A853]/40 flex items-center justify-center text-[#34A853] shrink-0">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            NON-TECHNICAL DEPARTMENT | NHÂN SỰ-HẬU CẦN
                        </h1>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#34A853] uppercase tracking-wider">
                            MÔ TẢ CÔNG VIỆC
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                            Là một thành viên của ban Nhân sự - Hậu cần, bạn sẽ là người điều hành, kết nối và đảm bảo guồng máy GDG on Campus: PTIT vận hành một cách trơn tru nhất.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#34A853] uppercase tracking-wider">
                            NỘI DUNG CÔNG VIỆC
                        </h2>
                        <div className="space-y-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <div>
                                <p className="font-bold text-white mb-1">• Lập kế hoạch & Tổ chức:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Lên ý tưởng, xây dựng và &quot;chủ xị&quot; các hoạt động gắn kết thành viên (sinh hoạt hàng tuần, team building, tiệc sinh nhật...).</li>
                                    <li>Đầu tàu trong việc lên kế hoạch và tổ chức các đợt tuyển quân hoặc các buổi training kỹ năng cho thành viên.</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">• Điều phối & Hỗ trợ:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Theo dõi tiến độ công việc của các ban khác, đóng vai trò điều phối viên để đảm bảo mọi dự án đều đi đúng mục tiêu.</li>
                                    <li>Là &quot;hậu phương vững chắc&quot;, hỗ trợ các ban khác về công tác hậu cần cho các sự kiện.</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">• Vận hành & Gắn kết:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Xây dựng các kế hoạch đánh giá, vinh danh và khen thưởng để ghi nhận sự đóng góp của các thành viên.</li>
                                    <li>Chăm sóc đời sống tinh thần của CLB, là người lắng nghe, quan tâm và khéo léo xử lý các mâu thuẫn nội bộ.</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">• Quản lý & Giấy tờ:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Là &quot;tay hòm chìa khóa&quot; quản lý nguồn tài chính của Câu lạc bộ.</li>
                                    <li>Chịu trách nhiệm soạn thảo, quản lý các giấy tờ, thư từ, văn kiện quan trọng liên quan đến CLB.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#34A853] uppercase tracking-wider">
                            YÊU CẦU CÔNG VIỆC
                        </h2>
                        <div className="space-y-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
                            <p>
                                <strong className="text-white">• Về tính cách:</strong> Bạn cẩn thận, tinh tế, nhiệt tình, chủ động và luôn có tinh thần học hỏi, không ngại thử thách.
                            </p>
                            <div>
                                <strong className="text-white block mb-1">• Về kỹ năng:</strong>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Giao tiếp tự tin, hòa đồng, biết lắng nghe và có khả năng xử lý tình huống tốt.</li>
                                    <li>Có kỹ năng bonding, thích tổ chức các hoạt động gắn kết mọi người.</li>
                                    <li>Kỹ năng làm việc nhóm tốt và có trách nhiệm cao với công việc chung.</li>
                                    <li>Biết sử dụng các công cụ văn phòng của Google (Docs, Sheets, Slides,...) là một lợi thế lớn!</li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-white block mb-1">• Về cam kết:</strong>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Chủ động sắp xếp thời gian dành cho các hoạt động của CLB.</li>
                                    <li>Có đam mê với môi trường CLB, thích ứng nhanh với văn hóa chung của GDG on Campus: PTIT.</li>
                                    <li>Cam kết đồng hành cùng CLB trong suốt nhiệm kỳ năm học (2026-2027).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CALL TO ACTION (EXACT QUOTE FROM JD) */}
                <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-pink-950/60 border border-blue-400/30 text-center space-y-5">
                    <p className="text-base sm:text-lg font-bold text-white leading-relaxed max-w-2xl mx-auto">
                        &quot;Nếu bạn đã đọc đến đây và cảm thấy tim mình &apos;rung rinh&apos;, đừng ngần ngại ứng tuyển để trở thành một phần không thể thiếu của gia đình GDG on Campus: PTIT nhé!&quot;
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <a
                            href="/#apply"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#4285F4] to-[#1a73e8] hover:from-[#3b78e7] hover:to-[#1765cc] shadow-[0_0_24px_rgba(66,133,244,0.5)] transition-all hover:scale-105 active:scale-95"
                        >
                            <span>Đăng ký ứng tuyển ngay</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </a>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-zinc-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
                        >
                            <span>Về Trang chủ</span>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
