"use client";

import { useCallback, useEffect, useState } from "react";
import { departmentLabel, majorLabel, majors, questions } from "@/lib/config";
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

export function ApplicationsDashboard() {
    const [result, setResult] = useState<PaginatedApplications | null>(null);
    const [status, setStatus] = useState("");
    const [major, setMajor] = useState("");
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
        if (search) params.set("search", search);
        const response = await fetch(`/api/dashboard/applications?${params}`);
        const body = await response.json();
        setLoading(false);
        if (!response.ok) {
            setError(body.error ?? "Không thể tải dữ liệu");
            return;
        }
        setResult(body);
    }, [status, major, search, page]);

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
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Đơn ứng tuyển</h1>
                    <p className="text-sm text-zinc-600">
                        Quản lý đơn GDGoC PTIT Gen 5
                    </p>
                </div>
                <div className="flex gap-2">
                    <a
                        href="/api/dashboard/export"
                        className="rounded border px-3 py-2 text-sm"
                    >
                        Tải CSV
                    </a>
                    <button
                        onClick={async () => {
                            await fetch("/api/dashboard/auth/logout", {
                                method: "POST",
                            });
                            window.location.href = "/dashboard/login";
                        }}
                        className="rounded border px-3 py-2 text-sm"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    setPage(1);
                    void load();
                }}
                className="mb-4 grid gap-2 sm:grid-cols-4"
            >
                <input
                    value={search}
                    onChange={(event) =>
                        updateFilters(() => setSearch(event.target.value))
                    }
                    placeholder="Tìm tên hoặc email"
                    className="rounded border px-3 py-2 sm:col-span-2"
                />
                <select
                    value={status}
                    onChange={(event) =>
                        updateFilters(() => setStatus(event.target.value))
                    }
                    className="rounded border px-3 py-2"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Từ chối</option>
                </select>
                <select
                    value={major}
                    onChange={(event) =>
                        updateFilters(() => setMajor(event.target.value))
                    }
                    className="rounded border px-3 py-2"
                >
                    <option value="">Tất cả ngành</option>
                    {majors.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </form>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <div className="overflow-x-auto rounded border bg-white">
                <table className="min-w-180 w-full text-left text-sm">
                    <thead className="bg-zinc-50">
                        <tr>
                            <th className="p-3">Họ tên</th>
                            <th className="p-3">Ngành</th>
                            <th className="p-3">Ngày nộp</th>
                            <th className="p-3">Trạng thái</th>
                            <th className="p-3">Thao tác</th>
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
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span>{result.total} đơn</span>
                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="rounded border px-3 py-1 disabled:opacity-40"
                        >
                            Trước
                        </button>
                        <span className="px-2 py-1">
                            Trang {result.page}/{result.totalPages}
                        </span>
                        <button
                            disabled={page >= result.totalPages}
                            onClick={() => setPage(page + 1)}
                            className="rounded border px-3 py-1 disabled:opacity-40"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
            {selectedApplication && (
                <ApplicationModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}
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
    return (
        <tr className="border-t">
            <td className="p-3">
                <button
                    type="button"
                    onClick={() => onView(application)}
                    className="font-medium underline"
                >
                    {application.full_name}
                </button>
                <div className="text-zinc-500">{application.email}</div>
            </td>
            <td className="p-3">{majorLabel(application.major)}</td>
            <td className="p-3">
                {new Date(application.submitted_at).toLocaleDateString("vi-VN")}
            </td>
            <td className="p-3">{statusText[application.status]}</td>
            <td className="p-3">
                <div className="flex gap-2">
                    <button
                        onClick={() => onStatus(application, "approved")}
                        disabled={application.status === "approved"}
                        className="rounded bg-green-700 px-2 py-1 text-white disabled:opacity-40"
                    >
                        Duyệt
                    </button>
                    <button
                        onClick={() => onStatus(application, "rejected")}
                        disabled={application.status === "rejected"}
                        className="rounded bg-red-700 px-2 py-1 text-white disabled:opacity-40"
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
            className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center sm:justify-center sm:p-6"
        >
            <div
                onMouseDown={(event) => event.stopPropagation()}
                className="max-h-[90vh] w-full overflow-y-auto rounded-t-lg bg-white p-5 shadow-xl sm:max-w-3xl sm:rounded-lg"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="application-modal-title"
                            className="text-xl font-bold"
                        >
                            {application.full_name}
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Chi tiết đơn ứng tuyển
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border px-3 py-1.5 text-sm"
                    >
                        Đóng
                    </button>
                </div>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    {details.map(([label, value]) => (
                        <div key={label}>
                            <dt className="text-zinc-500">{label}</dt>
                            <dd className="wrap-break-word">{value}</dd>
                        </div>
                    ))}
                </dl>
                <section className="mt-6 border-t pt-5">
                    <h3 className="font-semibold">Câu trả lời</h3>
                    <div className="mt-4 space-y-5">
                        {questions.map((question) => (
                            <div key={question.id}>
                                <h4 className="font-medium">
                                    {question.label}
                                </h4>
                                <p className="mt-1 whitespace-pre-wrap text-zinc-700">
                                    {displayAnswer(
                                        question.id,
                                        answers.get(question.id),
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
