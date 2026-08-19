import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Tuyển Thành Viên Gen 5 | GDGoC PTIT - Google Developer Groups on Campus",
    description: "Trở thành thành viên của GDGoC PTIT ngay! Khám phá công nghệ Google, mở rộng mạng lưới quan hệ và bứt phá kỹ năng lập trình.",
    keywords: ["GDGoC", "GDGoC PTIT", "Google Developer Groups on Campus", "PTIT", "Tuyển thành viên Gen 5", "Google Developers"],
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="vi">
            <body className="min-h-screen bg-[#f8f9fa] text-zinc-900 antialiased">
                {children}
            </body>
        </html>
    );
}
