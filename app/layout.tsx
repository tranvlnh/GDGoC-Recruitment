import type { Metadata, Viewport } from "next";
import { Google_Sans } from "next/font/google";
import { settings } from "@/lib/config";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";

const googleSans = Google_Sans({
    subsets: ["vietnamese"],
    weight: "variable",
    adjustFontFallback: false,
});

const { site } = settings;

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: site.themeColor,
};

export const metadata: Metadata = {
    metadataBase: new URL(site.url),

    // ── Core ──
    title: {
        default: `Tuyển Thành Viên Gen 5 | ${site.name}`,
        template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,

    // ── Canonical & Alternate ──
    alternates: {
        canonical: "/",
    },

    // ── Open Graph (Facebook, Zalo, LinkedIn …) ──
    openGraph: {
        type: "website",
        locale: site.locale,
        url: site.url,
        siteName: site.name,
        title: `Tuyển Thành Viên Gen 5 | ${site.name}`,
        description: site.ogDescription,
        images: [
            {
                url: site.ogImage,
                width: 1200,
                height: 630,
                alt: `${site.name} - Tuyển Thành Viên Gen 5`,
            },
        ],
    },

    // ── Twitter / X Card ──
    twitter: {
        card: "summary_large_image",
        title: `Tuyển Thành Viên Gen 5 | ${site.name}`,
        description: site.ogDescription,
        images: [site.ogImage],
    },

    // ── Robots ──
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // ── Icons ──
    icons: {
        icon: "/favicon.ico",
        apple: "/favicon.ico",
    },

    // ── Verification (thêm ID khi có) ──
    // verification: {
    //     google: "YOUR_GOOGLE_SITE_VERIFICATION",
    // },

    // ── Category ──
    category: "technology",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="vi">
            <body className={`${googleSans.className} min-h-screen bg-[#f8f9fa] text-zinc-900 antialiased`}>
                {children}
                <GoogleAnalytics />
            </body>
        </html>
    );
}
