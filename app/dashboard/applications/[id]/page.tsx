import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { displayAnswer } from "@/lib/export";
import { departmentBadgeStyle, departmentLabel, majorLabel, questions } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { GoogleDots } from "@/components/landing/google-icons";
import type { Application, ApplicationStatus } from "@/types/application";

const genderLabels = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
    prefer_not_to_say: "Không muốn trả lời",
} as const;

const statusText: Record<ApplicationStatus, string> = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
};

const statusStyles: Record<ApplicationStatus, { badge: string; dot: string }> = {
    pending: {
        badge: "bg-amber-50 text-amber-700 border-amber-200/80",
        dot: "bg-amber-500",
    },
    approved: {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dot: "bg-emerald-500",
    },
    rejected: {
        badge: "bg-rose-50 text-rose-700 border-rose-200/80",
        dot: "bg-rose-500",
    },
};

export default async function ApplicationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (error) throw new Error("Không thể tải đơn ứng tuyển");
    if (!data) notFound();

    const application = data as Application;
    const answers = new Map(
        application.answers.map((answer) => [answer.question_id, answer]),
    );

    const initials = application.full_name
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((name) => name[0])
        .join("")
        .toUpperCase();

    const statusBadgeConfig = statusStyles[application.status] || statusStyles.pending;
    const deptStyle = departmentBadgeStyle(application.department);

    const isSubTechLead =
        application.department === "tech" &&
        application.answers?.some(
            (a) => a.question_id === "tech_sublead_web_interest" && a.value === "yes",
        );

    const commonQuestions = questions.filter(
        (q) => !q.departments || q.departments.length === 0,
    );

    const deptQuestions = questions.filter(
        (q) =>
            q.departments &&
            q.departments.length > 0 &&
            q.departments.includes(application.department) &&
            q.category !== "sub_tech_lead_web",
    );

    const subTechLeadQuestions = questions.filter(
        (q) => q.category === "sub_tech_lead_web",
    );

    const hasSubTechLeadAnswers = subTechLeadQuestions.some((q) => {
        const a = answers.get(q.id);
        return Boolean(
            a &&
            ((typeof a.value === "string" && a.value.trim().length > 0) ||
                (Array.isArray(a.value) && a.value.length > 0)),
        );
    });

    const knownQuestionIds = new Set([
        ...commonQuestions.map((q) => q.id),
        ...deptQuestions.map((q) => q.id),
        ...subTechLeadQuestions.map((q) => q.id),
    ]);

    const otherAnsweredQuestions = application.answers.filter(
        (ans) => !knownQuestionIds.has(ans.question_id),
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-900 pb-16">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="GDGoC PTIT"
                                width={200}
                                height={28}
                                priority
                                className="h-6 w-auto object-contain"
                            />
                        </Link>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Quay lại Dashboard</span>
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                {/* Candidate Summary Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-[#4285F4] shadow-xs">
                                {initials}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                        {application.full_name}
                                    </h1>
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeConfig.badge}`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${statusBadgeConfig.dot} animate-pulse`} />
                                        {statusText[application.status]}
                                    </span>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span>MSSV: {application.student_id}</span>
                                    <span>•</span>
                                    <span>Nộp ngày {new Date(application.submitted_at).toLocaleString("vi-VN")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                            <span
                                className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-semibold ${deptStyle}`}
                            >
                                {departmentLabel(application.department)}
                            </span>
                            {isSubTechLead && (
                                <span className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
                                    ⚡ Sub-Tech Lead (Web)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Contact & Academic Grid */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                            <span className="text-[11px] font-medium text-slate-500">Email</span>
                            <div className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                                {application.email}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                            <span className="text-[11px] font-medium text-slate-500">Số điện thoại</span>
                            <div className="mt-0.5 text-sm font-semibold text-[#4285F4]">
                                <a href={`tel:${application.phone}`}>{application.phone}</a>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                            <span className="text-[11px] font-medium text-slate-500">Facebook</span>
                            <div className="mt-0.5 truncate text-sm font-semibold text-[#4285F4]">
                                <a href={application.facebook_url} target="_blank" rel="noreferrer" className="hover:underline">
                                    Xem trang cá nhân ↗
                                </a>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                            <span className="text-[11px] font-medium text-slate-500">Ngành học</span>
                            <div className="mt-0.5 text-sm font-semibold text-slate-900">
                                {majorLabel(application.major)}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                            <span className="text-[11px] font-medium text-slate-500">Năm học & Trường</span>
                            <div className="mt-0.5 text-sm font-semibold text-slate-900">
                                Năm {application.student_year} • {application.university}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                            <span className="text-[11px] font-medium text-slate-500">Ngày sinh & Giới tính</span>
                            <div className="mt-0.5 text-sm font-semibold text-slate-900">
                                {new Date(`${application.date_of_birth}T00:00:00`).toLocaleDateString("vi-VN")} • {genderLabels[application.gender]}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="mt-6 space-y-6">
                    {/* Section 1: Common Questions */}
                    {commonQuestions.length > 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-[#4285F4] text-xs font-bold">
                                    1
                                </span>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                                    Câu hỏi chung
                                </h2>
                                <span className="text-xs text-slate-400 font-normal">
                                    ({commonQuestions.length} câu)
                                </span>
                            </div>
                            <div className="space-y-4">
                                {commonQuestions.map((q) => (
                                    <div key={q.id} className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                                        <h3 className="text-xs font-semibold text-slate-700">{q.label}</h3>
                                        <div className="mt-2 rounded-lg bg-white p-3.5 text-sm text-slate-800 leading-relaxed shadow-2xs whitespace-pre-wrap">
                                            {displayAnswer(q.id, answers.get(q.id))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Section 2: Department Specific Questions */}
                    {deptQuestions.length > 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">
                                    2
                                </span>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                                    Câu hỏi chuyên môn — {departmentLabel(application.department)}
                                </h2>
                                <span className="text-xs text-slate-400 font-normal">
                                    ({deptQuestions.length} câu)
                                </span>
                            </div>
                            <div className="space-y-4">
                                {deptQuestions.map((q) => (
                                    <div key={q.id} className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                                        <h3 className="text-xs font-semibold text-slate-700">{q.label}</h3>
                                        <div className="mt-2 rounded-lg bg-white p-3.5 text-sm text-slate-800 leading-relaxed shadow-2xs whitespace-pre-wrap">
                                            {displayAnswer(q.id, answers.get(q.id))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sub-Tech Lead (Web) Special Section */}
                    {hasSubTechLeadAnswers && (
                        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/40 p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-blue-100">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4285F4] text-white text-xs font-bold shadow-2xs">
                                        ⚡
                                    </span>
                                    <h2 className="text-base font-bold text-blue-950">
                                        Ứng tuyển Sub-Tech Lead (Web)
                                    </h2>
                                </div>
                                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                                    Vị trí đặc biệt
                                </span>
                            </div>
                            <div className="space-y-4">
                                {subTechLeadQuestions.map((q) => (
                                    <div key={q.id} className="rounded-xl border border-blue-100 bg-white/90 p-4 shadow-2xs">
                                        <h3 className="text-xs font-bold text-slate-800">{q.label}</h3>
                                        <div className="mt-2 rounded-lg bg-slate-50/80 p-3.5 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                                            {displayAnswer(q.id, answers.get(q.id))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Answered Questions */}
                    {otherAnsweredQuestions.length > 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                Các câu trả lời khác
                            </h2>
                            <div className="space-y-3">
                                {otherAnsweredQuestions.map((ans) => {
                                    const matchingQ = questions.find((q) => q.id === ans.question_id);
                                    const qLabel = matchingQ?.label || ans.question_id;
                                    return (
                                        <div key={ans.question_id} className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                                            <h3 className="text-xs font-semibold text-slate-700">{qLabel}</h3>
                                            <div className="mt-2 rounded-lg bg-white p-3 text-sm text-slate-800 shadow-2xs whitespace-pre-wrap">
                                                {displayAnswer(ans.question_id, ans)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
