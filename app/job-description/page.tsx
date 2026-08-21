import type { Metadata } from "next";
import { settings } from "@/lib/config";
import { JobDescriptionView } from "@/components/job-description/job-description-view";
import { Footer } from "@/components/landing/footer";

const { site } = settings;

export const metadata: Metadata = {
    title: `Mô Tả Công Việc (JD) Tuyển Thành Viên Gen 5 | ${site.name}`,
    description: `Chi tiết mô tả công việc, quyền lợi và yêu cầu tuyển thành viên Gen 5 nhiệm kỳ 2026-2027 của Google Developer Groups on Campus: PTIT (Technical, PR, Design, Nhân sự - Hậu cần).`,
    keywords: [
        ...site.keywords,
        "Job Description GDG on Campus: PTIT",
        "Mô tả công việc Gen 5",
        "Tuyển quân GDG on Campus: PTIT",
        "Tuyển thành viên CLB PTIT",
        "Technical JD",
        "PR JD",
        "Design JD",
        "HR JD",
    ],
    alternates: {
        canonical: "/job-description",
    },
    openGraph: {
        type: "article",
        locale: site.locale,
        url: `${site.url}/job-description`,
        siteName: site.name,
        title: `Mô Tả Công Việc (JD) Tuyển Thành Viên Gen 5 | ${site.name}`,
        description: `Tìm hiểu chi tiết về cơ cấu 4 ban chuyên môn, yêu cầu ứng tuyển và quyền lợi hấp dẫn khi trở thành thành viên Gen 5 của GDG on Campus: PTIT.`,
        images: [
            {
                url: site.ogImage,
                width: 1200,
                height: 630,
                alt: `${site.name} - Job Description Gen 5 (2026 - 2027)`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `Mô Tả Công Việc (JD) Tuyển Thành Viên Gen 5 | ${site.name}`,
        description: `Chi tiết bản mô tả công việc tuyển thành viên Gen 5 GDG on Campus: PTIT nhiệm kỳ 2026-2027.`,
        images: [site.ogImage],
    },
};

export default function JobDescriptionPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#00092B] text-zinc-100 selection:bg-blue-500 selection:text-white">
            <JobDescriptionView />
            <Footer />
        </div>
    );
}
