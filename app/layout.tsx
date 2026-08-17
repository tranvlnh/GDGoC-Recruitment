import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "GDGoC PTIT Gen 5 Recruitment",
    description: "Hệ thống tuyển thành viên GDGoC PTIT Gen 5",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="vi">
            <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
                {children}
            </body>
        </html>
    );
}
