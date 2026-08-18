import { GdgocLogo, GoogleDots, MapPinIcon, MailIcon, FacebookIcon } from "./google-icons";

export function Footer() {
    return (
        <footer className="bg-zinc-900 text-zinc-400 pt-16 pb-12 border-t border-zinc-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* Column 1: Brand Info */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="bg-white px-3.5 py-2 rounded-xl inline-block shadow-xs">
                            <GdgocLogo />
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed max-w-sm">
                            Google Developer Groups on Campus - Posts and Telecommunications Institute of Technology (GDGoC PTIT) là cộng đồng công nghệ sinh viên trực thuộc mạng lưới Google Developers toàn cầu.
                        </p>
                        <div className="pt-2 flex items-center gap-3">
                            <GoogleDots />
                            <span className="text-xs text-zinc-400 font-medium">Connect • Learn • Grow</span>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="md:col-span-3 space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            Điều hướng
                        </h4>
                        <ul className="space-y-2 text-sm text-zinc-300">
                            <li>
                                <a href="#about" className="hover:text-white transition-colors">
                                    Về GDGoC PTIT
                                </a>
                            </li>
                            <li>
                                <a href="#activities" className="hover:text-white transition-colors">
                                    Hoạt động tiêu biểu
                                </a>
                            </li>
                            <li>
                                <a href="#mission" className="hover:text-white transition-colors">
                                    Sứ mệnh & Mục tiêu
                                </a>
                            </li>
                            <li>
                                <a href="#departments" className="hover:text-white transition-colors">
                                    Ban chuyên môn
                                </a>
                            </li>
                            <li>
                                <a href="#apply" className="hover:text-[#4285F4] transition-colors font-semibold">
                                    Đăng ký tuyển thành viên
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact & Location */}
                    <div className="md:col-span-4 space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            Thông tin liên hệ
                        </h4>
                        <ul className="space-y-3 text-sm text-zinc-300">
                            <li className="flex items-start gap-2.5">
                                <MapPinIcon className="w-4.5 h-4.5 text-[#EA4335] shrink-0 mt-0.5" />
                                <span>Học viện Công nghệ Bưu chính Viễn thông, Km10 Đường Nguyễn Trãi, Hà Đông, Hà Nội</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <MailIcon className="w-4.5 h-4.5 text-[#4285F4] shrink-0" />
                                <a href="mailto:gdgoc.ptit@gmail.com" className="hover:text-white transition-colors">
                                    gdgoc.ptit@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <FacebookIcon className="w-4.5 h-4.5 text-[#1877F2] shrink-0" />
                                <a href="https://facebook.com/gdgoc.ptit" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                    facebook.com/gdgoc.ptit
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Disclaimer */}
                <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-300">
                    <p>
                        © {new Date().getFullYear()} GDGoC PTIT. All rights reserved.
                    </p>
                    <p className="text-center sm:text-right text-[11px] text-zinc-400">
                        GDGoC PTIT is an independent student community backed by Google Developers.
                    </p>
                </div>
            </div>
        </footer>
    );
}

