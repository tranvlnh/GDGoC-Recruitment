"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
    departmentLabel,
    departments,
    majorLabel,
    majors,
    questions,
} from "@/lib/config";
import { displayAnswer } from "@/lib/export";
import { GoogleDots } from "@/components/landing/google-icons";
import type {
    Application,
    ApplicationStatus,
    DashboardStats,
    PaginatedApplications,
} from "@/types/application";

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

const departmentStyles: Record<string, string> = {
    tech: "bg-blue-50 text-blue-700 border-blue-200/80",
    design: "bg-amber-50 text-amber-700 border-amber-200/80",
    pr: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    "hr-lg": "bg-purple-50 text-purple-700 border-purple-200/80",
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
    const config = statusStyles[status] || statusStyles.pending;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.badge}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />
            {statusText[status]}
        </span>
    );
}

function DepartmentBadge({ department }: { department: string }) {
    const style = departmentStyles[department] || "bg-slate-100 text-slate-700 border-slate-200";
    return (
        <span
            className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${style}`}
        >
            {departmentLabel(department)}
        </span>
    );
}

type ToastMessage = {
    id: string;
    type: "success" | "error" | "info";
    text: string;
};

export function ApplicationsDashboard() {
    const [result, setResult] = useState<PaginatedApplications | null>(null);
    const [status, setStatus] = useState("");
    const [major, setMajor] = useState("");
    const [department, setDepartment] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, text, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const load = useCallback(async (targetPage = page) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({ page: String(targetPage) });
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
        } catch {
            setLoading(false);
            setError("Lỗi kết nối mạng, không thể tải danh sách");
        }
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
        setActionLoadingId(application.id);
        try {
            const response = await fetch(
                `/api/dashboard/applications/${application.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: nextStatus }),
                },
            );
            const body = await response.json();
            setActionLoadingId(null);
            if (!response.ok) {
                addToast(body.error ?? "Không thể cập nhật trạng thái", "error");
                return;
            }
            setSelectedApplication((current) =>
                current?.id === application.id ? body.data : current,
            );
            addToast(
                nextStatus === "approved"
                    ? `Đã duyệt đơn của ${application.full_name}`
                    : `Đã từ chối đơn của ${application.full_name}`,
                "success",
            );
            void load();
        } catch {
            setActionLoadingId(null);
            addToast("Lỗi kết nối, không thể cập nhật", "error");
        }
    }

    function handleFilterChange(callback: () => void) {
        setPage(1);
        callback();
    }

    function handleResetFilters() {
        setSearch("");
        setStatus("");
        setMajor("");
        setDepartment("");
        setPage(1);
    }

    async function handleExportCsv() {
        setExporting(true);
        try {
            const response = await fetch("/api/dashboard/export");
            if (!response.ok) {
                throw new Error("Xuất CSV thất bại");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `gdgoc-ptit-gen5-applications-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            addToast("Xuất tệp CSV thành công!", "success");
        } catch {
            addToast("Không thể xuất tệp CSV", "error");
        } finally {
            setExporting(false);
        }
    }

    // Next / Previous application switcher for Modal
    const currentIndex = result?.data.findIndex(
        (item) => item.id === selectedApplication?.id,
    ) ?? -1;

    const handlePrevCandidate = () => {
        if (!result || currentIndex <= 0) return;
        setSelectedApplication(result.data[currentIndex - 1]);
    };

    const handleNextCandidate = () => {
        if (!result || currentIndex < 0 || currentIndex >= result.data.length - 1) return;
        setSelectedApplication(result.data[currentIndex + 1]);
    };

    const stats: DashboardStats = result?.stats || {
        total: result?.total ?? 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    };

    const approvalRate = stats.total > 0
        ? Math.round((stats.approved / stats.total) * 100)
        : 0;

    const hasActiveFilters = Boolean(search || status || major || department);

    return (
        <main className="min-h-screen bg-[#f8f9fa] text-slate-900">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3.5">
                        <Image
                            src="/logo.png"
                            alt="GDGoC PTIT"
                            width={220}
                            height={32}
                            priority
                            className="h-7 w-auto object-contain"
                        />
                        <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3.5">
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#4285F4]">
                                Recruitment Hub
                            </span>
                            <span className="text-xs font-medium text-slate-500">Gen 5</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <button
                            onClick={handleExportCsv}
                            disabled={exporting}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-50"
                        >
                            {exporting ? (
                                <svg className="h-4 w-4 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            )}
                            <span className="hidden sm:inline">Xuất CSV</span>
                        </button>

                        <button
                            onClick={() => void load()}
                            title="Làm mới dữ liệu"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                        >
                            <svg className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        <button
                            onClick={async () => {
                                await fetch("/api/dashboard/auth/logout", { method: "POST" });
                                window.location.href = "/dashboard/login";
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 shadow-sm transition-all hover:bg-rose-50 hover:border-rose-200 active:scale-95"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* 1. Page Title & Intro */}
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <GoogleDots className="scale-75 origin-left" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                GDGoC PTIT · Tuyển quân Gen 5
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Quản lý Đơn Ứng Tuyển
                        </h1>
                    </div>
                </div>

                {/* 2. KPI Metric Cards */}
                <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {/* Card 1: Total */}
                    <div
                        onClick={() => handleFilterChange(() => setStatus(""))}
                        className={`cursor-pointer rounded-2xl border p-4.5 transition-all hover:shadow-md ${status === ""
                            ? "border-[#4285F4] bg-blue-50/40 shadow-sm ring-2 ring-blue-500/20"
                            : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Tổng số đơn
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-[#4285F4]">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                {stats.total}
                            </span>
                            <span className="text-xs font-medium text-slate-500">hồ sơ</span>
                        </div>
                    </div>

                    {/* Card 2: Pending */}
                    <div
                        onClick={() => handleFilterChange(() => setStatus("pending"))}
                        className={`cursor-pointer rounded-2xl border p-4.5 transition-all hover:shadow-md ${status === "pending"
                            ? "border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-500/20"
                            : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                                Chờ duyệt
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-amber-800 sm:text-3xl">
                                {stats.pending}
                            </span>
                            <span className="text-xs font-medium text-amber-600">cần xem</span>
                        </div>
                    </div>

                    {/* Card 3: Approved */}
                    <div
                        onClick={() => handleFilterChange(() => setStatus("approved"))}
                        className={`cursor-pointer rounded-2xl border p-4.5 transition-all hover:shadow-md ${status === "approved"
                            ? "border-emerald-500 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20"
                            : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                Đã duyệt
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-emerald-800 sm:text-3xl">
                                {stats.approved}
                            </span>
                            <span className="text-xs font-medium text-emerald-600">đạt yêu cầu</span>
                        </div>
                    </div>

                    {/* Card 4: Rejected / Rate */}
                    <div
                        onClick={() => handleFilterChange(() => setStatus("rejected"))}
                        className={`cursor-pointer rounded-2xl border p-4.5 transition-all hover:shadow-md ${status === "rejected"
                            ? "border-rose-500 bg-rose-50/40 shadow-sm ring-2 ring-rose-500/20"
                            : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                                Từ chối / Tỉ lệ
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-rose-800 sm:text-3xl">
                                {stats.rejected}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                                (Duyệt: <strong className="text-slate-800">{approvalRate}%</strong>)
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Main Data Card with Tabs & Filters */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                    {/* 3a. Quick Status Filter Tabs */}
                    <div className="border-b border-slate-200 bg-slate-50/60 px-4 pt-3 sm:px-6">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <button
                                onClick={() => handleFilterChange(() => setStatus(""))}
                                className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-all ${status === ""
                                    ? "border-[#4285F4] text-[#4285F4]"
                                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                    }`}
                            >
                                <span>Tất cả hồ sơ</span>
                                <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                                    {stats.total}
                                </span>
                            </button>

                            <button
                                onClick={() => handleFilterChange(() => setStatus("pending"))}
                                className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-all ${status === "pending"
                                    ? "border-amber-500 text-amber-700"
                                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                    }`}
                            >
                                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                <span>Chờ duyệt</span>
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                                    {stats.pending}
                                </span>
                            </button>

                            <button
                                onClick={() => handleFilterChange(() => setStatus("approved"))}
                                className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-all ${status === "approved"
                                    ? "border-emerald-500 text-emerald-700"
                                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                    }`}
                            >
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span>Đã duyệt</span>
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                    {stats.approved}
                                </span>
                            </button>

                            <button
                                onClick={() => handleFilterChange(() => setStatus("rejected"))}
                                className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-all ${status === "rejected"
                                    ? "border-rose-500 text-rose-700"
                                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                    }`}
                            >
                                <span className="h-2 w-2 rounded-full bg-rose-500" />
                                <span>Từ chối</span>
                                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800">
                                    {stats.rejected}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* 3b. Search & Dropdown Filter Bar */}
                    <div className="border-b border-slate-200 p-4 sm:p-5">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
                            {/* Search */}
                            <div className="lg:col-span-5 relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
                                    placeholder="Tìm theo tên, email, MSSV..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-9 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#4285F4] focus:bg-white focus:ring-3 focus:ring-blue-100"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => handleFilterChange(() => setSearch(""))}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                        title="Xóa tìm kiếm"
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Department Filter */}
                            <div className="lg:col-span-3">
                                <select
                                    value={department}
                                    onChange={(e) => handleFilterChange(() => setDepartment(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#4285F4] focus:bg-white focus:ring-3 focus:ring-blue-100"
                                >
                                    <option value="">Tất cả ban chuyên môn</option>
                                    {departments.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Major Filter */}
                            <div className="lg:col-span-3">
                                <select
                                    value={major}
                                    onChange={(e) => handleFilterChange(() => setMajor(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#4285F4] focus:bg-white focus:ring-3 focus:ring-blue-100 truncate"
                                >
                                    <option value="">Tất cả ngành học</option>
                                    {majors.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset button */}
                            <div className="lg:col-span-1 flex items-center justify-end">
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="w-full inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900"
                                        title="Đặt lại toàn bộ bộ lọc"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="sm:hidden lg:inline">Xoá</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Status summary */}
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                            <div>
                                {hasActiveFilters ? (
                                    <span>
                                        Tìm thấy <strong className="font-semibold text-slate-800">{result?.total ?? 0}</strong> đơn phù hợp với tiêu chí lọc.
                                    </span>
                                ) : (
                                    <span>Hiển thị danh sách ứng viên mới nhất</span>
                                )}
                            </div>
                            {result && (
                                <span>
                                    Trang <strong className="font-semibold text-slate-800">{result.page}</strong> / {result.totalPages || 1}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Error Banner if any */}
                    {error && (
                        <div className="m-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
                            <svg className="h-5 w-5 shrink-0 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* 3c. Desktop Data Table View (Hidden on mobile < md) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[760px]">
                            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="w-[28%] min-w-[220px] px-6 py-3.5">Ứng viên</th>
                                    <th className="w-[17%] min-w-[140px] px-5 py-3.5 whitespace-nowrap">Ban chuyên môn</th>
                                    <th className="w-[24%] min-w-[180px] max-w-[240px] px-5 py-3.5">Ngành & Năm</th>
                                    <th className="w-[11%] min-w-[95px] px-5 py-3.5 whitespace-nowrap">Ngày nộp</th>
                                    <th className="w-[10%] min-w-[105px] px-5 py-3.5 whitespace-nowrap">Trạng thái</th>
                                    <th className="w-[10%] min-w-[155px] px-6 py-3.5 text-right whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <SkeletonTableRows rows={6} />
                                ) : result?.data.length ? (
                                    result.data.map((application) => (
                                        <ApplicationRow
                                            key={application.id}
                                            application={application}
                                            actionLoading={actionLoadingId === application.id}
                                            onStatus={setApplicationStatus}
                                            onView={setSelectedApplication}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <EmptyStateContent onReset={handleResetFilters} hasFilters={hasActiveFilters} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 3d. Mobile Cards List View (Visible on < md) */}
                    <div className="block md:hidden divide-y divide-slate-100">
                        {loading ? (
                            <SkeletonCardList count={4} />
                        ) : result?.data.length ? (
                            result.data.map((application) => (
                                <ApplicationMobileCard
                                    key={application.id}
                                    application={application}
                                    actionLoading={actionLoadingId === application.id}
                                    onStatus={setApplicationStatus}
                                    onView={setSelectedApplication}
                                />
                            ))
                        ) : (
                            <div className="p-4">
                                <EmptyStateContent onReset={handleResetFilters} hasFilters={hasActiveFilters} />
                            </div>
                        )}
                    </div>

                    {/* 3e. Pagination Footer */}
                    {result && result.totalPages > 1 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div className="text-xs text-slate-500">
                                Hiển thị từ <strong className="font-semibold text-slate-800">{(result.page - 1) * result.pageSize + 1}</strong> đến{" "}
                                <strong className="font-semibold text-slate-800">
                                    {Math.min(result.page * result.pageSize, result.total)}
                                </strong>{" "}
                                trong tổng số <strong className="font-semibold text-slate-800">{result.total}</strong> đơn
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page <= 1 || loading}
                                    onClick={() => setPage(page - 1)}
                                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>Trước</span>
                                </button>

                                <span className="px-2 text-xs font-bold text-slate-700">
                                    {page} / {result.totalPages}
                                </span>

                                <button
                                    disabled={page >= result.totalPages || loading}
                                    onClick={() => setPage(page + 1)}
                                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <span>Sau</span>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Application Details Modal */}
            {selectedApplication && (
                <ApplicationModal
                    application={selectedApplication}
                    hasPrev={currentIndex > 0}
                    hasNext={result ? currentIndex < result.data.length - 1 : false}
                    onPrev={handlePrevCandidate}
                    onNext={handleNextCandidate}
                    onClose={() => setSelectedApplication(null)}
                    onStatus={setApplicationStatus}
                    onToast={addToast}
                />
            )}

            {/* 5. Floating Toast Notifications */}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 ${toast.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : toast.type === "error"
                                ? "border-rose-200 bg-rose-50 text-rose-800"
                                : "border-blue-200 bg-blue-50 text-blue-800"
                            }`}
                    >
                        {toast.type === "success" && (
                            <svg className="h-5 w-5 shrink-0 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        {toast.type === "error" && (
                            <svg className="h-5 w-5 shrink-0 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        <span>{toast.text}</span>
                    </div>
                ))}
            </div>
        </main>
    );
}

/* =========================================================================
   SUB-COMPONENTS: Desktop Table Row, Mobile Card, Skeleton, Empty State
   ========================================================================= */

function ApplicationRow({
    application,
    actionLoading,
    onStatus,
    onView,
}: {
    application: Application;
    actionLoading?: boolean;
    onStatus: (application: Application, status: "approved" | "rejected") => void;
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
        <tr className="group transition-colors hover:bg-slate-50/80">
            {/* Candidate Info */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#4285F4] shadow-xs">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <button
                            type="button"
                            onClick={() => onView(application)}
                            className="block truncate text-left font-semibold text-slate-900 transition-colors hover:text-[#4285F4]"
                            title={application.full_name}
                        >
                            {application.full_name}
                        </button>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="truncate max-w-[160px] sm:max-w-[200px]" title={application.email}>
                                {application.email}
                            </span>
                            {application.student_id && (
                                <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[11px] text-slate-600">
                                    {application.student_id}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* Department */}
            <td className="px-5 py-4 whitespace-nowrap">
                <DepartmentBadge department={application.department} />
            </td>

            {/* Major & Year */}
            <td className="px-5 py-4">
                <div
                    className="font-medium text-slate-800 line-clamp-2 text-xs sm:text-sm leading-snug break-words max-w-[220px] xl:max-w-[260px]"
                    title={majorLabel(application.major)}
                >
                    {majorLabel(application.major)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Năm {application.student_year}</div>
            </td>

            {/* Submitted Date */}
            <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                {new Date(application.submitted_at).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}
            </td>

            {/* Status */}
            <td className="px-5 py-4 whitespace-nowrap">
                <StatusBadge status={application.status} />
            </td>

            {/* Actions */}
            <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => onView(application)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                    >
                        Chi tiết
                    </button>
                    <button
                        type="button"
                        disabled={application.status === "approved" || actionLoading}
                        onClick={() => onStatus(application, "approved")}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Duyệt hồ sơ"
                    >
                        Duyệt
                    </button>
                    <button
                        type="button"
                        disabled={application.status === "rejected" || actionLoading}
                        onClick={() => onStatus(application, "rejected")}
                        className="rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 shadow-xs transition-all hover:bg-rose-50 hover:border-rose-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Từ chối hồ sơ"
                    >
                        Từ chối
                    </button>
                </div>
            </td>
        </tr>
    );
}

function ApplicationMobileCard({
    application,
    actionLoading,
    onStatus,
    onView,
}: {
    application: Application;
    actionLoading?: boolean;
    onStatus: (application: Application, status: "approved" | "rejected") => void;
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
        <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#4285F4]">
                        {initials}
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => onView(application)}
                            className="font-semibold text-slate-900 hover:text-[#4285F4] text-left"
                        >
                            {application.full_name}
                        </button>
                        <div className="text-xs text-slate-500">{application.email}</div>
                    </div>
                </div>
                <StatusBadge status={application.status} />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
                <DepartmentBadge department={application.department} />
                <span
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 break-words max-w-full leading-relaxed"
                    title={majorLabel(application.major)}
                >
                    {majorLabel(application.major)} (Năm {application.student_year})
                </span>
                {application.student_id && (
                    <span className="font-mono text-slate-500">MSSV: {application.student_id}</span>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400">
                    {new Date(application.submitted_at).toLocaleDateString("vi-VN")}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onView(application)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Chi tiết
                    </button>
                    <button
                        type="button"
                        disabled={application.status === "approved" || actionLoading}
                        onClick={() => onStatus(application, "approved")}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-30"
                    >
                        Duyệt
                    </button>
                    <button
                        type="button"
                        disabled={application.status === "rejected" || actionLoading}
                        onClick={() => onStatus(application, "rejected")}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                    >
                        Loại
                    </button>
                </div>
            </div>
        </div>
    );
}

function SkeletonTableRows({ rows = 5 }: { rows?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-200" />
                            <div className="space-y-1.5">
                                <div className="h-4 w-36 rounded bg-slate-200" />
                                <div className="h-3 w-28 rounded bg-slate-100" />
                            </div>
                        </div>
                    </td>
                    <td className="px-5 py-4">
                        <div className="h-6 w-20 rounded-lg bg-slate-200" />
                    </td>
                    <td className="px-5 py-4">
                        <div className="space-y-1.5">
                            <div className="h-4 w-32 rounded bg-slate-200" />
                            <div className="h-3 w-16 rounded bg-slate-100" />
                        </div>
                    </td>
                    <td className="px-5 py-4">
                        <div className="h-3 w-20 rounded bg-slate-100" />
                    </td>
                    <td className="px-5 py-4">
                        <div className="h-6 w-20 rounded-full bg-slate-200" />
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                            <div className="h-7 w-14 rounded-lg bg-slate-200" />
                            <div className="h-7 w-14 rounded-lg bg-slate-200" />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}

function SkeletonCardList({ count = 3 }: { count?: number }) {
    return (
        <div className="divide-y divide-slate-100">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-4 space-y-3 animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-200" />
                            <div className="space-y-1.5">
                                <div className="h-4 w-32 rounded bg-slate-200" />
                                <div className="h-3 w-24 rounded bg-slate-100" />
                            </div>
                        </div>
                        <div className="h-6 w-16 rounded-full bg-slate-200" />
                    </div>
                    <div className="h-5 w-40 rounded bg-slate-100" />
                </div>
            ))}
        </div>
    );
}

function EmptyStateContent({ onReset, hasFilters }: { onReset: () => void; hasFilters: boolean }) {
    return (
        <div className="py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-800">Không tìm thấy hồ sơ nào</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                {hasFilters
                    ? "Không có ứng viên nào khớp với bộ lọc tìm kiếm hiện tại. Hãy thử thay đổi hoặc đặt lại bộ lọc."
                    : "Chưa có ứng viên nào nộp hồ sơ ứng tuyển trong hệ thống."}
            </p>
            {hasFilters && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#4285F4] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#3367D6]"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Đặt lại bộ lọc</span>
                </button>
            )}
        </div>
    );
}

/* =========================================================================
   APPLICATION DETAILS MODAL
   ========================================================================= */

function ApplicationModal({
    application,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
    onClose,
    onStatus,
    onToast,
}: {
    application: Application;
    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
    onStatus: (application: Application, status: "approved" | "rejected") => void;
    onToast: (text: string, type: "success" | "error" | "info") => void;
}) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Keyboard navigation (Esc to close, Left/Right arrow to switch)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && hasPrev) onPrev();
            if (e.key === "ArrowRight" && hasNext) onNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hasPrev, hasNext, onPrev, onNext, onClose]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(label);
        onToast(`Đã sao chép ${label}`, "info");
        setTimeout(() => setCopiedField(null), 2000);
    };

    const answers = new Map(
        application.answers.map((answer) => [answer.question_id, answer]),
    );

    const commonQuestions = questions.filter(
        (q) => !q.departments || q.departments.length === 0,
    );

    const deptQuestions = questions.filter(
        (q) =>
            q.departments &&
            q.departments.length > 0 &&
            q.departments.includes(application.department),
    );

    const knownQuestionIds = new Set([
        ...commonQuestions.map((q) => q.id),
        ...deptQuestions.map((q) => q.id),
    ]);

    const otherAnsweredQuestions = application.answers.filter(
        (ans) => !knownQuestionIds.has(ans.question_id),
    );

    const renderQuestionCard = (q: (typeof questions)[number]) => {
        const answer = answers.get(q.id);
        const answerText = displayAnswer(q.id, answer);
        const hasAnswer = Boolean(
            answer &&
                ((typeof answer.value === "string" &&
                    answer.value.trim().length > 0) ||
                    (Array.isArray(answer.value) && answer.value.length > 0)),
        );

        return (
            <div
                key={q.id}
                className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 transition-colors hover:bg-slate-50/70"
            >
                <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-semibold text-slate-800 leading-snug">
                        {q.label}
                    </h4>
                    <div className="flex items-center gap-1.5 shrink-0">
                        {q.required && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                Bắt buộc
                            </span>
                        )}
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {q.type === "essay" ? "Tự luận" : "Trắc nghiệm"}
                        </span>
                    </div>
                </div>

                <div className="mt-2.5 rounded-lg bg-white p-3.5 text-sm text-slate-800 leading-relaxed shadow-2xs">
                    {hasAnswer ? (
                        q.type === "multiple_choice" &&
                        Array.isArray(answer?.value) &&
                        answer.value.length > 1 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {answer.value.map((valId) => {
                                    const optLabel =
                                        q.options?.find((o) => o.id === valId)
                                            ?.label ?? valId;
                                    return (
                                        <span
                                            key={valId}
                                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-md"
                                        >
                                            <span className="text-blue-500 font-bold">✓</span> {optLabel}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap">{answerText}</div>
                        )
                    ) : (
                        <span className="italic text-slate-400">Chưa trả lời</span>
                    )}
                </div>
            </div>
        );
    };

    const initials = application.full_name
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((name) => name[0])
        .join("")
        .toUpperCase();

    const gender = {
        male: "Nam",
        female: "Nữ",
        other: "Khác",
        prefer_not_to_say: "Không muốn trả lời",
    }[application.gender];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-modal-title"
            onMouseDown={onClose}
            className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in"
        >
            <div
                onMouseDown={(event) => event.stopPropagation()}
                className="max-h-[94vh] w-full overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl sm:max-w-4xl border border-slate-200"
            >
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-md sm:px-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#4285F4]">
                            {initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2
                                    id="application-modal-title"
                                    className="text-lg font-bold text-slate-900 sm:text-xl"
                                >
                                    {application.full_name}
                                </h2>
                                <StatusBadge status={application.status} />
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                <span>{application.email}</span>
                                <span>•</span>
                                <span>{application.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {application.status === "pending" && (
                            <div className="flex items-center gap-1.5 mr-2">
                                <button
                                    type="button"
                                    onClick={() => onStatus(application, "approved")}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                                >
                                    <span>Duyệt</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onStatus(application, "rejected")}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                >
                                    <span>Từ chối</span>
                                </button>
                            </div>
                        )}

                        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                            <button
                                type="button"
                                disabled={!hasPrev}
                                onClick={onPrev}
                                className="rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Hồ sơ trước (Phím ←)"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                disabled={!hasNext}
                                onClick={onNext}
                                className="rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Hồ sơ tiếp theo (Phím →)"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            aria-label="Đóng modal (Esc)"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-5 sm:p-7 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Thông tin cá nhân & Học vấn
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {/* Department */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                                <span className="text-[11px] font-medium text-slate-500">Ban chuyên môn ứng tuyển</span>
                                <div className="mt-1">
                                    <DepartmentBadge department={application.department} />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                                <span className="text-[11px] font-medium text-slate-500">Số điện thoại</span>
                                <div className="mt-1 flex items-center justify-between">
                                    <a
                                        href={`tel:${application.phone}`}
                                        className="truncate text-sm font-semibold text-[#4285F4] hover:underline"
                                    >
                                        {application.phone}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(application.phone, "Số điện thoại")}
                                        className="shrink-0 text-slate-400 hover:text-[#4285F4]"
                                        title="Sao chép SĐT"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Facebook */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                                <span className="text-[11px] font-medium text-slate-500">Facebook cá nhân</span>
                                <div className="mt-1 flex items-center justify-between gap-1">
                                    <a
                                        href={application.facebook_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 truncate text-sm font-semibold text-[#4285F4] hover:underline"
                                    >
                                        <span className="truncate">Trang cá nhân</span>
                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(application.facebook_url, "Link Facebook")}
                                        className="shrink-0 text-slate-400 hover:text-[#4285F4]"
                                        title="Sao chép link FB"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Student ID & Year */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                                <span className="text-[11px] font-medium text-slate-500">Mã sinh viên & Năm học</span>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="font-mono text-sm font-semibold text-slate-900">
                                        {application.student_id || "Chưa cung cấp"}
                                    </span>
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                        Năm {application.student_year}
                                    </span>
                                </div>
                            </div>

                            {/* Major & University */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                                <span className="text-[11px] font-medium text-slate-500">Ngành học & Trường</span>
                                <div className="mt-1">
                                    <div
                                        className="text-sm font-semibold text-slate-900 break-words"
                                        title={majorLabel(application.major)}
                                    >
                                        {majorLabel(application.major)}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">{application.university}</div>
                                </div>
                            </div>

                            {/* Date of Birth & Gender */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                                <span className="text-[11px] font-medium text-slate-500">Ngày sinh & Giới tính</span>
                                <div className="mt-1 flex items-center justify-between text-sm font-semibold text-slate-900">
                                    <span>
                                        {new Date(`${application.date_of_birth}T00:00:00`).toLocaleDateString("vi-VN")}
                                    </span>
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                        {gender}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Common Questions */}
                    {commonQuestions.length > 0 && (
                        <div className="border-t border-slate-100 pt-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-[#4285F4] text-xs font-bold">
                                    1
                                </span>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                                    Câu hỏi chung
                                </h3>
                                <span className="text-xs text-slate-400 font-normal">
                                    ({commonQuestions.length} câu)
                                </span>
                            </div>
                            <div className="space-y-3.5">
                                {commonQuestions.map((q) => renderQuestionCard(q))}
                            </div>
                        </div>
                    )}

                    {/* Section 3: Department Specific Questions */}
                    {deptQuestions.length > 0 && (
                        <div className="border-t border-slate-100 pt-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">
                                    2
                                </span>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                                    Câu hỏi chuyên môn — {departmentLabel(application.department)}
                                </h3>
                                <span className="text-xs text-slate-400 font-normal">
                                    ({deptQuestions.length} câu)
                                </span>
                            </div>
                            <div className="space-y-3.5">
                                {deptQuestions.map((q) => renderQuestionCard(q))}
                            </div>
                        </div>
                    )}

                    {/* Section 4: Other Answered Questions */}
                    {otherAnsweredQuestions.length > 0 && (
                        <div className="border-t border-slate-100 pt-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 text-purple-700 text-xs font-bold">
                                    3
                                </span>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Các câu trả lời khác
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {otherAnsweredQuestions.map((ans) => {
                                    const matchingQ = questions.find((q) => q.id === ans.question_id);
                                    const qLabel = matchingQ?.label || ans.question_id;
                                    const formattedVal = displayAnswer(ans.question_id, ans);
                                    return (
                                        <div key={ans.question_id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                                            <h4 className="text-xs font-semibold text-slate-700">
                                                {qLabel}
                                            </h4>
                                            <div className="mt-2 rounded-lg bg-white p-3 text-sm text-slate-800 shadow-2xs whitespace-pre-wrap">
                                                {formattedVal}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Submission Metadata footer */}
                    <div className="border-t border-slate-100 pt-4 text-xs text-slate-400 flex items-center justify-between">
                        <span>
                            Ngày nộp hồ sơ:{" "}
                            <strong className="text-slate-600">
                                {new Date(application.submitted_at).toLocaleString("vi-VN")}
                            </strong>
                        </span>
                        <span className="font-mono text-[11px]">ID: {application.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
