"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GoogleDots } from "@/components/landing/google-icons";

export function LoginForm({ nextPath }: { nextPath?: string }) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/dashboard/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const body = await response.json();
            setLoading(false);
            if (!response.ok) {
                setError(body.error ?? "Mật khẩu không chính xác");
                return;
            }
            router.replace(nextPath || "/dashboard");
            router.refresh();
        } catch {
            setLoading(false);
            setError("Lỗi kết nối mạng, vui lòng thử lại");
        }
    }

    return (
        <div className="w-full max-w-md">
            {/* Login Card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all sm:p-10">
                {/* Google accent top border bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto mb-4 flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="Google Developer Groups on Campus - PTIT"
                            width={320}
                            height={40}
                            priority
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Hệ Thống Quản Trị
                        </span>
                        <GoogleDots className="scale-75" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        GDGoC Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Đăng nhập quản trị viên để xét duyệt và quản lý đơn ứng tuyển Gen 5.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div>
                        <label
                            htmlFor="dashboard-password"
                            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
                        >
                            Mật khẩu truy cập
                        </label>
                        <div className="relative">
                            <input
                                id="dashboard-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Nhập mật khẩu quản trị..."
                                autoFocus
                                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#4285F4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                tabIndex={-1}
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 animate-in fade-in">
                            <svg className="h-5 w-5 shrink-0 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#4285F4] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-[#3367D6] hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Đang xác thực...</span>
                            </>
                        ) : (
                            <>
                                <span>Đăng nhập Dashboard</span>
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer back link */}
                <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#4285F4]"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Quay lại trang chủ tuyển quân GDGoC PTIT</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
