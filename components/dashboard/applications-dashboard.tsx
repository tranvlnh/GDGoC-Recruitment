"use client";

import { useCallback, useEffect, useState } from "react";
import {
    departmentLabel,
    departments,
    majorLabel,
    majors,
    questions,
} from "@/lib/config";
import { displayAnswer } from "@/lib/export";
import type {
    Application,
    ApplicationStatus,
    PaginatedApplications,
} from "@/types/application";

const statusText: Record<ApplicationStatus, string> = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
};

const statusStyles: Record<ApplicationStatus, string> = {
    pending: "bg-[#f4ead9] text-[#8a5b28]",
    approved: "bg-[#e4eee5] text-[#426747]",
    rejected: "bg-[#f4e4e1] text-[#9b4c42]",
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusText[status]}
        </span>
    );
}

export function ApplicationsDashboard() {
    const [result, setResult] = useState<PaginatedApplications | null>(null);
    const [status, setStatus] = useState("");
    const [major, setMajor] = useState("");
    const [department, setDepartment] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ page: String(page) });
        if (status) params.set("status", status);
        if (major) params.set("major", major);
        if (department) params.set("department", department);
        if (search) params.set("search", search);
        const response = await fetch(`/api/dashboard/applications?${params}`);
        const body = await response.json();
        setLoading(false);
        if (!response.ok) {
            setError(body.error ?? "Không thể tải dữ liệu");
            return;
        }
        setResult(body);
    }, [status, major, department, search, page]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void load();
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, [load]);

    async function setApplicationStatus(
        application: Application,
        nextStatus: "approved" | "rejected",
    ) {
        const response = await fetch(
            `/api/dashboard/applications/${application.id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            },
        );
        if (!response.ok) {
            setError("Không thể cập nhật trạng thái");
            return;
        }
        void load();
    }

    function updateFilters(callback: () => void) {
        setPage(1);
        callback();
    }

    return (
        <main className="min-h-screen bg-[#f7f6f3] px-4 py-8 text-[#292724] sm:px-6 sm:py-12">
            <div className="mx-auto max-w-6xl">
                <header className="mb-10 border-b border-[#d9d5cd] pb-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-3 text-xs font-medium tracking-[0.16em] text-[#a64f37] uppercase">
                                GDGoC PTIT · Gen 5
                            </p>
                            <h1 className="font-serif text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                                Đơn ứng tuyển
                            </h1>
                            <p className="mt-2 text-sm text-[#6c6861]">
                                Xem và phản hồi hồ sơ ứng viên.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <a
                                href="/api/dashboard/export"
                                className="font-medium text-[#a64f37] underline decoration-[#d8b6a9] underline-offset-4 transition hover:text-[#7f3c2b]"
                            >
                                Xuất CSV
                            </a>
                            <button
                                onClick={async () => {
                                    await fetch("/api/dashboard/auth/logout", {
                                        method: "POST",
                                    });
                                    window.location.href = "/dashboard/login";
                                }}
                                className="font-medium text-[#6c6861] underline decoration-[#d9d5cd] underline-offset-4 transition hover:text-[#292724]"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </header>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        setPage(1);
                        void load();
                    }}
                    className="mb-8 border-b border-[#d9d5cd] pb-6"
                >
                    <div className="mb-3 flex items-center justify-between">
                        <p className="font-serif text-lg font-semibold">Tìm hồ sơ</p>
                        {(search || status || major || department) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setStatus("");
                                    setMajor("");
                                    setDepartment("");
                                    setPage(1);
                                }}
                                className="text-xs text-[#6c6861] underline underline-offset-2 transition hover:text-[#292724]"
                            >
                                Xoá bộ lọc
                            </button>
                        )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <label className="sm:col-span-2">
                            <span className="mb-1.5 block text-xs font-medium text-[#6c6861]">Tìm kiếm</span>
                            <input
                                value={search}
                                onChange={(event) => updateFilters(() => setSearch(event.target.value))}
                                placeholder="Tên hoặc email ứng viên..."
                                className="w-full rounded-md border border-[#d9d5cd] bg-[#fffdf9] px-3 py-2.5 text-sm outline-none transition placeholder:text-[#aaa59c] focus:border-[#a64f37] focus:ring-2 focus:ring-[#f0d7cd]"
                            />
                        </label>
                        <label>
                            <span className="mb-1.5 block text-xs font-medium text-[#6c6861]">Trạng thái</span>
                            <select
                                value={status}
                                onChange={(event) => updateFilters(() => setStatus(event.target.value))}
                                className="w-full rounded-md border border-[#d9d5cd] bg-[#fffdf9] px-3 py-2.5 text-sm outline-none transition focus:border-[#a64f37] focus:ring-2 focus:ring-[#f0d7cd]"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="pending">Chờ duyệt</option>
                                <option value="approved">Đã duyệt</option>
                                <option value="rejected">Từ chối</option>
                            </select>
                        </label>
                        <label>
                            <span className="mb-1.5 block text-xs font-medium text-[#6c6861]">Ngành học</span>
                            <select
                                value={major}
                                onChange={(event) => updateFilters(() => setMajor(event.target.value))}
                                className="w-full rounded-md border border-[#d9d5cd] bg-[#fffdf9] px-3 py-2.5 text-sm outline-none transition focus:border-[#a64f37] focus:ring-2 focus:ring-[#f0d7cd]"
                            >
                                <option value="">Tất cả ngành</option>
                                {majors.map((item) => (
                                    <option key={item.id} value={item.id}>{item.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span className="mb-1.5 block text-xs font-medium text-[#6c6861]">Ban chuyên môn</span>
                            <select
                                value={department}
                                onChange={(event) => updateFilters(() => setDepartment(event.target.value))}
                                className="w-full rounded-md border border-[#d9d5cd] bg-[#fffdf9] px-3 py-2.5 text-sm outline-none transition focus:border-[#a64f37] focus:ring-2 focus:ring-[#f0d7cd]"
                            >
                                <option value="">Tất cả ban</option>
                                {departments.map((item) => (
                                    <option key={item.id} value={item.id}>{item.label}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </form>
                {error && (
                    <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>
                )}
                <div className="border-y border-[#d9d5cd]">
                    <div className="flex items-center justify-between px-1 py-4">
                        <div>
                            <h2 className="font-serif text-xl font-semibold">Danh sách ứng viên</h2>
                            <p className="mt-1 text-xs text-[#6c6861]">Chọn tên ứng viên để đọc hồ sơ đầy đủ.</p>
                        </div>
                        {result && <span className="text-xs text-[#6c6861]">{result.total} đơn</span>}
                    </div>
                <div className="overflow-x-auto">
                <table className="min-w-180 w-full text-left text-sm">
                    <thead className="border-y border-[#d9d5cd] text-xs tracking-wide text-[#6c6861] uppercase">
                        <tr>
                            <th className="px-5 py-3.5 font-semibold">Ứng viên</th>
                            <th className="px-5 py-3.5 font-semibold">Ngành</th>
                            <th className="px-5 py-3.5 font-semibold">Ngày nộp</th>
                            <th className="px-5 py-3.5 font-semibold">Trạng thái</th>
                            <th className="px-5 py-3.5 font-semibold">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : result?.data.length ? (
                            result.data.map((application) => (
                                <ApplicationRow
                                    key={application.id}
                                    application={application}
                                    onStatus={setApplicationStatus}
                                    onView={setSelectedApplication}
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="p-6 text-center text-zinc-500"
                                >
                                    Không có đơn phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
                {result && (
                    <div className="flex flex-col gap-3 px-1 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-[#6c6861]">
                            Trang <strong className="font-medium text-[#292724]">{result.page}</strong> trên {result.totalPages || 1}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="rounded-md border border-[#cfc9bf] px-3 py-1.5 font-medium text-[#5d5953] transition hover:bg-[#eeeae2] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ← Trước
                            </button>
                            <button
                                disabled={page >= result.totalPages}
                                onClick={() => setPage(page + 1)}
                                className="rounded-md border border-[#cfc9bf] px-3 py-1.5 font-medium text-[#5d5953] transition hover:bg-[#eeeae2] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                )}
            </div>
                {selectedApplication && (
                <ApplicationModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
                )}
            </div>
        </main>
    );
}

function ApplicationRow({
    application,
    onStatus,
    onView,
}: {
    application: Application;
    onStatus: (
        application: Application,
        status: "approved" | "rejected",
    ) => void;
    onView: (application: Application) => void;
}) {
    const initials = application.full_name
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((name) => name[0])
        .join("")
        .toUpperCase();

    return (
        <tr className="border-b border-[#e4e0d8] transition-colors hover:bg-[#f1eee8]">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ead9d1] text-xs font-medium text-[#8e4633]">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={() => onView(application)}
                            className="block truncate text-left font-medium text-[#292724] underline-offset-4 transition hover:text-[#a64f37] hover:underline"
                        >
                            {application.full_name}
                        </button>
                        <div className="mt-0.5 truncate text-xs text-[#6c6861]">{application.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-5 py-4 text-[#5d5953]">{majorLabel(application.major)}</td>
            <td className="px-5 py-4 whitespace-nowrap text-[#5d5953]">
                {new Date(application.submitted_at).toLocaleDateString("vi-VN")}
            </td>
            <td className="px-5 py-4"><StatusBadge status={application.status} /></td>
            <td className="px-5 py-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => onStatus(application, "approved")}
                        disabled={application.status === "approved"}
                        className="rounded-md bg-[#a64f37] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#873f2c] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Duyệt
                    </button>
                    <button
                        onClick={() => onStatus(application, "rejected")}
                        disabled={application.status === "rejected"}
                        className="rounded-md border border-[#cfc9bf] px-2.5 py-1.5 text-xs font-medium text-[#5d5953] transition hover:border-[#a64f37] hover:text-[#a64f37] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Từ chối
                    </button>
                </div>
            </td>
        </tr>
    );
}

function ApplicationModal({
    application,
    onClose,
}: {
    application: Application;
    onClose: () => void;
}) {
    const answers = new Map(
        application.answers.map((answer) => [answer.question_id, answer]),
    );
    const gender = {
        male: "Nam",
        female: "Nữ",
        other: "Khác",
        prefer_not_to_say: "Không muốn trả lời",
    }[application.gender];
    const details = [
        ["Email", application.email],
        ["Số điện thoại", application.phone],
        ["Facebook", application.facebook_url],
        ["Mã sinh viên", application.student_id],
        ["Năm học", `Năm ${application.student_year}`],
        [
            "Ngày sinh",
            new Date(
                `${application.date_of_birth}T00:00:00`,
            ).toLocaleDateString("vi-VN"),
        ],
        ["Trường học", application.university],
        ["Ngành", majorLabel(application.major)],
        ["Ban chuyên môn", departmentLabel(application.department)],
        ["Giới tính", gender],
        [
            "Ngày nộp",
            new Date(application.submitted_at).toLocaleString("vi-VN"),
        ],
        ["Trạng thái", statusText[application.status]],
    ];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-modal-title"
            onMouseDown={onClose}
            className="fixed inset-0 z-50 flex items-end bg-zinc-950/50 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
        >
            <div
                onMouseDown={(event) => event.stopPropagation()}
                className="max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-[#fffdf9] p-5 shadow-2xl sm:max-w-3xl sm:rounded-xl sm:p-7"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-medium tracking-[0.14em] text-[#a64f37] uppercase">
                            Hồ sơ ứng viên
                        </p>
                        <h2
                            id="application-modal-title"
                            className="font-serif text-2xl font-semibold tracking-tight text-[#292724]"
                        >
                            {application.full_name}
                        </h2>
                        <div className="mt-2"><StatusBadge status={application.status} /></div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-[#cfc9bf] px-3 py-1.5 text-sm font-medium text-[#5d5953] transition hover:bg-[#eeeae2]"
                    >
                        Đóng
                    </button>
                </div>
                <dl className="mt-6 grid gap-x-8 gap-y-4 border-y border-[#ded9d0] py-5 text-sm sm:grid-cols-2">
                    {details.map(([label, value]) => (
                        <div key={label}>
                            <dt className="text-xs font-medium text-zinc-500">{label}</dt>
                            <dd className="mt-1 wrap-break-word font-medium text-zinc-800">
                                {label === "Facebook" ? (
                                    <a
                                        href={value}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#a64f37] underline decoration-[#d8b6a9] underline-offset-4 transition hover:text-[#7f3c2b]"
                                    >
                                        {value}
                                    </a>
                                ) : (
                                    value
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
                <section className="mt-6 border-t border-zinc-100 pt-5">
                    <h3 className="text-sm font-semibold text-zinc-900">Câu trả lời</h3>
                    <div className="mt-4 space-y-3">
                        {questions.map((question, index) => (
                            <div key={question.id} className="rounded-xl border border-zinc-100 p-4">
                                <h4 className="text-sm font-semibold text-zinc-800">
                                    <span className="mr-2 text-emerald-600">{String(index + 1).padStart(2, "0")}</span>
                                    {question.label}
                                </h4>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                                    {displayAnswer(question.id, answers.get(question.id))}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
